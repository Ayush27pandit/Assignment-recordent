import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/db';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

const MAX_ROWS = 10000;

const sanitizeString = (str: unknown): string => {
    if (str === null || str === undefined) return '';
    return String(str).trim().replace(/[<>]/g, '').substring(0, 1000);
};

const parseNumber = (val: unknown): number => {
    if (val === null || val === undefined || val === '') return 0;
    const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? 0 : Math.max(0, num);
};

const getFileType = (filename: string, mimetype: string): string => {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.csv') return 'CSV';
    if (ext === '.xlsx' || ext === '.xls') return 'Excel';
    return mimetype.includes('csv') ? 'CSV' : 'Excel';
};

const isProduction = env.NODE_ENV === 'production';

export const uploadBuyers = async (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const userId = req.userId;
    const originalName = req.file.originalname;
    const fileType = getFileType(originalName, req.file.mimetype);
    const buyers: any[] = [];

    try {
        if (req.file.mimetype === 'text/csv' || req.file.originalname.endsWith('.csv')) {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => {
                        if (buyers.length < MAX_ROWS) {
                            buyers.push(data);
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);

            if (worksheet) {
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber > 1 && buyers.length < MAX_ROWS) {
                        buyers.push({
                            name: row.getCell(1).value,
                            email: row.getCell(2).value,
                            mobile: row.getCell(3).value,
                            address: row.getCell(4).value,
                            total_invoice: row.getCell(5).value,
                            amount_paid: row.getCell(6).value,
                            amount_due: row.getCell(7).value,
                        });
                    }
                });
            }
        }

        if (buyers.length === 0) {
            return res.status(400).json({ message: 'No valid data found in file' });
        }

        const connection = await pool.getConnection();
        let uploadId: number | null = null;
        
        try {
            await connection.beginTransaction();

            const [uploadResult]: any = await connection.execute(
                'INSERT INTO uploads (user_id, filename, original_name, file_type, row_count) VALUES (?, ?, ?, ?, ?)',
                [userId, req.file.filename, originalName, fileType, buyers.length]
            );
            uploadId = uploadResult.insertId;

            let insertedCount = 0;
            for (const item of buyers) {
                const buyer: Record<string, unknown> = {};
                Object.keys(item).forEach(key => {
                    const normalizedKey = key.toLowerCase().trim().replace(/[\s_]+/g, '');
                    buyer[normalizedKey] = item[key];
                });

                const name = sanitizeString(buyer.name);
                const email = sanitizeString(buyer.email);
                const mobile = sanitizeString(buyer.mobile);
                const address = sanitizeString(buyer.address);
                const totalInvoice = parseNumber(buyer.totalinvoice ?? buyer.invoice ?? 0);
                const amountPaid = parseNumber(buyer.amountpaid ?? buyer.paid ?? 0);
                const amountDue = parseNumber(buyer.amountdue ?? buyer.due ?? 0);

                if (!name || !email || !mobile) {
                    continue;
                }

                await connection.execute(
                    'INSERT INTO buyers (user_id, upload_id, name, email, mobile, address, total_invoice, amount_paid, amount_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [userId, uploadId, name, email, mobile, address, totalInvoice, amountPaid, amountDue]
                );
                insertedCount++;
            }

            await connection.execute(
                'UPDATE uploads SET row_count = ? WHERE id = ?',
                [insertedCount, uploadId]
            );

            await connection.commit();
            res.status(200).json({
                message: `Successfully imported ${insertedCount} buyers`,
                count: insertedCount,
                uploadId,
                fileName: originalName
            });
        } catch (dbError: unknown) {
            await connection.rollback();
            console.error('Database error during import:', dbError);
            throw dbError;
        } finally {
            connection.release();
        }
    } catch (error: unknown) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            message: isProduction ? 'Failed to process file' : 'An error occurred while processing the file' 
        });
    } finally {
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                console.error('Failed to delete temp file:', e);
            }
        }
    }
};

export const getBuyers = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const uploadId = req.query.uploadId ? parseInt(req.query.uploadId as string) : null;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = sanitizeString(req.query.search as string).substring(0, 100);
    const dueStatus = (req.query.dueStatus as string) || 'all';
    const minInvoice = req.query.minInvoice ? parseFloat(req.query.minInvoice as string) : null;
    const maxInvoice = req.query.maxInvoice ? parseFloat(req.query.maxInvoice as string) : null;
    const offset = (page - 1) * limit;

    try {
        let query = 'SELECT id, name, email, mobile, address, total_invoice, amount_paid, amount_due, created_at FROM buyers WHERE user_id = ?';
        const params: unknown[] = [userId];

        if (uploadId) {
            query += ' AND upload_id = ?';
            params.push(uploadId);
        }

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        if (dueStatus === 'no_due') {
            query += ' AND amount_due = 0';
        } else if (dueStatus === 'has_due') {
            query += ' AND amount_due > 0';
        }

        if (minInvoice !== null && !isNaN(minInvoice)) {
            query += ' AND total_invoice >= ?';
            params.push(minInvoice);
        }

        if (maxInvoice !== null && !isNaN(maxInvoice)) {
            query += ' AND total_invoice <= ?';
            params.push(maxInvoice);
        }

        query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

        const [rows]: any = await pool.execute(query, params);

        let countQuery = 'SELECT COUNT(*) as total FROM buyers WHERE user_id = ?';
        const countParams: unknown[] = [userId];

        if (uploadId) {
            countQuery += ' AND upload_id = ?';
            countParams.push(uploadId);
        }

        if (search) {
            countQuery += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)';
            const searchParam = `%${search}%`;
            countParams.push(searchParam, searchParam, searchParam);
        }

        if (dueStatus === 'no_due') {
            countQuery += ' AND amount_due = 0';
        } else if (dueStatus === 'has_due') {
            countQuery += ' AND amount_due > 0';
        }

        if (minInvoice !== null && !isNaN(minInvoice)) {
            countQuery += ' AND total_invoice >= ?';
            countParams.push(minInvoice);
        }

        if (maxInvoice !== null && !isNaN(maxInvoice)) {
            countQuery += ' AND total_invoice <= ?';
            countParams.push(maxInvoice);
        }

        const [countResult]: any = await pool.execute(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            data: rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            filters: {
                dueStatus,
                minInvoice,
                maxInvoice,
                uploadId
            }
        });
    } catch (error: unknown) {
        console.error('Error in getBuyers:', error);
        res.status(500).json({ 
            message: isProduction ? 'Failed to fetch buyers' : 'An error occurred while fetching buyers' 
        });
    }
};

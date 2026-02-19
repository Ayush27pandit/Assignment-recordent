import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/db';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import fs from 'fs';
import { z } from 'zod';

const buyerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    mobile: z.string(),
    address: z.string().optional(),
    total_invoice: z.number(),
    amount_paid: z.number(),
    amount_due: z.number(),
});

export const uploadBuyers = async (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const userId = req.userId;
    const buyers: any[] = [];

    try {
        if (req.file.mimetype === 'text/csv') {
            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (data) => buyers.push(data))
                    .on('end', resolve)
                    .on('error', reject);
            });
        } else {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(filePath);
            const worksheet = workbook.getWorksheet(1);

            if (worksheet) {
                worksheet.eachRow((row, rowNumber) => {
                    if (rowNumber > 1) { // Skip header
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

        // Insert into DB
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            for (const buyer of buyers) {
                // Simple data cleaning/validation
                await connection.execute(
                    'INSERT INTO buyers (user_id, name, email, mobile, address, total_invoice, amount_paid, amount_due) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        userId,
                        buyer.name,
                        buyer.email,
                        buyer.mobile,
                        buyer.address || '',
                        buyer.total_invoice || 0,
                        buyer.amount_paid || 0,
                        buyer.amount_due || 0
                    ]
                );
            }

            await connection.commit();
            res.status(200).json({ message: `Successfully imported ${buyers.length} buyers` });
        } catch (dbError: any) {
            await connection.rollback();
            throw dbError;
        } finally {
            connection.release();
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    } finally {
        // Delete temp file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

export const getBuyers = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const offset = (page - 1) * limit;

    try {
        let query = 'SELECT * FROM buyers WHERE user_id = ?';
        let params: any[] = [userId];

        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [rows]: any = await pool.execute(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(*) as total FROM buyers WHERE user_id = ?';
        let countParams: any[] = [userId];

        if (search) {
            countQuery += ' AND (name LIKE ? OR email LIKE ? OR mobile LIKE ?)';
            const searchParam = `%${search}%`;
            countParams.push(searchParam, searchParam, searchParam);
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
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/db';
import { env } from '../config/env';

const isProduction = env.NODE_ENV === 'production';

export const getUploads = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const offset = (page - 1) * limit;

    try {
        const [rows]: any = await pool.execute(
            `SELECT id, filename, original_name, file_type, row_count, created_at 
             FROM uploads 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ${limit} OFFSET ${offset}`,
            [userId]
        );

        const [countResult]: any = await pool.execute(
            'SELECT COUNT(*) as total FROM uploads WHERE user_id = ?',
            [userId]
        );
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
    } catch (error: unknown) {
        console.error('Error in getUploads:', error);
        res.status(500).json({ 
            message: isProduction ? 'Failed to fetch uploads' : 'An error occurred while fetching uploads' 
        });
    }
};

export const getUploadById = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const uploadIdParam = req.params.id;
    const uploadId = parseInt(Array.isArray(uploadIdParam) ? uploadIdParam[0] : uploadIdParam);

    if (isNaN(uploadId)) {
        return res.status(400).json({ message: 'Invalid upload ID' });
    }

    try {
        const [rows]: any = await pool.execute(
            `SELECT id, filename, original_name, file_type, row_count, created_at 
             FROM uploads 
             WHERE id = ? AND user_id = ?`,
            [uploadId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        const [summaryResult]: any = await pool.execute(
            `SELECT 
                COUNT(*) as total_buyers,
                COALESCE(SUM(amount_due), 0) as total_due,
                COALESCE(SUM(amount_paid), 0) as total_paid,
                COALESCE(SUM(total_invoice), 0) as total_invoice,
                SUM(CASE WHEN amount_due = 0 THEN 1 ELSE 0 END) as no_due_count,
                SUM(CASE WHEN amount_due > 0 THEN 1 ELSE 0 END) as has_due_count
             FROM buyers 
             WHERE upload_id = ?`,
            [uploadId]
        );

        res.json({
            upload: rows[0],
            summary: summaryResult[0]
        });
    } catch (error: unknown) {
        console.error('Error in getUploadById:', error);
        res.status(500).json({ 
            message: isProduction ? 'Failed to fetch upload' : 'An error occurred while fetching upload' 
        });
    }
};

export const deleteUpload = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    const uploadIdParam = req.params.id;
    const uploadId = parseInt(Array.isArray(uploadIdParam) ? uploadIdParam[0] : uploadIdParam);

    if (isNaN(uploadId)) {
        return res.status(400).json({ message: 'Invalid upload ID' });
    }

    try {
        const [rows]: any = await pool.execute(
            'SELECT id FROM uploads WHERE id = ? AND user_id = ?',
            [uploadId, userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute('DELETE FROM buyers WHERE upload_id = ?', [uploadId]);
            await connection.execute('DELETE FROM uploads WHERE id = ?', [uploadId]);

            await connection.commit();
            res.json({ message: 'Upload deleted successfully' });
        } catch (dbError) {
            await connection.rollback();
            throw dbError;
        } finally {
            connection.release();
        }
    } catch (error: unknown) {
        console.error('Error in deleteUpload:', error);
        res.status(500).json({ 
            message: isProduction ? 'Failed to delete upload' : 'An error occurred while deleting upload' 
        });
    }
};

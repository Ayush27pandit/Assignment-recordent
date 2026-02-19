import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadBuyers, getBuyers } from '../controllers/buyerController';
import { getUploads, getUploadById, deleteUpload } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const sanitizeFilename = (filename: string): string => {
    const baseName = path.basename(filename, path.extname(filename));
    const ext = path.extname(filename).toLowerCase();
    const sanitizedBase = baseName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 100);
    return `${Date.now()}-${sanitizedBase}${ext}`;
};

const allowedMimeTypes = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const allowedExtensions = ['.csv', '.xls', '.xlsx'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, sanitizeFilename(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 5 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const hasValidExt = allowedExtensions.includes(ext);
        const hasValidMime = allowedMimeTypes.includes(file.mimetype);

        if (hasValidExt && (hasValidMime || file.mimetype === 'application/octet-stream')) {
            return cb(null, true);
        }
        
        cb(new Error('Only CSV and Excel files (.csv, .xls, .xlsx) are allowed'));
    }
});

router.post('/upload', authenticate, upload.single('file'), uploadBuyers);
router.get('/', authenticate, getBuyers);

router.get('/uploads', authenticate, getUploads);
router.get('/uploads/:id', authenticate, getUploadById);
router.delete('/uploads/:id', authenticate, deleteUpload);

export default router;

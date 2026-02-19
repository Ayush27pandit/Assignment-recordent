import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadBuyers, getBuyers } from '../controllers/buyerController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /csv|xlsx|xls/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.mimetype === 'application/vnd.ms-excel';

        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Only CSV and Excel files are allowed'));
    }
});

router.post('/upload', authenticate, upload.single('file'), uploadBuyers);
router.get('/', authenticate, getBuyers);

export default router;

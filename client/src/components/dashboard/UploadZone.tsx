import React, { useState, useRef } from 'react';
import { Upload, FileType, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const UploadZone: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const validateAndSetFile = (selectedFile: File) => {
        const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
        } else {
            toast.error('Please upload a CSV or Excel file');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/buyers/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success(response.data.message || 'File uploaded successfully');
            setFile(null);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-bold mb-2">Import Buyer Data</h3>
                <p className="text-neutral-400">Upload your CSV or Excel files to manage them in the dashboard.</p>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-white/10 bg-neutral-900/40'
                    } ${file ? 'border-primary/50 bg-primary/5' : ''}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv, .xls, .xlsx"
                    onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
                />

                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 text-neutral-400">
                                <Upload size={32} />
                            </div>
                            <p className="text-lg font-medium mb-2">Drag and drop your file here</p>
                            <p className="text-sm text-neutral-500 mb-8">Supports .csv, .xls, .xlsx (Max 5MB)</p>
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                Browse Files
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                                <CheckCircle2 size={32} />
                            </div>
                            <div className="bg-neutral-800 rounded-xl px-4 py-3 flex items-center space-x-3 mb-8 min-w-[300px]">
                                <FileType className="text-primary" size={24} />
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-1 hover:bg-white/5 rounded-md text-neutral-500 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex space-x-4">
                                <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading}>
                                    Cancel
                                </Button>
                                <Button onClick={handleUpload} isLoading={isUploading} className="px-8">
                                    Complete Import
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                            <AlertCircle size={20} />
                        </div>
                        <h4 className="font-semibold">Expected Format</h4>
                    </div>
                    <p className="text-sm text-neutral-400 mb-4">
                        Place headers in the first row. Use Name, Email, Mobile, Address, Total Invoice, Paid, and Due columns.
                    </p>
                    <a href="#" className="text-sm text-primary hover:underline font-medium">Download Sample Template</a>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4 text-green-400">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <CheckCircle2 size={20} />
                        </div>
                        <h4 className="font-semibold text-white">Validation</h4>
                    </div>
                    <p className="text-sm text-neutral-400">
                        Our system automatically validates your records to ensure email and mobile formats are correct before importing.
                    </p>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useRef } from "react";
import { Upload, FileType, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "../ui/Button";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";


export const UploadZone: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useNavigate()

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
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (
      validTypes.includes(selectedFile.type) ||
      selectedFile.name.endsWith(".csv") ||
      selectedFile.name.endsWith(".xlsx") ||
      selectedFile.name.endsWith(".xls")
    ) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
    } else {
      toast.error("Please upload a CSV or Excel file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/buyers/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "File uploaded successfully");
      //navigate user to BuyersTable
      setIsSuccess(true)
      router("/dashboard/buyers")

      setFile(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold mb-2 text-gray-900">
          Import Buyer Data
        </h3>
        <p className="text-gray-500">
          Upload your CSV or Excel files to manage them in the dashboard.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all ${isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-gray-200 bg-gray-50/30"
          } ${file ? "border-primary/50 bg-primary/5" : ""}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv, .xls, .xlsx"
          onChange={(e) =>
            e.target.files && validateAndSetFile(e.target.files[0])
          }
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-400">
                <Upload size={32} />
              </div>
              <p className="text-lg font-bold text-gray-900 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Supports .csv, .xls, .xlsx (Max 5MB)
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
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
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-3 flex items-center space-x-3 mb-8 min-w-[300px]">
                <FileType className="text-primary" size={24} />
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-gray-50 rounded-md text-gray-400 hover:text-gray-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  isLoading={isUploading}
                  className="px-8 shadow-lg shadow-purple-500/20"
                >
                  Complete Import
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            <h4 className="font-bold text-gray-900">Expected Format</h4>
          </div>
          <p className="text-sm text-gray-500 mb-4 leading-relaxed">
            Place headers in the first row. Use Name, Email, Mobile, Address,
            Total Invoice, Paid, and Due columns.
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-4 text-green-600">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 size={20} />
            </div>
            <h4 className="font-bold text-gray-900">Validation</h4>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our system automatically validates your records to ensure email and
            mobile formats are correct before importing.
          </p>
        </div>
      </div>
    </div>
  );
};

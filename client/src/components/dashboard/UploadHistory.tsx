import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { FileSpreadsheet, Calendar, Users, Trash2, Eye, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface Upload {
    id: number;
    filename: string;
    original_name: string;
    file_type: string;
    row_count: number;
    created_at: string;
}

interface FetchResponse {
    data: Upload[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const UploadHistory: React.FC = () => {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(1);
    const limit = 10;

    const { data, isLoading, error, refetch } = useQuery<FetchResponse>({
        queryKey: ['uploads', page],
        queryFn: async () => {
            const response = await api.get('/buyers/uploads', {
                params: { page, limit }
            });
            return response.data;
        },
    });

    const handleDelete = async (uploadId: number, fileName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${fileName}" and all its buyers?`)) {
            return;
        }

        try {
            await api.delete(`/buyers/uploads/${uploadId}`);
            toast.success('Upload deleted successfully');
            refetch();
        } catch (error: unknown) {
            toast.error('Failed to delete upload');
        }
    };

    const handleViewBuyers = (uploadId: number) => {
        navigate(`/dashboard/history/${uploadId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (error) return <div className="text-red-500">Error loading uploads.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload History</h2>
                    <p className="text-gray-500 mt-1">View and manage your uploaded files</p>
                </div>
                <Button onClick={() => navigate('/dashboard/import')}>
                    <FileSpreadsheet size={18} className="mr-2" />
                    New Upload
                </Button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                {isLoading ? (
                    <div className="p-8 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : data?.data.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No uploads yet</h3>
                        <p className="text-gray-500 mb-6">Upload your first CSV or Excel file to get started</p>
                        <Button onClick={() => navigate('/dashboard/import')}>
                            Upload File
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {data?.data.map((upload) => (
                            <div 
                                key={upload.id} 
                                className="p-4 hover:bg-gray-50/50 transition-colors group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                            upload.file_type === 'CSV' 
                                                ? 'bg-green-100 text-green-600' 
                                                : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            <FileSpreadsheet size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                {upload.original_name}
                                            </h3>
                                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <Calendar size={14} className="mr-1" />
                                                    {formatDate(upload.created_at)}
                                                </span>
                                                <span className="flex items-center">
                                                    <Users size={14} className="mr-1" />
                                                    {upload.row_count.toLocaleString()} buyers
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                    upload.file_type === 'CSV' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {upload.file_type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleViewBuyers(upload.id)}
                                        >
                                            <Eye size={16} className="mr-2" />
                                            View Buyers
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(upload.id, upload.original_name)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {data && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-gray-900">{(page - 1) * limit + 1}</span> to{' '}
                            <span className="text-gray-900">
                                {Math.min(page * limit, data.pagination.total)}
                            </span>{' '}
                            of <span className="text-gray-900">{data.pagination.total}</span> uploads
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${page === p
                                                ? 'bg-primary text-white shadow-md shadow-purple-500/20'
                                                : 'hover:bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === data.pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

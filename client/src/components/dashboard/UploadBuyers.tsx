import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { Search, ChevronLeft, ChevronRight, Filter, X, DollarSign, TrendingUp, ArrowLeft, FileSpreadsheet, Users, Calendar, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

interface Buyer {
    id: number;
    name: string;
    email: string;
    mobile: string;
    address: string;
    total_invoice: number;
    amount_paid: number;
    amount_due: number;
    created_at: string;
}

interface UploadDetail {
    id: number;
    filename: string;
    original_name: string;
    file_type: string;
    row_count: number;
    created_at: string;
}

interface UploadSummary {
    total_buyers: number;
    total_due: number;
    total_paid: number;
    total_invoice: number;
    no_due_count: number;
    has_due_count: number;
}

interface FetchResponse {
    data: Buyer[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    filters?: {
        dueStatus: string;
        minInvoice: number | null;
        maxInvoice: number | null;
        uploadId: number | null;
    };
}

type DueStatus = 'all' | 'no_due' | 'has_due';

export const UploadBuyers: React.FC = () => {
    const { uploadId } = useParams<{ uploadId: string }>();
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [dueStatus, setDueStatus] = useState<DueStatus>('all');
    const [minInvoice, setMinInvoice] = useState('');
    const [maxInvoice, setMaxInvoice] = useState('');
    const [appliedFilters, setAppliedFilters] = useState<{
        dueStatus: DueStatus;
        minInvoice: string;
        maxInvoice: string;
    }>({
        dueStatus: 'all',
        minInvoice: '',
        maxInvoice: ''
    });
    const limit = 10;

    const { data: uploadData } = useQuery<{
        upload: UploadDetail;
        summary: UploadSummary;
    }>({
        queryKey: ['upload', uploadId],
        queryFn: async () => {
            const response = await api.get(`/buyers/uploads/${uploadId}`);
            return response.data;
        },
        enabled: !!uploadId,
    });

    const { data, isLoading, error, refetch } = useQuery<FetchResponse>({
        queryKey: ['buyers', page, search, appliedFilters, uploadId],
        queryFn: async () => {
            const params: Record<string, string | number> = { page, limit, search, uploadId: uploadId! };
            if (appliedFilters.dueStatus !== 'all') {
                params.dueStatus = appliedFilters.dueStatus;
            }
            if (appliedFilters.minInvoice) {
                params.minInvoice = appliedFilters.minInvoice;
            }
            if (appliedFilters.maxInvoice) {
                params.maxInvoice = appliedFilters.maxInvoice;
            }
            const response = await api.get('/buyers', { params });
            return response.data;
        },
        enabled: !!uploadId,
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const applyFilters = () => {
        setAppliedFilters({
            dueStatus,
            minInvoice,
            maxInvoice
        });
        setPage(1);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setDueStatus('all');
        setMinInvoice('');
        setMaxInvoice('');
        setAppliedFilters({
            dueStatus: 'all',
            minInvoice: '',
            maxInvoice: ''
        });
        setPage(1);
    };

    const handleDeleteUpload = async () => {
        if (!uploadData || !window.confirm(`Are you sure you want to delete "${uploadData.upload.original_name}" and all its buyers?`)) {
            return;
        }

        try {
            await api.delete(`/buyers/uploads/${uploadId}`);
            toast.success('Upload deleted successfully');
            navigate('/dashboard/history');
        } catch (error: unknown) {
            toast.error('Failed to delete upload');
        }
    };

    const hasActiveFilters = 
        appliedFilters.dueStatus !== 'all' || 
        appliedFilters.minInvoice || 
        appliedFilters.maxInvoice;

    const getActiveFilterCount = () => {
        let count = 0;
        if (appliedFilters.dueStatus !== 'all') count++;
        if (appliedFilters.minInvoice) count++;
        if (appliedFilters.maxInvoice) count++;
        return count;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (error) return <div className="text-red-500">Error loading data.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/history')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back to History
                </Button>
            </div>

            {uploadData && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                uploadData.upload.file_type === 'CSV' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-blue-100 text-blue-600'
                            }`}>
                                <FileSpreadsheet size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{uploadData.upload.original_name}</h2>
                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        {formatDate(uploadData.upload.created_at)}
                                    </span>
                                    <span className="flex items-center">
                                        <Users size={14} className="mr-1" />
                                        {uploadData.upload.row_count.toLocaleString()} buyers
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={handleDeleteUpload}
                        >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-sm text-gray-500">Total Invoice</p>
                            <p className="text-xl font-bold text-gray-900">
                                ${Number(uploadData.summary.total_invoice).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <p className="text-sm text-green-600">Total Paid</p>
                            <p className="text-xl font-bold text-green-700">
                                ${Number(uploadData.summary.total_paid).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4">
                            <p className="text-sm text-red-600">Total Due</p>
                            <p className="text-xl font-bold text-red-700">
                                ${Number(uploadData.summary.total_due).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-sm text-blue-600">Buyers</p>
                            <p className="text-xl font-bold text-blue-700">
                                {uploadData.summary.total_buyers}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4 text-sm">
                        <span className="text-green-600 font-medium">
                            {uploadData.summary.no_due_count} fully paid
                        </span>
                        <span className="text-red-600 font-medium">
                            {uploadData.summary.has_due_count} with due
                        </span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative w-full max-w-md">
                    <Input
                        placeholder="Search by name, email or mobile..."
                        value={search}
                        onChange={handleSearch}
                        icon={<Search size={18} />}
                        className="w-full"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <Button 
                        variant={hasActiveFilters ? "primary" : "outline"} 
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={hasActiveFilters ? 'bg-primary text-white' : ''}
                    >
                        <Filter size={16} className="mr-2" />
                        Filters
                        {getActiveFilterCount() > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-white/20 rounded-full">
                                {getActiveFilterCount()}
                            </span>
                        )}
                    </Button>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X size={16} className="mr-1" />
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Filter Buyers</h3>
                        <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Status
                            </label>
                            <div className="flex space-x-2">
                                {[
                                    { value: 'all', label: 'All' },
                                    { value: 'has_due', label: 'Has Due', color: 'text-red-600' },
                                    { value: 'no_due', label: 'No Due', color: 'text-green-600' }
                                ].map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => setDueStatus(option.value as DueStatus)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            dueStatus === option.value
                                                ? 'bg-primary text-white shadow-md'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign size={14} className="inline mr-1" />
                                Min Invoice Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={minInvoice}
                                    onChange={(e) => setMinInvoice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <DollarSign size={14} className="inline mr-1" />
                                Max Invoice Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                <input
                                    type="number"
                                    placeholder="No limit"
                                    value={maxInvoice}
                                    onChange={(e) => setMaxInvoice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                            Reset
                        </Button>
                        <Button size="sm" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}

            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    {appliedFilters.dueStatus !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {appliedFilters.dueStatus === 'has_due' ? 'Has Due' : 'No Due'}
                            <button 
                                onClick={() => {
                                    setDueStatus('all');
                                    setAppliedFilters(prev => ({ ...prev, dueStatus: 'all' }));
                                }}
                                className="ml-2 hover:text-primary/70"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {appliedFilters.minInvoice && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Min: ${Number(appliedFilters.minInvoice).toLocaleString()}
                            <button 
                                onClick={() => {
                                    setMinInvoice('');
                                    setAppliedFilters(prev => ({ ...prev, minInvoice: '' }));
                                }}
                                className="ml-2 hover:text-green-700/70"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                    {appliedFilters.maxInvoice && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            Max: ${Number(appliedFilters.maxInvoice).toLocaleString()}
                            <button 
                                onClick={() => {
                                    setMaxInvoice('');
                                    setAppliedFilters(prev => ({ ...prev, maxInvoice: '' }));
                                }}
                                className="ml-2 hover:text-blue-700/70"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    )}
                </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Invoice</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Paid</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-gray-50" />
                                    </tr>
                                ))
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <TrendingUp size={40} className="text-gray-300 mb-2" />
                                            <p>No buyers found</p>
                                            {hasActiveFilters && (
                                                <button 
                                                    onClick={clearFilters}
                                                    className="mt-2 text-primary hover:underline text-sm"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((buyer) => (
                                    <tr key={buyer.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{buyer.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 font-medium">{buyer.email}</div>
                                            <div className="text-xs text-gray-400">{buyer.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-sm text-gray-500">
                                            {buyer.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            ${Number(buyer.total_invoice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                                            ${Number(buyer.amount_paid).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-bold ${buyer.amount_due > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                ${Number(buyer.amount_due).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-500 font-medium">
                            Showing <span className="text-gray-900">{(page - 1) * limit + 1}</span> to{' '}
                            <span className="text-gray-900">
                                {Math.min(page * limit, data.pagination.total)}
                            </span>{' '}
                            of <span className="text-gray-900">{data.pagination.total}</span> results
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

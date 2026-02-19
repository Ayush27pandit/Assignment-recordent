import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { Search, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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

interface FetchResponse {
    data: Buyer[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const BuyerTable: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = 10;

    const { data, isLoading, error } = useQuery<FetchResponse>({
        queryKey: ['buyers', page, search],
        queryFn: async () => {
            const response = await api.get('/buyers', {
                params: { page, limit, search }
            });
            return response.data;
        },
    });

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    if (error) return <div className="text-red-500">Error loading data.</div>;

    return (
        <div className="space-y-6">
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
                    <Button variant="outline" size="sm">
                        <Filter size={16} className="mr-2" />
                        Filters
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download size={16} className="mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-900/50 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Invoice</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Paid</th>
                                <th className="px-6 py-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-neutral-900/20" />
                                    </tr>
                                ))
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        No buyers found.
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((buyer) => (
                                    <tr key={buyer.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-white group-hover:text-primary transition-colors">{buyer.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-neutral-300">{buyer.email}</div>
                                            <div className="text-xs text-neutral-500">{buyer.mobile}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-sm text-neutral-400">
                                            {buyer.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            ${Number(buyer.total_invoice).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-green-400">
                                            ${Number(buyer.amount_paid).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-red-400">
                                            ${Number(buyer.amount_due).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 bg-neutral-900/30 border-t border-white/5 flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                            Showing <span className="text-white">{(page - 1) * limit + 1}</span> to{' '}
                            <span className="text-white">
                                {Math.min(page * limit, data.pagination.total)}
                            </span>{' '}
                            of <span className="text-white">{data.pagination.total}</span> results
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
                                            className={`w-8 h-8 rounded-lg text-sm transition-all ${page === p ? 'bg-primary text-white' : 'hover:bg-white/5 text-neutral-400'
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

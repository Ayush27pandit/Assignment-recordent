import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { BuyerTable } from '../components/dashboard/BuyerTable';

export const BuyersPage: React.FC = () => {
    return (
        <DashboardLayout>
            <BuyerTable />
        </DashboardLayout>
    );
};

export const ImportPage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <UploadZoneWrapper />
            </div>
        </DashboardLayout>
    );
};

import { UploadZone } from '../components/dashboard/UploadZone';
const UploadZoneWrapper = () => <UploadZone />;

export const DashboardHome: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-neutral-400 text-sm font-medium mb-1">Total Buyers</p>
                    <h4 className="text-3xl font-bold">1,284</h4>
                    <div className="mt-4 flex items-center text-green-400 text-xs font-medium">
                        <span className="bg-green-400/10 px-1.5 py-0.5 rounded mr-2">+12%</span>
                        from last month
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-neutral-400 text-sm font-medium mb-1">Invoiced Amount</p>
                    <h4 className="text-3xl font-bold">$42,850</h4>
                    <div className="mt-4 flex items-center text-neutral-500 text-xs font-medium">
                        Updated just now
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-white/5">
                    <p className="text-neutral-400 text-sm font-medium mb-1">Pending Dues</p>
                    <h4 className="text-3xl font-bold text-red-400">$8,120</h4>
                    <div className="mt-4 flex items-center text-red-400 text-xs font-medium">
                        Attention required
                    </div>
                </div>
            </div>

            <div className="glass p-8 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold mb-6">Recent Activity</h3>
                <p className="text-neutral-500 text-sm">Dashboard metrics implementation in progress...</p>
            </div>
        </DashboardLayout>
    );
};

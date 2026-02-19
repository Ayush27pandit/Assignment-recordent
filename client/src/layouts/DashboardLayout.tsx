import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Database, Upload, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { label: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { label: 'Manage Buyers', icon: <Database size={20} />, path: '/dashboard/buyers' },
        { label: 'Import Data', icon: <Upload size={20} />, path: '/dashboard/import' },
    ];

    return (
        <div className="min-h-screen bg-neutral-950 flex text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-white" size={18} />
                        </div>
                        <span className="font-bold tracking-tight">BuyerPortal</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="bg-neutral-800/50 rounded-2xl p-4 mb-4">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-neutral-400 hover:text-white"
                        onClick={logout}
                    >
                        <LogOut size={20} className="mr-3" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-neutral-950/80 backdrop-blur-md z-40">
                    <h2 className="text-xl font-semibold capitalize">
                        {location.pathname.split('/').pop() || 'Overview'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        {/* Add notifications or search here if needed */}
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

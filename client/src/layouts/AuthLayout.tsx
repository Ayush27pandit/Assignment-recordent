import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({
    children,
    title,
    subtitle
}) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gray-50 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">{title}</h1>
                        <p className="text-gray-600">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

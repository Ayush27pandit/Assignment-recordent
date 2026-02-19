import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'flex h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-gray-400',
                            icon && 'pl-10',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

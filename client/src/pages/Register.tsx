import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, Check, X } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z.string().min(10, 'Invalid mobile number'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password is too long')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
    { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
];

export const Register: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');
    
    useEffect(() => {
        setPasswordValue(password);
    }, [password]);

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setServerErrors({});
        try {
            await api.post('/auth/register', data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: unknown) {
            const axiosError = error as { response?: { data?: { message?: string; errors?: Array<{ path: string[]; message: string }> } } };
            const responseData = axiosError.response?.data;
            
            if (responseData?.errors && Array.isArray(responseData.errors)) {
                const fieldErrors: Record<string, string> = {};
                responseData.errors.forEach((err) => {
                    const field = err.path[0];
                    if (field) {
                        fieldErrors[field] = err.message;
                    }
                });
                setServerErrors(fieldErrors);
                
                const firstError = Object.values(fieldErrors)[0];
                if (firstError) {
                    toast.error(firstError);
                }
            } else {
                toast.error(responseData?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldError = (field: string): string | undefined => {
        return serverErrors[field] || errors[field as keyof typeof errors]?.message;
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join us today and manage your buyers efficiently"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Full Name"
                    placeholder="John Doe"
                    icon={<User size={18} />}
                    error={getFieldError('name')}
                    {...register('name')}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    icon={<Mail size={18} />}
                    error={getFieldError('email')}
                    {...register('email')}
                />
                <Input
                    label="Mobile Number"
                    placeholder="+1 234 567 890"
                    icon={<Phone size={18} />}
                    error={getFieldError('mobile')}
                    {...register('mobile')}
                />
                
                <div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        error={getFieldError('password')}
                        {...register('password')}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                    />
                    
                    {(passwordFocused || passwordValue) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-xs font-medium text-gray-600 mb-2">Password requirements:</p>
                            <div className="space-y-1.5">
                                {passwordRequirements.map((req, index) => {
                                    const isValid = req.test(passwordValue);
                                    return (
                                        <div 
                                            key={index} 
                                            className={`flex items-center gap-2 text-xs transition-colors ${
                                                isValid ? 'text-green-600' : 'text-gray-400'
                                            }`}
                                        >
                                            {isValid ? (
                                                <Check size={14} className="flex-shrink-0" />
                                            ) : (
                                                <X size={14} className="flex-shrink-0" />
                                            )}
                                            <span>{req.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    error={getFieldError('confirmPassword')}
                    {...register('confirmPassword')}
                />

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isLoading}
                >
                    <UserPlus size={18} className="mr-2" />
                    Create Account
                </Button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

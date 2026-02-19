import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    identifier: z.string().min(1, 'Email or Mobile is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            const { accessToken, user } = response.data;
            authLogin(accessToken, user);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to your account to continue"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Email or Mobile"
                    placeholder="Enter your email or mobile"
                    icon={<Mail size={18} />}
                    error={errors.identifier?.message}
                    {...register('identifier')}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    error={errors.password?.message}
                    {...register('password')}
                />

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 bg-white" />
                        <span>Remember me</span>
                    </label>
                    <a href="#" className="text-primary hover:underline">Forgot password?</a>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    isLoading={isLoading}
                >
                    <LogIn size={18} className="mr-2" />
                    Sign In
                </Button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { AuthLayout } from '../layouts/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../api/axios';
import toast from 'react-hot-toast';

const registerSchema = z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    mobile: z.string().min(10, 'Invalid mobile number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        try {
            await api.post('/auth/register', data);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                    error={errors.name?.message}
                    {...register('name')}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    icon={<Mail size={18} />}
                    error={errors.email?.message}
                    {...register('email')}
                />
                <Input
                    label="Mobile Number"
                    placeholder="+1 234 567 890"
                    icon={<Phone size={18} />}
                    error={errors.mobile?.message}
                    {...register('mobile')}
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    error={errors.password?.message}
                    {...register('password')}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={18} />}
                    error={errors.confirmPassword?.message}
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

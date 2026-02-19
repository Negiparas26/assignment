"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await axios.post('https://assignment-jlkw.onrender.com/api/auth/register', data);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Form Side */}
            <div className="flex w-full items-center justify-center lg:w-1/2 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-lg space-y-8 bg-white p-10 rounded-2xl shadow-xl ring-1 ring-gray-900/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-green-500 to-teal-600"></div>

                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-500">Join thousands of teams managing their tasks effectively</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-5">
                            <Input
                                label="Username"
                                type="text"
                                placeholder="johndoe"
                                {...register('username')}
                                error={errors.username?.message}
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                            <Input
                                label="Email address"
                                type="email"
                                placeholder="you@company.com"
                                {...register('email')}
                                error={errors.email?.message}
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                error={errors.password?.message}
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />

                            {/* Role selection removed */}
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-3 border border-red-100 text-center text-sm text-red-700 font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-base font-semibold shadow-lg shadow-gray-500/20 transform transition hover:-translate-y-0.5"
                                isLoading={isSubmitting}
                            >
                                Create Account <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">Already have an account? </span>
                            <Link href="/login" className="font-semibold text-green-600 hover:text-green-500 transition-colors hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Decorative Gradient Side - Right Side for Register */}
            <div className="hidden w-1/2 bg-gradient-to-bl from-gray-900 via-gray-800 to-black lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-green-400 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse"></div>
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse animation-delay-2000"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="z-10 text-center text-white"
                >
                    <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl skew-y-3 transform transition hover:skew-y-0 hover:scale-110 duration-500">
                        <UserPlus className="h-12 w-12 text-green-400" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-300">
                        Join the Revolution
                    </h1>
                    <p className="max-w-md mx-auto text-lg text-gray-300 font-light leading-relaxed">
                        Experience the future of project management. Designed for speed, built for collaboration.
                    </p>

                    <div className="mt-12 flex justify-center gap-6 text-sm font-medium text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
                            Free Forever
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                            No Credit Card
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

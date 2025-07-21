'use client'

import { authService } from '@/lib/services/authService';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import Link from 'next/link';
import { useForm } from 'react-hook-form';

interface ResendVerificationFormData {
    email: string;
}

const ResendVerification = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<ResendVerificationFormData>();

    const onSubmit = async (data: ResendVerificationFormData) => {
        try {
            const res = await authService.resendVerification(data.email);
            if (res?.data) {
                // Hiển thị thông báo thành công
                alert('Verification email has been sent. Please check your inbox.');
                router.push('/auth/login');
            } else {
                setError("root", {
                    type: "manual",
                    message: "Failed to send verification email. Please try again."
                });
            }
        } catch (error) {
            console.error('Resend verification failed:', error);
            setError("root", {
                type: "manual",
                message: "An error occurred. Please try again later."
            });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <div className="w-full max-w-md bg-gray-900/20 backdrop-blur-sm border border-gray-800 dark:border-gray-700 rounded-2xl p-8 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                        <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                            <div className="w-6 h-6 bg-gray-900 rounded-sm flex items-center justify-center">
                                <div className="w-3 h-3 bg-white transform rotate-12 rounded-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">Resend Verification Email</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Enter your email to receive a new verification link</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="enter your email address..."
                                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 h-12 pr-10"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}

                    <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600 text-white h-12 mb-6">
                        Resend Verification
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/auth/login" className="text-gray-500 hover:text-gray-400 text-sm">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResendVerification;

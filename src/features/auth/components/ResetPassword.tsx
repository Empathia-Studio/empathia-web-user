'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthActions } from '../hooks';
import { useState, useEffect } from 'react';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isTokenUsed, setIsTokenUsed] = useState(false);
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordFormData>();
    const { viewState, resetPassword } = useAuthActions();
    const { loading, error } = viewState;
    
    const password = watch('password');

    // Kiểm tra token khi component mount
    useEffect(() => {
        if (token) {
            // Kiểm tra xem token đã được sử dụng chưa (từ localStorage)
            const usedTokens = JSON.parse(localStorage.getItem('usedResetTokens') || '[]');
            if (usedTokens.includes(token)) {
                setIsTokenUsed(true);
                setIsTokenValid(false);
            } else {
                setIsTokenValid(true);
            }
        } else {
            setIsTokenValid(false);
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token || isTokenUsed) {
            alert('Invalid reset token. Please request a new password reset link.');
            router.push('/auth/forgot-password');
            return;
        }
        
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        const result = await resetPassword(token, data.password);
        if (result.success) {
            // Lưu token vào danh sách đã sử dụng
            const usedTokens = JSON.parse(localStorage.getItem('usedResetTokens') || '[]');
            usedTokens.push(token);
            localStorage.setItem('usedResetTokens', JSON.stringify(usedTokens));
            
            setIsTokenUsed(true);
            alert('Password has been reset successfully. You can now login with your new password.');
            router.push('/auth/login');
        }
    };

    // Hiển thị khi không có token
    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
                    <div className="text-center mb-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Invalid Reset Link</h1>
                        <p className="text-foreground text-sm">This password reset link is invalid or missing.</p>
                    </div>
                    <div className="text-center">
                        <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm">Request New Reset Link</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị khi token đã được sử dụng
    if (isTokenUsed) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
                    <div className="text-center mb-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Password Already Reset</h1>
                        <p className="text-foreground text-sm">This password reset link has already been used. Your password was successfully changed.</p>
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground text-sm">You can now login with your new password.</p>
                        <Link href="/auth/login" className="text-primary hover:underline text-sm">Go to Login</Link>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị khi đang kiểm tra token
    if (isTokenValid === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-foreground text-sm">Validating reset link...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị form reset password
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
                <div className="flex items-center justify-center mb-6 cursor-pointer" onClick={()=>router.push('/')}>
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-background rounded-full relative">
                            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Reset Password</h1>
                    <p className="text-foreground text-sm">Enter your new password below</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm text-foreground mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your new password..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-20 pl-10"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 3,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-sm text-foreground mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your new password..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-20 pl-10"
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-12 mb-6" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/auth/login" className="text-primary hover:underline text-sm">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;

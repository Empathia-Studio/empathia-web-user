'use client'

import { useRouter } from 'next/navigation';
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Mail } from "lucide-react"
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthActions } from '../hooks';

interface ResendVerificationFormData {
    email: string;
}

const ResendVerification = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, setError } = useForm<ResendVerificationFormData>();
    const { viewState, resendVerification } = useAuthActions();
    const { loading, error } = viewState;
    
    const onSubmit = async (data: ResendVerificationFormData) => {
        const result = await resendVerification(data.email);
        if (result.success) {
            alert('Verification email has been sent. Please check your inbox.');
            router.push('/auth/login');
        }
    };

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
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Resend Verification Email</h1>
                    <p className="text-foreground text-sm">Enter your email to receive a new verification link</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm text-foreground mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                placeholder="enter your email address..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-10"
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-12 mb-6" disabled={loading}>
                        {loading ? 'Sending...' : 'Resend Verification'}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/auth/login" className="text-primary hover:underline text-sm">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResendVerification;

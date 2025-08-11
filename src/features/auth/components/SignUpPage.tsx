'use client'
import { useGoogleLogin } from '@react-oauth/google';
import { authApi } from '@/features/auth/services/auth.api';
import { useRouter } from 'next/navigation';
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Apple, Mail, Lock, User } from "lucide-react"
import Link from 'next/link';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useAuthActions } from '../hooks';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

const SignUpPage = () => {
    const router = useRouter();
    const { 
        viewState, 
        register: registerUser, 
        googleLoading, 
        googleError, 
        startGoogleLogin 
    } = useAuthActions();
    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<SignUpFormData>();
    const { loading: registerLoading, error: registerError } = viewState;
    const password = watch("password");

    const onSubmit = async (data: SignUpFormData) => {
        const result = await registerUser(data.name, data.email, data.password);
        if (result.success) {
            alert('Registration successful! Please check your email for verification.');
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
                    <h1 className="text-2xl font-semibold text-foreground mb-2">Create your account</h1>
                    <p className="text-muted-foreground text-sm">Join Empathia and start sharing</p>
                </div>
    
                <div className="space-y-3 mb-6">
                    <Button
                        variant="outline"
                        className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12"
                    >
                        <Apple className="w-5 h-5 mr-3" />
                        Sign up with Apple
                    </Button>
    
                    <Button
                        variant="outline"
                        className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12"
                        onClick={() => startGoogleLogin()}
                    >
                        <GoogleIcon />
                        Sign up with Google
                    </Button>
                </div>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-muted text-muted-foreground rounded-full">Or continue with</span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm text-foreground mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <Input
                                id="name"
                                type="text"
                                placeholder="(optional) enter your full name..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-10"
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    <div>
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

                    <div>
                        <label htmlFor="password" className="block text-sm text-foreground mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="create a password..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-10"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm text-foreground mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="confirm your password..."
                                className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground h-12 pr-10"
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: (value: string) => value === password || "Passwords do not match"
                                })}
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {registerError && <p className="text-red-500 text-sm mt-1">{registerError}</p>}

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-12 mt-6 mb-6" disabled={registerLoading}>
                        {registerLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>
    
                <div className="text-center">
                    <Link href="/auth/login" className="text-primary hover:underline text-sm">Already have an account? Sign in here.</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;


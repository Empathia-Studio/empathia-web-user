'use client'
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '@/lib/services/authService';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Apple, Mail, Lock, User } from "lucide-react"
import Link from 'next/link';
import axios from 'axios';
import { useForm } from 'react-hook-form';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const SignUpPage = () => {
    const router = useRouter();
    const { register, handleSubmit, watch, formState: { errors }, setError } = useForm<SignUpFormData>();
    const password = watch("password");

    const onSubmit = async (data: SignUpFormData) => {
        try {
            var res = await authService.checkEmail(data.email);
            if(res.exists){
                setError("email", {
                    type: "manual",
                    message: "Email already exists"
                });
                return;
            }
            await authService.register(data.name, data.email, data.password);
        } catch (error) {
            console.error('Registration failed:', error);
            setError("root", {
                type: "manual",
                message: "Registration failed. Please try again."
            });
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                // Exchange code for tokens
                const tokens = await axios.post('https://oauth2.googleapis.com/token', {
                    code: codeResponse.code,
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
                    redirect_uri: window.location.origin,
                    grant_type: 'authorization_code',
                });

                // Send id_token to backend
                const res = await authService.loginWithGoogle(tokens.data.id_token);
                
                if (res.token) {
                    localStorage.setItem('auth_token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    router.push('/chat');
                }
            } catch (error) {
                console.error('Sign up failed:', error);
            }
        },
        flow: 'auth-code',
        onError: () => console.log('Sign up Failed')
    });

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
                    <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">Create your account</h1>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Join Empathia and start sharing</p>
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
                        onClick={() => login()}
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
                        <span className="px-2 bg-gray-900/70 text-gray-300 dark:text-gray-300 rounded-full">Or continue with</span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <Input
                                id="name"
                                type="text"
                                placeholder="(optional) enter your full name..."
                                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 h-12 pr-10"
                            />
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-cyan-400" />
                        </div>
                    </div>

                    <div>
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
                            <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-cyan-400" />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                placeholder="create a password..."
                                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 h-12 pr-10"
                                {...register("password", { 
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters"
                                    }
                                })}
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-cyan-400" />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="confirm your password..."
                                className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 h-12 pr-10"
                                {...register("confirmPassword", { 
                                    required: "Please confirm your password",
                                    validate: (value: string) => value === password || "Passwords do not match"
                                })}
                            />
                            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-cyan-400" />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}

                    <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600 text-white h-12 mt-6 mb-6">
                        Create Account
                    </Button>
                </form>
    
                <div className="text-center">
                    <Link href="/auth/login" className="text-gray-500 hover:text-gray-400 text-sm">Already have an account? Sign in here.</Link>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;


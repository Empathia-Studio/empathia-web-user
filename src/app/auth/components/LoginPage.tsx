'use client'
import { useGoogleLogin } from '@react-oauth/google';
import { authService } from '@/lib/services/authService';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Apple, Mail, Lock } from "lucide-react"
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "@/lib/contexts/AuthContext";
import User from '@/models/User';
interface LoginFormData {
  email: string;
  password: string;
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

const LoginPage = () => {
    const router = useRouter();
    const { setAuthState } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors }, setError, setValue } = useForm<LoginFormData>({
        defaultValues: {
            email: '',
            password: ''
        },
        shouldUnregister: false
    });
    
    const password = watch("password");
    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                const tokens = await axios.post('https://oauth2.googleapis.com/token', {
                    code: codeResponse.code,
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
                    redirect_uri: window.location.origin,
                    grant_type: 'authorization_code',
                });

                const res = await authService.loginWithGoogle(tokens.data.id_token);
                if (res.token) {
                    const userData = res.user as User;
                    localStorage.setItem('auth_token', res.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    setAuthState(true, userData);
                    router.push('/chat');
                }
            } catch (error) {
                console.error('Login failed:', error);
            }
        },
        flow: 'auth-code',
        onError: () => console.log('Login Failed')
    });

    const onSubmit = async (data:LoginFormData) => {
      const userResponse = await authService.getByEmail(data.email);
      if(!userResponse?.data) {
        setError("email", {
          type: "manual",
          message: "Email not found"
        });
        return;
      }
      
      if(!userResponse.data.isEmailVerified){
        setError("email", {
          type: "manual",
          message: "Please verify your email first"
        });
        return;
      }
      
      if(!showPassword && userResponse.data.passwordHash !== null){
        setShowPassword(true);
        return;
      }

      // Nếu không có password, login luôn
      if(userResponse.data.passwordHash === null){
        data.password = "";
      }
      const res = await authService.loginWithEmail(data.email, data.password);
      if (res.data?.token) {
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setAuthState(true, res.data.user);
        router.push('/chat');
      } else {
        setError("password", {
          type: "manual",
          message: res.error || "Login failed. Please try again."
        });
      }
    }

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
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-2">Welcome to Empathia</h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Share your feelings with AI</p>
          </div>
  
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12"
            >
              <Apple className="w-5 h-5 mr-3" />
              Login with Apple
            </Button>
  
            <Button
              variant="outline"
              className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12"
              onClick={() => loginWithGoogle()}
            >
              <GoogleIcon />
              Login with Google
            </Button>
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
          {showPassword && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="enter your password..."
                  className="w-full bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 h-12 pr-10"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 3,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                />
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600 text-white h-12 mb-6">       Login with email</Button>
        </form>
  
          <div className="text-center">
            <Link href="/auth/signup" className="text-gray-500 text-sm">Don't have an account? Create one here.</Link>
            <br />
            <Link href="/auth/resend-verification" className="text-gray-500 text-sm">Didn't receive confirmation instructions?</Link>
            <br />
            <Link href="/auth/register" className="text-gray-500 text-sm">Forgot your password?</Link>
          </div>
        </div>
      </div>
    )
}

export default LoginPage;
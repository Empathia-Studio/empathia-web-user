'use client';
import { Apple, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useAuthActions } from '@/features/auth/hooks';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function LoginPage() {
  const { 
    emailLoginState, 
    precheckEmail, 
    loginWithEmail, 
    googleLoading, 
    googleError, 
    startGoogleLogin,
    useLoginForm 
  } = useAuthActions();
  const { register, handleSubmit, watch, formState: { errors }, setError } = useLoginForm();
  const { showPassword, loading: emailLoading, error: emailError } = emailLoginState;

  const onSubmit = async (data: { email: string; password?: string }) => {
    // B1: precheck email để quyết định có show password không
    const { hasPassword } = await precheckEmail(data.email);
    if (hasPassword && !data.password) {
      // yêu cầu nhập password
      setError('password', { type: 'manual', message: 'Please enter your password' });
      return;
    }
    await loginWithEmail(data.email, data.password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Empathia</h1>
          <p className="text-muted-foreground text-sm">Share your feelings with AI</p>
        </div>

        <div className="space-y-3 mb-6">
          <Button variant="outline" className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12" disabled>
            <Apple className="w-5 h-5 mr-3" />
            Login with Apple
          </Button>

          <Button
            variant="outline"
            className="w-full bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700/50 h-12"
            onClick={() => startGoogleLogin()}
            disabled={googleLoading}
          >
            <GoogleIcon />
            {googleLoading ? 'Connecting…' : 'Login with Google'}
          </Button>
          {googleError && <p className="text-red-500 text-sm">{googleError}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-foreground mb-2">Email</label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="enter your email address..."
                className="h-12 pr-10"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {showPassword && (
            <div>
              <label htmlFor="password" className="block text-sm text-foreground mb-2">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="enter your password..."
                  className="h-12 pr-10"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 3, message: 'Password must be at least 8 characters' } // sửa message cho khớp
                  })}
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          )}

          {(emailError) && <p className="text-red-500 text-sm">{emailError}</p>}

          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 h-12" disabled={emailLoading}>
            {emailLoading ? 'Signing in…' : 'Login with email'}
          </Button>
        </form>

        <div className="text-center mt-6 space-y-1">
          <Link href="/auth/signup" className="text-primary text-sm hover:underline">Don't have an account? Create one here.</Link><br/>
          <Link href="/auth/resend-verification" className="text-primary text-sm hover:underline">Didn't receive confirmation instructions?</Link><br/>
          <Link href="/auth/forgot-password" className="text-primary text-sm hover:underline">Forgot your password?</Link>
        </div>
      </div>
    </div>
  );
}

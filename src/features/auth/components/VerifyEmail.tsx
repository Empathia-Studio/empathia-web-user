'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthActions } from '../hooks';
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from 'next/link';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuthActions();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already-verified'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isTokenUsed, setIsTokenUsed] = useState(false);

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      if (emailParam) setEmail(emailParam);
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      // Kiểm tra xem token đã được sử dụng chưa
      const usedTokens = JSON.parse(localStorage.getItem('usedVerificationTokens') || '[]');
      if (usedTokens.includes(token)) {
        setIsTokenUsed(true);
        setStatus('already-verified');
        setMessage('This email has already been verified');
        return;
      }

      const result = await verifyEmail(token);
      if (result.success) {
        // Lưu token vào danh sách đã sử dụng
        const updatedUsedTokens = [...usedTokens, token];
        localStorage.setItem('usedVerificationTokens', JSON.stringify(updatedUsedTokens));
        
        setStatus('success');
        setMessage('Email verified successfully!');
        // Redirect after 3s
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error || 'An error occurred while verifying email');
      }
    };

    verifyEmailToken();
  }, [searchParams, router, verifyEmail]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Email address is missing');
      return;
    }

    const result = await resendVerification(email);
    if (result.success) {
      setMessage('Verification email sent! Please check your inbox.');
    } else {
      setMessage(result.error || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 relative z-10">
        
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Verifying your email...</h2>
            <p className="text-muted-foreground text-sm">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">✓ Email Verified Successfully!</h2>
            <p className="text-muted-foreground text-sm mb-4">Your email has been verified. You can now login to your account.</p>
            <p className="text-muted-foreground text-sm">Redirecting to login page...</p>
            <div className="mt-6">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">Go to Login Now</Link>
            </div>
          </div>
        )}

        {status === 'already-verified' && (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Email Already Verified</h2>
            <p className="text-muted-foreground text-sm mb-4">This email verification link has already been used. Your email was successfully verified.</p>
            <div className="mt-6">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">Go to Login</Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">✗ Verification Failed</h2>
            <p className="text-muted-foreground text-sm mb-4">{message}</p>
            {email && (
              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-md font-medium"
                >
                  Resend Verification Email
                </button>
                <Link href="/auth/login" className="block text-primary hover:underline text-sm">
                  Back to Login
                </Link>
              </div>
            )}
            {!email && (
              <Link href="/auth/login" className="text-primary hover:underline text-sm">
                Back to Login
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
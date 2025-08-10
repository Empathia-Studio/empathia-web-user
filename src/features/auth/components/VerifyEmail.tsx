'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthActions } from '../hooks';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuthActions();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmailToken = async () => {
      const token = searchParams.get('token');
      const emailParam = searchParams.get('email');
      if (emailParam) setEmail(emailParam);
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid token');
        return;
      }

      const result = await verifyEmail(token);
      if (result.success) {
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
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-lg">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">✓ {message}</h2>
            <p className="mt-2 text-muted-foreground">You will be redirected to login page...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">✗ {message}</h2>
            {email && (
              <button
                onClick={handleResendVerification}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Resend Verification Email
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
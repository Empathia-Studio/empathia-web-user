'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuthState } = useAuth();
    const { handleGoogleCallback, isLoading, error } = useGoogleAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            setStatus('error');
            console.error('Google OAuth error:', error);
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
        }

        if (!code) {
            setStatus('error');
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
        }

        const processCallback = async () => {
            try {
                const result = await handleGoogleCallback(code);
                
                // Store tokens and user data
                localStorage.setItem('auth_token', result.accessToken);
                if (result.refreshToken) {
                    localStorage.setItem('refresh_token', result.refreshToken);
                }
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Update auth context
                setAuthState(true, result.user);
                
                setStatus('success');
                router.push('/chat');
            } catch (err) {
                console.error('Failed to process Google callback:', err);
                setStatus('error');
                setTimeout(() => router.push('/auth/login'), 3000);
            }
        };

        processCallback();
    }, [searchParams, handleGoogleCallback, setAuthState, router]);

    if (isLoading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Processing Google sign in...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign in failed</h1>
                    <p className="text-gray-600 mb-4">
                        {error || 'An error occurred during Google sign in'}
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            </div>
        );
    }

    return null;
}

import axiosInstance from '../../../lib/axios';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

interface ErrorResponse {
    statusCode: number;
    message?: string;
    details?: string;
}

interface ServiceResponse<T> {
    data?: T;
    error?: string;
}

// Helper function for consistent error handling
const handleApiError = (error: any): string => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    return 'An unexpected error occurred';
};

// Helper function for token storage
const storeTokens = (token: string, refreshToken?: string) => {
    localStorage.setItem('auth_token', token);
    if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
    }
};
const exchangeCode = async (code: string, redirectUri: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/auth/exchange-code', { code,redirectUri });
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};
const loginWithGoogle = async (googleToken: string): Promise<ServiceResponse<AuthResponse>> => {
    try {
        const response = await axiosInstance.post('/auth/google-login', {
            idtoken: googleToken
        });
        
        const { token, refreshToken, user } = response.data;
        storeTokens(token, refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};

const register = async (name: string, email: string, password: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/auth/register', { name, email, password });
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const getByEmail = async (email: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/auth/get-by-email/${email}`);
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const loginWithEmail = async (email: string, password: string): Promise<ServiceResponse<AuthResponse>> => {
    try {
        const response = await axiosInstance.post('/auth/login', { email, password });
        
        const { token, refreshToken, user } = response.data;
        storeTokens(token, refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const verifyEmail = async (token: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const resendVerification = async (email: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/auth/resend-verification', { email });
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};

const forgotPassword = async (email: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/auth/forgot-password', { email });
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};
const resetPassword = async (token: string, password: string): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/auth/reset-password', { token, password });
        return { data: response.data };
    } catch (error) {
        return { error: handleApiError(error) };
    }
};
export const authApi = {
    exchangeCode,
    loginWithGoogle,
    loginWithEmail,
    getByEmail,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    register,
    logout
}; 
import axiosInstance from '../axios';

interface AuthResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

interface ErrorResponse {
    data: {
        error: string;
        message?: string;
    };
}

interface ServiceResponse<T> {
    data?: T;
    error?: string;
}

const loginWithGoogle = async (googleToken: string): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post('/auth/google-login', {
            idtoken: googleToken
        });
        // Lưu refresh token
        if (response.data.refreshToken) {
            localStorage.setItem('refresh_token', response.data.refreshToken);
        }
        return response.data;
    } catch (error) {
        console.error('Google login failed:', error);
        throw error;
    }
};

const logout = async () => {
    try {
        // Gọi API logout nếu backend cần
        await axiosInstance.post('/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // Xóa tokens khỏi localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};
const register = async (name: string, email: string, password: string): Promise<ServiceResponse<any>> => {
    try {
        const res = await axiosInstance.post('/auth/register', { name, email, password });
        return { data: res.data };
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as ErrorResponse;
            return { error: response.data.error || response.data.message || 'Registration failed' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
const checkEmail = async (email: string) => {
    try {
       var res =  await axiosInstance.post('/auth/check-email',email);
       return res.data;
    } catch (error) {
        console.error('Login error:', error);
    } 
};
const getByEmail = async (email: string): Promise<ServiceResponse<any>> => {
    try {
        const res = await axiosInstance.get(`/auth/get-by-email/${email}`);
        return { data: res.data };
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as ErrorResponse;
            return { error: response.data.error || response.data.message || 'User not found' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
const loginWithEmail = async (email: string, password: string): Promise<ServiceResponse<any>> => {
    try {
        const res = await axiosInstance.post('/auth/login', { email, password });
        return { data: res.data };
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as ErrorResponse;
            return { error: response.data.error || response.data.message || 'Login failed' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
const verifyEmail = async (token: string): Promise<ServiceResponse<any>> => {
    try {
        const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        return { data: res.data };
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as ErrorResponse;
            return { error: response.data.error || response.data.message || 'Verification failed' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
const resendVerification = async (email: string): Promise<ServiceResponse<any>> => {
    try {
        const res = await axiosInstance.post(`/auth/resend-verification`, { email });
        return { data: res.data };
    } catch (error) {
        if (error && typeof error === 'object' && 'response' in error) {
            const response = error.response as ErrorResponse;
            return { error: response.data.error || response.data.message || 'Failed to resend verification' };
        }
        return { error: 'An unexpected error occurred' };
    }
};
export const authService = {
    loginWithGoogle,
    loginWithEmail,
    checkEmail,
    getByEmail,
    verifyEmail,
    resendVerification,
    register,
    logout
}; 
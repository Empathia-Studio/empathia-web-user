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
        // Chuyển về trang login
        window.location.href = '/auth/login';
    }
};
const register = async (name:string,email: string, password: string) => {
    try {
        await axiosInstance.post('/auth/register', {
            name,
            email,
            password
        });
    } catch (error) {
        console.error('Login error:', error);
    } finally {
        window.location.href = '/auth/login';
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
const getByEmail = async (email: string) => {
    try {
       var res =  await axiosInstance.get(`/auth/get-by-email/${email}`);
       return res.data;
    } catch (error) {
        console.error('Login error:', error);
    } 
};
const loginWithEmail = async (email: string, password: string) => {
    try {
        // Gọi API login nếu backend cần
        var res = await axiosInstance.post('/auth/login', {
            email,
            password
        });
        return res.data;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};
const verifyEmail = async (token: string) => {
    try {
        // Gọi API login nếu backend cần
        var res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        return res;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};
const resendVerification = async (email: string) => {
    try {
        // Gọi API login nếu backend cần
        var res = await axiosInstance.post(`/auth/resend-verification`,{email});
        return res;
    } catch (error) {
        console.error('Login error:', error);
        return null;
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
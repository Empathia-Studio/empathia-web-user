import axios from 'axios';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Thử refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { token: newToken } = response.data;
                    localStorage.setItem('auth_token', newToken);

                    // Thử lại request cũ với token mới
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh token thất bại, logout và chuyển về trang login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 
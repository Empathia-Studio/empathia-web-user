import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_AUTH_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
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

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }
                const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/refresh-token`, {
                    refreshToken
                });
                const { accessToken } = response.data;
                localStorage.setItem('auth_token', accessToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                localStorage.removeItem('auth_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                // window.location.href = '/auth/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 
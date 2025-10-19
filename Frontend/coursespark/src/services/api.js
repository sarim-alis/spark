import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Laravel API URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('api_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle common error cases
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Laravel validation errors
            if (error.response.status === 422) {
                return Promise.reject({
                    message: Object.values(error.response.data.errors)[0][0],
                    errors: error.response.data.errors
                });
            }
            // Auth errors
            if (error.response.status === 401) {
                localStorage.removeItem('api_token');
                // Optionally redirect to login
            }
            return Promise.reject({
                message: error.response.data.message || 'Something went wrong',
                status: error.response.status
            });
        }
        return Promise.reject({ message: 'Network error' });
    }
);

export const authAPI = {
    register: (data) => api.post('/users', data),
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout')
};

export const userAPI = {
    getProfile: () => api.get('/users/profile/me'),
    updateProfile: (data) => {
        // If data contains a file, use FormData
        if (data.profile_picture_url instanceof File) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    formData.append(key, data[key]);
                }
            });
            return api.post('/users/profile/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.put('/users/profile/me', data);
    }
};

export default api;
import api from './api';

export const courseAPI = {
    // Get all courses (with optional filters)
    list: (params = {}) => api.get('/courses', { params }),
    
    // Get a single course
    get: (id) => api.get(`/courses/${id}`),
    
    // Create a new course
    create: (data) => {
        const headers = data instanceof FormData 
            ? { 'Content-Type': 'multipart/form-data' }
            : {};
        return api.post('/courses', data, { headers });
    },
    
    // Update a course
    update: (id, data) => {
        const headers = data instanceof FormData 
            ? { 'Content-Type': 'multipart/form-data' }
            : {};
        return api.put(`/courses/${id}`, data, { headers });
    },
    
    // Delete a course
    delete: (id) => api.delete(`/courses/${id}`),
};

export default courseAPI;

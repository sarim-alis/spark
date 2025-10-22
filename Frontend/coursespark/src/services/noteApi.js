import api from './api';

export const noteAPI = {
    // Get all notes for the authenticated user
    list: () => api.get('/notes'),
    
    // Get all notes (admin)
    all: () => api.get('/notes/all'),
    
    // Get notes by user ID
    getByUser: (userId) => api.get(`/notes/user/${userId}`),
    
    // Get a single note
    get: (id) => api.get(`/notes/${id}`),
    
    // Create a new note
    create: (data) => api.post('/notes', data),
    
    // Update a note
    update: (id, data) => api.put(`/notes/${id}`, data),
    
    // Delete a note
    delete: (id) => api.delete(`/notes/${id}`),
};

export default noteAPI;

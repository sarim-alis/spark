import api from './api';

export const portfolioAPI = {
    // Get all portfolios (with optional filters)
    list: (params = {}) => api.get('/portfolio', { params }),
    
    // Get a single portfolio by ID
    get: (id) => api.get(`/portfolio/${id}`),
    
    // Get portfolio by custom slug
    getBySlug: (slug) => api.get(`/portfolio/slug/${slug}`),
    
    // Get authenticated user's portfolio
    getMyPortfolio: () => api.get('/portfolio/me'),
    
    // Create a new portfolio
    create: (data) => api.post('/portfolio', data),
    
    // Update a portfolio
    update: (id, data) => api.put(`/portfolio/${id}`, data),
    
    // Delete a portfolio
    delete: (id) => api.delete(`/portfolio/${id}`),
};

export default portfolioAPI;

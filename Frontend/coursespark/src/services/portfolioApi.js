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
    create: (data) => {
        // If data contains a file, use FormData
        if (data.profile_image instanceof File) {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    if (key === 'featured_projects' || key === 'skills' || key === 'certificates' || key === 'social_links') {
                        formData.append(key, JSON.stringify(data[key]));
                    } else {
                        formData.append(key, data[key]);
                    }
                }
            });
            return api.post('/portfolio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        return api.post('/portfolio', data);
    },
    
    // Update a portfolio
    update: (id, data) => {
        // Fields to exclude from update
        const excludeFields = ['id', 'created_at', 'updated_at', 'view_count'];
        
        // If data contains a file, use FormData with _method for Laravel
        if (data.profile_image instanceof File) {
            const formData = new FormData();
            formData.append('_method', 'PUT'); // Laravel method spoofing
            
            // Ensure all JSON fields exist with defaults
            const jsonFields = ['featured_projects', 'skills', 'certificates', 'social_links'];
            jsonFields.forEach(field => {
                if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
                    data[field] = [];
                }
            });
            
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined && !excludeFields.includes(key)) {
                    if (key === 'featured_projects' || key === 'skills' || key === 'certificates' || key === 'social_links') {
                        // Ensure arrays/objects are JSON stringified
                        let value;
                        if (typeof data[key] === 'string') {
                            value = data[key];
                        } else if (Array.isArray(data[key]) || typeof data[key] === 'object') {
                            value = JSON.stringify(data[key]);
                        } else {
                            value = '[]'; // Default to empty array
                        }
                        formData.append(key, value);
                    } else if (key === 'is_public') {
                        // Convert to boolean (1/0 to true/false)
                        formData.append(key, data[key] ? '1' : '0');
                    } else if (key !== 'profile_image') {
                        formData.append(key, data[key]);
                    }
                }
            });
            
            // Append file last
            formData.append('profile_image', data.profile_image);
            
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File' : pair[1]));
            }
            
            return api.post(`/portfolio/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
        
        // Without file, prepare clean data with proper formatting
        const cleanData = {};
        
        // Ensure all JSON fields exist with defaults
        const jsonFields = ['featured_projects', 'skills', 'certificates', 'social_links'];
        jsonFields.forEach(field => {
            if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
                data[field] = [];
            }
        });
        
        Object.keys(data).forEach(key => {
            if (!excludeFields.includes(key) && data[key] !== null && data[key] !== undefined) {
                // Skip profile_image if it's not a File (it's just the URL string)
                if (key === 'profile_image' && !(data[key] instanceof File)) {
                    return; // Don't send the URL string
                }
                
                // Keep arrays as arrays for JSON PUT request (not stringified)
                if (key === 'featured_projects' || key === 'skills' || key === 'certificates' || key === 'social_links') {
                    cleanData[key] = Array.isArray(data[key]) ? data[key] : [];
                } else if (key === 'is_public') {
                    // Ensure boolean
                    cleanData[key] = Boolean(data[key]);
                } else {
                    cleanData[key] = data[key];
                }
            }
        });
        
        console.log('Sending PUT data:', cleanData);
        return api.put(`/portfolio/${id}`, cleanData);
    },
    
    // Delete a portfolio
    delete: (id) => api.delete(`/portfolio/${id}`),
};

export default portfolioAPI;

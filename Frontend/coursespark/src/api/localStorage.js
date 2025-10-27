// Pure Frontend Storage - No Backend Required
// Uses localStorage for data persistence

import { courseAPI } from '../services/courseApi.js';

const STORAGE_KEYS = {
  USER: 'coursespark_user',
  COURSES: 'coursespark_courses',
  ENROLLMENTS: 'coursespark_enrollments',
  AUTH_TOKEN: 'api_token',
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Initialize default data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const defaultUser = {
      id: 'user_1',
      name: 'Demo User',
      email: 'demo@coursespark.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      subscription: 'premium',
      ai_tools_unlocked: true,
      ai_tutor_unlocked: true,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
  }

  if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
    const defaultCourses = [
      {
        id: 'course_1',
        title: 'Introduction to React',
        description: 'Learn React from scratch with hands-on projects',
        category: 'Web Development',
        level: 'Beginner',
        price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
        duration: '4 weeks',
        rating: 4.8,
        students: 1234,
        instructor: 'user_1',
        status: 'published',
        lessons: [
          {
            id: 'lesson_1',
            title: 'Getting Started with React',
            content: '<h2>Welcome to React!</h2><p>React is a JavaScript library for building user interfaces.</p>',
            duration: '15 min',
            order: 0,
          },
          {
            id: 'lesson_2',
            title: 'Components and Props',
            content: '<h2>React Components</h2><p>Components are the building blocks of React applications.</p>',
            duration: '20 min',
            order: 1,
          },
        ],
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(defaultCourses));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ENROLLMENTS)) {
    const defaultEnrollments = [
      {
        id: 'enrollment_1',
        course_id: 'course_1',
        student_id: 'user_1',
        student_email: 'demo@coursespark.com',
        progress: 50,
        completed_lessons: ['lesson_1'],
        enrolled_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(defaultEnrollments));
  }
};

// Initialize on load
initializeStorage();

// Storage API
export const storage = {
  // Generic methods
  get: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key) => {
    localStorage.removeItem(key);
  },
  clear: () => {
    localStorage.clear();
    initializeStorage();
  },
};

// User API
export const User = {
  me: async () => {
    // First try to get from auth_user (real backend data)
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const userData = JSON.parse(authUser);
      // Always unlock AI features for logged-in users
      return {
        ...userData,
        ai_tutor_unlocked: true,
        ai_tools_unlocked: true
      };
    }
    // Fallback to coursespark_user (demo data)
    return storage.get(STORAGE_KEYS.USER);
  },
  update: async (updates) => {
    const user = storage.get(STORAGE_KEYS.USER);
    const updated = { ...user, ...updates };
    storage.set(STORAGE_KEYS.USER, updated);
    return updated;
  },
  login: async () => {
    return storage.get(STORAGE_KEYS.USER);
  },
  logout: async () => {
    // Clear user data and auth token
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.COURSES);
    storage.remove(STORAGE_KEYS.ENROLLMENTS);
    // Remove auth keys used by AuthProvider and axios interceptor
    localStorage.removeItem('api_token');
    localStorage.removeItem('auth_user');
    // Also remove old 'token' key if it exists from previous logins
    localStorage.removeItem('token');
    try {
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    } catch (_) {}
    return true;
  },
};

// Course API - Using Backend API
export const Course = {
  list: async () => {
    try {
      const response = await courseAPI.list();
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }
  },
  get: async (id) => {
    try {
      const response = await courseAPI.get(id);
      return response.data.data || null;
    } catch (error) {
      console.error('Failed to fetch course:', error);
      return null;
    }
  },
  create: async (courseData) => {
    try {
      const response = await courseAPI.create(courseData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create course:', error);
      throw error;
    }
  },
  update: async (id, updates) => {
    try {
      // Prepare data for backend - convert lessons array to JSON string
      const dataToSend = { ...updates };
      
      // Convert lessons array to JSON string if it exists
      if (dataToSend.lessons && Array.isArray(dataToSend.lessons)) {
        dataToSend.lessons = JSON.stringify(dataToSend.lessons);
      }
      
      // Remove thumbnail_url if it's not a File (backend expects file upload or nothing)
      if (dataToSend.thumbnail_url && typeof dataToSend.thumbnail_url === 'string') {
        delete dataToSend.thumbnail_url;
      }
      
      const response = await courseAPI.update(id, dataToSend);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      await courseAPI.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  },
  filter: async (criteria) => {
    try {
      const response = await courseAPI.list(criteria);
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to filter courses:', error);
      return [];
    }
  },
  togglePublish: async (id) => {
    try {
      const response = await courseAPI.togglePublish(id);
      return response.data.data;
    } catch (error) {
      console.error('Failed to toggle publish:', error);
      throw error;
    }
  },
};

// Enrollment API
export const Enrollment = {
  list: async () => {
    return storage.get(STORAGE_KEYS.ENROLLMENTS) || [];
  },
  get: async (id) => {
    const enrollments = storage.get(STORAGE_KEYS.ENROLLMENTS) || [];
    return enrollments.find(e => e.id === id);
  },
  create: async (enrollmentData) => {
    const enrollments = storage.get(STORAGE_KEYS.ENROLLMENTS) || [];
    const newEnrollment = {
      id: generateId(),
      ...enrollmentData,
      progress: 0,
      completed_lessons: [],
      enrolled_at: new Date().toISOString(),
    };
    enrollments.push(newEnrollment);
    storage.set(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return newEnrollment;
  },
  update: async (id, updates) => {
    const enrollments = storage.get(STORAGE_KEYS.ENROLLMENTS) || [];
    const index = enrollments.findIndex(e => e.id === id);
    if (index !== -1) {
      enrollments[index] = { ...enrollments[index], ...updates };
      storage.set(STORAGE_KEYS.ENROLLMENTS, enrollments);
      return enrollments[index];
    }
    return null;
  },
  filter: async (criteria) => {
    const enrollments = storage.get(STORAGE_KEYS.ENROLLMENTS) || [];
    if (!criteria) return enrollments;
    
    return enrollments.filter(enrollment => {
      for (const [key, value] of Object.entries(criteria)) {
        if (enrollment[key] !== value) return false;
      }
      return true;
    });
  },
};

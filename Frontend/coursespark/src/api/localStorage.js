// Pure Frontend Storage - No Backend Required
// Uses localStorage for data persistence

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

// Course API
export const Course = {
  list: async () => {
    return storage.get(STORAGE_KEYS.COURSES) || [];
  },
  get: async (id) => {
    const courses = storage.get(STORAGE_KEYS.COURSES) || [];
    return courses.find(c => c.id === id);
  },
  create: async (courseData) => {
    const courses = storage.get(STORAGE_KEYS.COURSES) || [];
    const newCourse = {
      id: generateId(),
      ...courseData,
      instructor: 'user_1',
      created_at: new Date().toISOString(),
      rating: 0,
      students: 0,
      status: 'draft',
    };
    courses.push(newCourse);
    storage.set(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  },
  update: async (id, updates) => {
    const courses = storage.get(STORAGE_KEYS.COURSES) || [];
    const index = courses.findIndex(c => c.id === id);
    if (index !== -1) {
      courses[index] = { ...courses[index], ...updates };
      storage.set(STORAGE_KEYS.COURSES, courses);
      return courses[index];
    }
    return null;
  },
  delete: async (id) => {
    const courses = storage.get(STORAGE_KEYS.COURSES) || [];
    const filtered = courses.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.COURSES, filtered);
    return true;
  },
  filter: async (criteria) => {
    const courses = storage.get(STORAGE_KEYS.COURSES) || [];
    if (!criteria) return courses;
    
    return courses.filter(course => {
      for (const [key, value] of Object.entries(criteria)) {
        if (course[key] !== value) return false;
      }
      return true;
    });
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

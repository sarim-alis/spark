import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  // Wait for auth to initialize before redirecting
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to admin login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Redirect to main app if not admin
  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

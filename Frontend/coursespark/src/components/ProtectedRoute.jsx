import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  
  // Wait for auth to initialize before redirecting
  if (loading) {
    return <div>Loading...</div>; // Or use a proper loading spinner
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

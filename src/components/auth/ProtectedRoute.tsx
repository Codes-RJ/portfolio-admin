import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, session } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-[50vh] grid place-items-center text-sm text-gray-500">Validating secure session…</div>;
  }

  if (!session?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

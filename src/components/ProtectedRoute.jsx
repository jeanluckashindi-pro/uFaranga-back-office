import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../hooks/useUser';

const ProtectedRoute = ({ children, module }) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasAccessToModule, getDefaultRoute } = useUser();
  const location = useLocation();

  if (loading) {
    // Afficher un spinner pendant la vérification de l'authentification
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en sauvegardant la route demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si un module est spécifié, vérifier l'accès
  if (module && !hasAccessToModule(module)) {
    // Rediriger vers la route par défaut de l'utilisateur
    const defaultRoute = getDefaultRoute();
    return <Navigate to={defaultRoute} replace />;
  }

  return children;
};

export default ProtectedRoute;
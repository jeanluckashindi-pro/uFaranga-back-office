import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { Alert } from './common';

/**
 * Composant pour protéger l'accès aux modules selon le type d'utilisateur
 * @param {string} module - Le module à protéger (admin, agent, tech, client, merchant)
 * @param {ReactNode} children - Le contenu à afficher si l'accès est autorisé
 * @param {string} redirectTo - URL de redirection si l'accès est refusé (par défaut: /login)
 */
const ProtectedModule = ({ module, children, redirectTo = '/login' }) => {
  const { hasAccessToModule, isAuthenticated, loading, getUserTypeLabel } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAccessToModule(module)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="danger">
            <div className="space-y-2">
              <p className="font-semibold">Accès refusé</p>
              <p className="text-sm">
                Vous n'avez pas les permissions nécessaires pour accéder à ce module.
              </p>
              <p className="text-xs text-gray-400">
                Votre rôle : {getUserTypeLabel()}
              </p>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedModule;

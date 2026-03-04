import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

/**
 * Composant qui redirige vers la route par défaut selon le type d'utilisateur
 */
const DefaultRedirect = () => {
  const { getDefaultRoute, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const defaultRoute = getDefaultRoute();
  return <Navigate to={defaultRoute} replace />;
};

export default DefaultRedirect;

import { useAuth } from '../contexts/AuthContext';
import { 
  getUserModule, 
  getUserNavigation, 
  getUserDefaultRoute,
  getUserModuleLabel,
  hasAccessToModule,
  getUserAccessibleModules
} from '../config/userModules';

/**
 * Hook personnalisé pour accéder aux informations de l'utilisateur connecté
 * @returns {Object} Informations utilisateur et méthodes utiles
 */
export const useUser = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Fonction pour obtenir le nom complet
  const getFullName = () => {
    if (!user) return '';
    return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };

  // Fonction pour obtenir les initiales
  const getInitials = () => {
    if (!user) return '';
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  // Fonction pour vérifier si l'utilisateur est staff
  const isStaff = () => {
    return user?.isStaff || false;
  };

  // Fonction pour vérifier si l'utilisateur est superuser
  const isSuperuser = () => {
    return user?.isSuperuser || false;
  };

  // Fonction pour obtenir le niveau KYC
  const getKycLevel = () => {
    return user?.kycLevel || 0;
  };

  // Fonction pour vérifier si l'email est vérifié
  const isEmailVerified = () => {
    return user?.isEmailVerified || false;
  };

  // Fonction pour vérifier si le téléphone est vérifié
  const isPhoneVerified = () => {
    return user?.isPhoneVerified || false;
  };

  // Fonction pour obtenir le type d'utilisateur
  const getUserType = () => {
    return user?.userType || 'CLIENT';
  };

  // Fonction pour vérifier le type d'utilisateur
  const isClient = () => user?.userType === 'CLIENT';
  const isAgent = () => user?.userType === 'AGENT';
  const isMerchant = () => user?.userType === 'MARCHAND';
  const isAdmin = () => user?.userType === 'ADMIN' || user?.userType === 'SUPER_ADMIN' || user?.userType === 'SYSTEME';
  const isSuperAdmin = () => user?.userType === 'SUPER_ADMIN' || user?.userType === 'SYSTEME';
  const isSystem = () => user?.userType === 'SYSTEME';

  // Fonction pour obtenir le label du type d'utilisateur
  const getUserTypeLabel = () => {
    const labels = {
      'CLIENT': 'Client',
      'AGENT': 'Agent',
      'MARCHAND': 'Marchand',
      'ADMIN': 'Administrateur',
      'SUPER_ADMIN': 'Super Administrateur',
      'SYSTEME': 'Système'
    };
    return labels[getUserType()] || 'Utilisateur';
  };

  // Obtenir le module de l'utilisateur
  const getModule = () => {
    return getUserModule(getUserType());
  };

  // Obtenir la navigation de l'utilisateur
  const getNavigation = () => {
    return getUserNavigation(getUserType());
  };

  // Obtenir la route par défaut de l'utilisateur
  const getDefaultRoute = () => {
    return getUserDefaultRoute(getUserType());
  };

  // Obtenir le label du module de l'utilisateur
  const getModuleLabel = () => {
    return getUserModuleLabel(getUserType());
  };

  // Vérifier si l'utilisateur a accès à un module
  const checkAccessToModule = (module) => {
    return hasAccessToModule(getUserType(), module);
  };

  // Obtenir tous les modules accessibles
  const getAccessibleModules = () => {
    return getUserAccessibleModules(getUserType());
  };

  // Fonction pour obtenir le statut
  const getStatus = () => {
    return user?.status || 'ACTIF';
  };

  // Fonction pour vérifier si le compte est actif
  const isActive = () => {
    return user?.isActive && user?.status === 'ACTIF';
  };

  return {
    user,
    isAuthenticated,
    loading,
    // Méthodes utiles
    getFullName,
    getInitials,
    isStaff,
    isSuperuser,
    getKycLevel,
    isEmailVerified,
    isPhoneVerified,
    getUserType,
    getUserTypeLabel,
    // Vérifications de type
    isClient,
    isAgent,
    isMerchant,
    isAdmin,
    isSuperAdmin,
    isSystem,
    // Accès aux modules
    getModule,
    getNavigation,
    getDefaultRoute,
    getModuleLabel,
    hasAccessToModule: checkAccessToModule,
    getAccessibleModules,
    // Statut
    getStatus,
    isActive,
  };
};

export default useUser;

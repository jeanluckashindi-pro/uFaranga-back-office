/**
 * Configuration des modules accessibles selon le type d'utilisateur
 * 
 * Types d'utilisateurs et leurs modules :
 * - SYSTEME → MODULE ADMIN SYSTÈME uniquement
 * - SUPER_ADMIN → MODULE ADMIN SYSTÈME uniquement
 * - ADMIN → MODULE ADMIN TECHNIQUE uniquement
 * - AGENT, MARCHAND → MODULE AGENT uniquement
 * - CLIENT → MODULE CLIENT uniquement
 * 
 * Chaque type d'utilisateur a accès UNIQUEMENT à son module assigné.
 */

import { 
  agentNavigation, 
  adminSystemNavigation, 
  adminTechNavigation, 
  clientNavigation 
} from './navigation';

// Mapping des types d'utilisateurs vers les modules
export const USER_TYPE_MODULES = {
  SYSTEME: 'admin_system',
  SUPER_ADMIN: 'admin_system',
  ADMIN: 'admin_tech',
  AGENT: 'agent',
  MARCHAND: 'agent',
  CLIENT: 'client',
};

// Mapping des modules vers les navigations
export const MODULE_NAVIGATION = {
  admin_system: adminSystemNavigation,
  admin_tech: adminTechNavigation,
  agent: agentNavigation,
  client: clientNavigation,
};

// Mapping des modules vers les routes par défaut
export const MODULE_DEFAULT_ROUTES = {
  admin_system: '/admin/dashboard',
  admin_tech: '/tech/monitoring',
  agent: '/agent/dashboard',
  client: '/client/dashboard',
};

// Labels des modules
export const MODULE_LABELS = {
  admin_system: 'Administration Système',
  admin_tech: 'Administration Technique',
  agent: 'Espace Agent',
  client: 'Espace Client',
};

/**
 * Obtenir le module d'un utilisateur selon son type
 * @param {string} userType - Type d'utilisateur (SYSTEME, SUPER_ADMIN, ADMIN, AGENT, MARCHAND, CLIENT)
 * @returns {string} - Module correspondant
 */
export const getUserModule = (userType) => {
  return USER_TYPE_MODULES[userType] || 'client';
};

/**
 * Obtenir la navigation d'un utilisateur selon son type
 * @param {string} userType - Type d'utilisateur
 * @returns {Array} - Navigation correspondante
 */
export const getUserNavigation = (userType) => {
  const module = getUserModule(userType);
  return MODULE_NAVIGATION[module] || clientNavigation;
};

/**
 * Obtenir la route par défaut d'un utilisateur selon son type
 * @param {string} userType - Type d'utilisateur
 * @returns {string} - Route par défaut
 */
export const getUserDefaultRoute = (userType) => {
  const module = getUserModule(userType);
  return MODULE_DEFAULT_ROUTES[module] || '/client/dashboard';
};

/**
 * Obtenir le label du module d'un utilisateur
 * @param {string} userType - Type d'utilisateur
 * @returns {string} - Label du module
 */
export const getUserModuleLabel = (userType) => {
  const module = getUserModule(userType);
  return MODULE_LABELS[module] || 'Espace Client';
};

/**
 * Vérifier si un utilisateur a accès à un module
 * @param {string} userType - Type d'utilisateur
 * @param {string} module - Module à vérifier
 * @returns {boolean} - true si l'utilisateur a accès
 */
export const hasAccessToModule = (userType, module) => {
  const userModule = getUserModule(userType);
  return userModule === module;
};

/**
 * Obtenir tous les modules accessibles par un utilisateur
 * @param {string} userType - Type d'utilisateur
 * @returns {Array} - Liste des modules accessibles
 */
export const getUserAccessibleModules = (userType) => {
  const userModule = getUserModule(userType);
  return [userModule];
};

export default {
  USER_TYPE_MODULES,
  MODULE_NAVIGATION,
  MODULE_DEFAULT_ROUTES,
  MODULE_LABELS,
  getUserModule,
  getUserNavigation,
  getUserDefaultRoute,
  getUserModuleLabel,
  hasAccessToModule,
  getUserAccessibleModules,
};

import {
  LayoutDashboard, Activity, Wallet, FileText, TrendingUp,
  Bell, Settings, Users, Shield, UserCheck, DollarSign,
  BarChart3, Lock, Database, Server, Zap, AlertTriangle,
  CreditCard, RefreshCw, Download, Upload, Eye, Ban,
  CheckCircle, XCircle, Clock, Globe, Smartphone, Mail
} from 'lucide-react';

// Navigation pour MODULE AGENT
export const agentNavigation = [
  {
    section: 'Principal',
    items: [
      { 
        path: '/agent/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard', 
        description: 'Vue d\'ensemble de votre activité'
      },
      { 
        path: '/agent/transactions', 
        icon: Activity, 
        label: 'Transactions', 
        description: 'Gérer les opérations quotidiennes'
      },
      { 
        path: '/agent/float', 
        icon: Wallet, 
        label: 'Gestion Float', 
        description: 'Réapprovisionnement et transferts'
      },
    ]
  },
  {
    section: 'Gestion',
    items: [
      { 
        path: '/agent/rapports', 
        icon: FileText, 
        label: 'Rapports', 
        description: 'Rapports journaliers et mensuels'
      },
      { 
        path: '/agent/commissions', 
        icon: TrendingUp, 
        label: 'Commissions', 
        description: 'Suivi de vos gains'
      },
    ]
  },
  {
    section: 'Compte',
    items: [
      { 
        path: '/agent/notifications', 
        icon: Bell, 
        label: 'Notifications', 
        badge: 'notifications'
      },
    ]
  }
];

// Navigation pour MODULE ADMIN SYSTÈME
export const adminSystemNavigation = [
  {
    section: 'Vue d\'ensemble',
    items: [
      { 
        path: '/admin/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard Global',
        description: 'Vue complète de la plateforme'
      },
    ]
  },
  {
    section: 'Gestion Utilisateurs',
    items: [
      { 
        path: '/admin/agents', 
        icon: Users, 
        label: 'Gestion Agents',
        description: 'Ajouter, suspendre, gérer agents'
      },
      { 
        path: '/admin/clients', 
        icon: UserCheck, 
        label: 'Gestion Clients',
        description: 'KYC, plafonds, suspensions'
      },
      { 
        path: '/admin/profils', 
        icon: Shield, 
        label: 'Gestion Profils',
        description: 'Rôles et permissions utilisateurs'
      },
    ]
  },
  {
    section: 'Opérations',
    items: [
      { 
        path: '/admin/transactions', 
        icon: Activity, 
        label: 'Toutes Transactions',
        description: 'Recherche, annulation, litiges'
      },
      { 
        path: '/admin/commissions', 
        icon: DollarSign, 
        label: 'Gestion Commissions',
        description: 'Grilles et rapports'
      },
      { 
        path: '/admin/float-global', 
        icon: Wallet, 
        label: 'Float Global',
        description: 'Float réseau et répartition'
      },
    ]
  },
  {
    section: 'Analyse',
    items: [
      { 
        path: '/admin/reporting', 
        icon: BarChart3, 
        label: 'Reporting Global',
        description: 'Rapports financiers et exports'
      },
      { 
        path: '/admin/fraude', 
        icon: AlertTriangle, 
        label: 'Détection Fraude',
        description: 'Alertes et scoring'
      },
    ]
  },
  {
    section: 'Sécurité',
    items: [
      { 
        path: '/admin/securite', 
        icon: Shield, 
        label: 'Sécurité & Conformité',
        description: 'Logs, audit, AML'
      },
      { 
        path: '/admin/parametres', 
        icon: Settings, 
        label: 'Paramètres Système',
        description: 'Limites, frais, configuration'
      },
    ]
  }
];

// Navigation pour MODULE CLIENT
export const clientNavigation = [
  {
    section: 'Principal',
    items: [
      { 
        path: '/client/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard',
        description: 'Solde et activité récente'
      },
      { 
        path: '/client/transfert', 
        icon: RefreshCw, 
        label: 'Transfert',
        description: 'Envoyer de l\'argent'
      },
      { 
        path: '/client/paiement', 
        icon: CreditCard, 
        label: 'Paiements',
        description: 'Factures et services'
      },
    ]
  },
  {
    section: 'Historique',
    items: [
      { 
        path: '/client/historique', 
        icon: Clock, 
        label: 'Historique',
        description: 'Toutes vos transactions'
      },
      { 
        path: '/client/releves', 
        icon: Download, 
        label: 'Relevés',
        description: 'Télécharger vos relevés'
      },
    ]
  },
  {
    section: 'Compte',
    items: [
      { 
        path: '/client/profil', 
        icon: UserCheck, 
        label: 'Mon Profil',
        description: 'Informations personnelles'
      },
      { 
        path: '/client/securite', 
        icon: Lock, 
        label: 'Sécurité',
        description: 'PIN, 2FA, appareils'
      },
    ]
  }
];

// Navigation pour MODULE ADMIN TECHNIQUE
export const adminTechNavigation = [
  {
    section: 'Monitoring',
    items: [
      { 
        path: '/tech/monitoring', 
        icon: Server, 
        label: 'Monitoring Système',
        description: 'État serveurs et API'
      },
      { 
        path: '/tech/performance', 
        icon: Zap, 
        label: 'Performance',
        description: 'Temps de réponse et métriques'
      },
    ]
  },
  {
    section: 'Intégrations',
    items: [
      { 
        path: '/tech/api', 
        icon: Globe, 
        label: 'API Partenaires',
        description: 'Gestion des intégrations'
      },
      { 
        path: '/tech/webhooks', 
        icon: Zap, 
        label: 'Webhooks',
        description: 'Configuration callbacks'
      },
      { 
        path: '/tech/sms', 
        icon: Smartphone, 
        label: 'SMS Gateway',
        description: 'Configuration SMS'
      },
    ]
  },
  {
    section: 'Logs & Maintenance',
    items: [
      { 
        path: '/tech/logs', 
        icon: FileText, 
        label: 'Logs Système',
        description: 'Logs transactions et erreurs'
      },
      { 
        path: '/tech/maintenance', 
        icon: Settings, 
        label: 'Maintenance',
        description: 'Backup et mises à jour'
      },
    ]
  },
  {
    section: 'Sécurité Technique',
    items: [
      { 
        path: '/tech/firewall', 
        icon: Shield, 
        label: 'Firewall & Sécurité',
        description: 'Configuration sécurité'
      },
      { 
        path: '/tech/detection', 
        icon: AlertTriangle, 
        label: 'Détection Anomalies',
        description: 'Analyse comportementale'
      },
    ]
  }
];

// Fonction pour obtenir la navigation selon le rôle
export const getNavigationByRole = (role) => {
  switch (role) {
    case 'agent':
      return agentNavigation;
    case 'admin':
      return adminSystemNavigation;
    case 'client':
      return clientNavigation;
    case 'tech':
      return adminTechNavigation;
    default:
      return agentNavigation;
  }
};

// Rôles disponibles
export const roles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_SYSTEM: 'admin',
  ADMIN_TECH: 'tech',
  AGENT: 'agent',
  CLIENT: 'client'
};

// Hiérarchie des rôles
export const roleHierarchy = {
  super_admin: ['admin', 'tech', 'agent', 'client'],
  admin: ['agent', 'client'],
  tech: [],
  agent: [],
  client: []
};

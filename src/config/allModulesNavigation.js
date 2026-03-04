import {
  LayoutDashboard, Activity, Wallet, FileText, TrendingUp,
  Bell, Settings, Users, Shield, UserCheck, DollarSign,
  BarChart3, Lock, Database, Server, Zap, AlertTriangle,
  CreditCard, RefreshCw, Download, Upload, Eye, Ban,
  CheckCircle, XCircle, Clock, Globe, Smartphone, Mail,
  ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight
} from 'lucide-react';

// Navigation complète avec TOUS les modules
export const allModulesNavigation = [
  // ==================== MODULE AGENT ====================
  {
    section: 'MODULE AGENT',
    module: 'agent',
    color: 'primary',
    items: [
      { 
        path: '/agent/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard Agent', 
        description: 'Vue d\'ensemble activité agent'
      },
      { 
        path: '/agent/transactions', 
        icon: Activity, 
        label: 'Transactions', 
        description: 'Dépôts, retraits, transferts'
      },
      { 
        path: '/agent/float', 
        icon: Wallet, 
        label: 'Gestion Float', 
        description: 'Réapprovisionnement float'
      },
      { 
        path: '/agent/rapports', 
        icon: FileText, 
        label: 'Rapports Agent', 
        description: 'Rapports journaliers/mensuels'
      },
      { 
        path: '/agent/commissions', 
        icon: TrendingUp, 
        label: 'Mes Commissions', 
        description: 'Suivi des gains'
      },
      { 
        path: '/agent/notifications', 
        icon: Bell, 
        label: 'Notifications Agent', 
        badge: 'notifications'
      },
    ]
  },

  // ==================== MODULE ADMIN SYSTÈME ====================
  {
    section: 'MODULE ADMIN SYSTÈME',
    module: 'admin_system',
    color: 'danger',
    items: [
      { 
        path: '/admin/dashboard', 
        icon: LayoutDashboard, 
        label: 'Dashboard Global',
        description: 'Vue complète plateforme'
      },
      { 
        path: '/admin/cartographie', 
        icon: Globe, 
        label: 'Cartographie Réseau',
        description: 'Carte réseau uFaranga global'
      },
      { 
        path: '/admin/couverture-mondiale', 
        icon: Globe, 
        label: 'Couverture Mondiale',
        description: 'Pays, villes et expansion globale'
      },
      { 
        path: '/admin/agents', 
        icon: Users, 
        label: 'Gestion Agents',
        description: 'Ajouter, suspendre agents'
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
        label: 'Float Global Réseau',
        description: 'Float total et répartition'
      },
      { 
        path: '/admin/reporting', 
        icon: BarChart3, 
        label: 'Reporting Global',
        description: 'Rapports financiers'
      },
      { 
        path: '/admin/fraude', 
        icon: AlertTriangle, 
        label: 'Détection Fraude',
        description: 'Alertes et scoring'
      },
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
        description: 'Limites, frais, config'
      },
    ]
  },

  // ==================== MODULE ADMIN TECHNIQUE ====================
  {
    section: 'MODULE ADMIN TECHNIQUE',
    module: 'admin_tech',
    color: 'primary',
    items: [
      { 
        path: '/tech/monitoring', 
        icon: Server, 
        label: 'Monitoring Système',
        description: 'État serveurs et API'
      },
      { 
        path: '/tech/cartographie-agents', 
        icon: Globe, 
        label: 'Cartographie Agents',
        description: 'Carte agents Burundi'
      },
      { 
        path: '/tech/performance', 
        icon: Zap, 
        label: 'Performance',
        description: 'Temps réponse, métriques'
      },
      { 
        path: '/tech/api', 
        icon: Globe, 
        label: 'API Partenaires',
        description: 'Gestion intégrations'
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
      { 
        path: '/tech/email', 
        icon: Mail, 
        label: 'Email Service',
        description: 'Configuration emails'
      },
      { 
        path: '/tech/logs', 
        icon: FileText, 
        label: 'Logs Système',
        description: 'Logs transactions/erreurs'
      },
      { 
        path: '/tech/maintenance', 
        icon: Settings, 
        label: 'Maintenance',
        description: 'Backup, mises à jour'
      },
      { 
        path: '/tech/firewall', 
        icon: Shield, 
        label: 'Firewall & Sécurité',
        description: 'Config sécurité'
      },
      { 
        path: '/tech/detection', 
        icon: AlertTriangle, 
        label: 'Détection Anomalies',
        description: 'Analyse comportementale'
      },
      { 
        path: '/tech/database', 
        icon: Database, 
        label: 'Base de Données',
        description: 'Gestion BDD'
      },
    ]
  },
];

export default allModulesNavigation;

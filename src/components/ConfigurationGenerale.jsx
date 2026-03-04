import { useNavigate } from 'react-router-dom';
import { 
  Settings, Shield, Users, Globe, Bell, Lock, 
  Mail, Phone, FileText, Database, CreditCard, 
  ChevronRight, Palette, Menu, Layout, DollarSign, 
  TrendingUp, Receipt
} from 'lucide-react';

const ConfigurationGenerale = () => {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Général',
      items: [
        {
          title: 'Informations de base',
          description: 'Nom, slogan et informations générales de la plateforme',
          icon: FileText,
          path: '/admin/parametres/informations'
        },
        {
          title: 'Contact Support',
          description: 'Email et téléphone de support client',
          icon: Phone,
          path: '/admin/parametres/contact'
        },
        {
          title: 'Paramètres régionaux',
          description: 'Langue, devise et fuseau horaire',
          icon: Globe,
          path: '/admin/parametres/regionalisation'
        }
      ]
    },
    {
      title: 'Sécurité & Accès',
      items: [
        {
          title: 'Sécurité',
          description: 'Authentification, 2FA et politique de sécurité',
          icon: Lock,
          path: '/admin/parametres/securite'
        },
        {
          title: 'Profils & Rôles',
          description: 'Gérer les profils et permissions du système',
          icon: Shield,
          path: '/admin/profils'
        },
        {
          title: 'Utilisateurs',
          description: 'Gérer tous les utilisateurs de la plateforme',
          icon: Users,
          path: '/admin/clients'
        }
      ]
    },
    {
      title: 'Personnalisation',
      items: [
        {
          title: 'Apparence',
          description: 'Personnalisation des couleurs et du thème',
          icon: Palette,
          path: '/admin/parametres/apparence'
        },
        {
          title: 'Modules',
          description: 'Gestion des modules système',
          icon: Layout,
          path: '/admin/parametres/modules'
        },
        {
          title: 'Navigation',
          description: 'Configuration des menus et navigation',
          icon: Menu,
          path: '/admin/parametres/navigation'
        }
      ]
    },
    {
      title: 'Finance & Tarification',
      items: [
        {
          title: 'Taux de change',
          description: 'Configuration des taux de change des devises',
          icon: TrendingUp,
          path: '/admin/parametres/taux-change'
        },
        {
          title: 'Tarifs d\'opérations',
          description: 'Visualiser et configurer les frais de transactions',
          icon: Receipt,
          path: '/admin/parametres/tarifs'
        },
        {
          title: 'Commissions',
          description: 'Gestion des commissions agents et marchands',
          icon: DollarSign,
          path: '/admin/gestion-commissions'
        }
      ]
    },
    {
      title: 'Système',
      items: [
        {
          title: 'Notifications',
          description: 'Configuration des notifications système',
          icon: Bell,
          path: '/admin/parametres/notifications'
        },
        {
          title: 'Base de données',
          description: 'Configuration et maintenance de la base de données',
          icon: Database,
          path: '/admin/parametres/database'
        },
        {
          title: 'Paiements',
          description: 'Configuration des providers de paiement',
          icon: CreditCard,
          path: '/admin/parametres/paiements'
        },
        {
          title: 'Pays & Régions',
          description: 'Configuration géographique du système',
          icon: Globe,
          path: '/admin/gestion-pays'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-anton uppercase text-text mb-2">Configuration</h1>
        <p className="text-gray-400">Gérez les paramètres de votre plateforme</p>
      </div>

      {/* Sections de menus */}
      <div className="space-y-8">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {/* Titre de section */}
            <h2 className="text-sm font-semibold text-gray-400 uppercase mb-4 px-2">
              {section.title}
            </h2>

            {/* Liste des items */}
            <div className="bg-card border border-darkGray rounded-xl overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const isLast = itemIndex === section.items.length - 1;
                
                return (
                  <button
                    key={itemIndex}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-darkGray transition-colors text-left group ${
                      !isLast ? 'border-b border-darkGray' : ''
                    }`}
                  >
                    {/* Icône */}
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    {/* Texte */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-text group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {item.description}
                      </p>
                    </div>

                    {/* Flèche */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConfigurationGenerale;

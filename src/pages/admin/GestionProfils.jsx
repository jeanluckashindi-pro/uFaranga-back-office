import { useState } from 'react';
import { 
  Users, UserCheck, Shield, Building2, 
  Zap, Crown, Globe, Filter, Search, 
  Settings, Plus, Download
} from 'lucide-react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Skeleton from '../../components/common/Skeleton';

const GestionProfils = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('view');
  const [filters, setFilters] = useState({
    type_utilisateur: '',
    statut: '',
    niveau_kyc: '',
    pays_code: '',
    est_actif: '',
    telephone_verifie: ''
  });
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0
  });
  
  // Stats mock data - replace with actual API call
  const stats = {
    total: '18,527',
    actifs: '16,234',
    kycValide: '12,890',
    pays: '45'
  };
  
  // Dropdown options
  const typeOptions = [
    { label: 'Tous', value: '' },
    { label: 'Client', value: 'CLIENT' },
    { label: 'Agent', value: 'AGENT' },
    { label: 'Marchand', value: 'MARCHAND' },
    { label: 'Admin', value: 'ADMIN' }
  ];
  
  const statutOptions = [
    { label: 'Tous', value: '' },
    { label: 'Actif', value: 'ACTIF' },
    { label: 'Inactif', value: 'INACTIF' },
    { label: 'Suspendu', value: 'SUSPENDU' }
  ];
  
  const kycOptions = [
    { label: 'Tous', value: '' },
    { label: 'Niveau 1', value: '1' },
    { label: 'Niveau 2', value: '2' },
    { label: 'Niveau 3', value: '3' }
  ];
  
  // Mock functions - replace with actual implementations
  const onPage = (event) => {
    setLazyParams(event);
  };
  
  const handleExport = () => {
    console.log('Export users');
  };
  
  const formatPhoneNumber = (phone) => {
    return phone || '-';
  };
  
  // Body templates
  const idBodyTemplate = (rowData) => {
    return <span className="text-sm text-gray-600">#{rowData.id}</span>;
  };
  
  const phoneBodyTemplate = (rowData) => {
    return <span className="text-sm">{formatPhoneNumber(rowData.numero_telephone)}</span>;
  };
  
  const dateBodyTemplate = (rowData) => {
    return rowData.date_naissance ? new Date(rowData.date_naissance).toLocaleDateString('fr-FR') : '-';
  };
  
  const nationaliteBodyTemplate = (rowData) => {
    return rowData.nationalite_details?.nom || '-';
  };
  
  const paysResidenceBodyTemplate = (rowData) => {
    return rowData.pays_residence_details?.nom || '-';
  };
  
  const adresseBodyTemplate = (rowData) => {
    const parts = [rowData.avenue, rowData.quartier, rowData.commune, rowData.ville].filter(Boolean);
    return parts.join(', ') || '-';
  };
  
  const typeBodyTemplate = (rowData) => {
    const colors = {
      CLIENT: 'bg-blue-100 text-blue-700',
      AGENT: 'bg-green-100 text-green-700',
      MARCHAND: 'bg-orange-100 text-orange-700',
      ADMIN: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[rowData.type_utilisateur] || 'bg-gray-100 text-gray-700'}`}>
        {rowData.type_utilisateur}
      </span>
    );
  };
  
  const statutBodyTemplate = (rowData) => {
    const colors = {
      ACTIF: 'bg-green-100 text-green-700',
      INACTIF: 'bg-gray-100 text-gray-700',
      SUSPENDU: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[rowData.statut] || 'bg-gray-100 text-gray-700'}`}>
        {rowData.statut}
      </span>
    );
  };
  
  const kycBodyTemplate = (rowData) => {
    return <span className="text-sm">Niveau {rowData.niveau_kyc || 0}</span>;
  };
  
  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-1">
        {rowData.telephone_verifie && <span className="text-xs text-green-600">✓ Tel</span>}
        {rowData.courriel_verifie && <span className="text-xs text-green-600">✓ Email</span>}
      </div>
    );
  };
  
  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedUser(rowData);
            setDialogMode('view');
            setShowDialog(true);
          }}
          className="p-2 text-primary hover:bg-primary/10 rounded"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    );
  };
  
  // Profils disponibles avec leurs caractéristiques
  const profiles = [
    {
      id: 'client-standard',
      name: 'Client Standard',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Profil de base pour les utilisateurs particuliers',
      features: [
        'Envoi et réception d\'argent',
        'Paiement de factures',
        'Historique des transactions',
        'Support client 24/7'
      ],
      limits: {
        daily: '5,000 €',
        monthly: '20,000 €',
        kyc: 'Niveau 1'
      },
      stats: {
        users: '12,450',
        growth: '+15%'
      }
    },
    {
      id: 'client-premium',
      name: 'Client Premium',
      icon: Crown,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      badge: 'Populaire',
      description: 'Profil avancé avec avantages exclusifs',
      features: [
        'Toutes les fonctionnalités Standard',
        'Frais réduits de 30%',
        'Virements internationaux',
        'Gestionnaire de compte dédié',
        'Carte virtuelle premium'
      ],
      limits: {
        daily: '50,000 €',
        monthly: '200,000 €',
        kyc: 'Niveau 2'
      },
      stats: {
        users: '3,280',
        growth: '+28%'
      }
    },
    {
      id: 'agent',
      name: 'Agent',
      icon: UserCheck,
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Profil pour les agents de distribution',
      features: [
        'Dépôt et retrait d\'espèces',
        'Gestion de la trésorerie',
        'Commissions automatiques',
        'Tableau de bord agent',
        'Rapports détaillés'
      ],
      limits: {
        daily: '100,000 €',
        monthly: 'Illimité',
        kyc: 'Niveau 3'
      },
      stats: {
        users: '1,850',
        growth: '+12%'
      }
    },
    {
      id: 'marchand',
      name: 'Marchand',
      icon: Building2,
      gradient: 'from-orange-500 to-orange-600',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Profil pour les commerçants et entreprises',
      features: [
        'Acceptation de paiements',
        'Point de vente (POS)',
        'Facturation automatique',
        'API d\'intégration',
        'Analytiques avancées',
        'Multi-utilisateurs'
      ],
      limits: {
        daily: 'Illimité',
        monthly: 'Illimité',
        kyc: 'Niveau 3'
      },
      stats: {
        users: '890',
        growth: '+35%'
      }
    },
    {
      id: 'admin',
      name: 'Administrateur',
      icon: Shield,
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600',
      badge: 'Accès complet',
      description: 'Profil avec tous les privilèges système',
      features: [
        'Gestion complète du système',
        'Configuration des paramètres',
        'Gestion des utilisateurs',
        'Accès aux logs et audits',
        'Contrôle des permissions',
        'Rapports globaux'
      ],
      limits: {
        daily: 'Illimité',
        monthly: 'Illimité',
        kyc: 'Niveau 3'
      },
      stats: {
        users: '45',
        growth: '+5%'
      }
    },
    {
      id: 'tech',
      name: 'Technique',
      icon: Zap,
      gradient: 'from-yellow-500 to-yellow-600',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'Profil pour l\'équipe technique',
      features: [
        'Monitoring système',
        'Gestion des API',
        'Configuration serveurs',
        'Logs et debugging',
        'Maintenance système',
        'Webhooks et intégrations'
      ],
      limits: {
        daily: 'N/A',
        monthly: 'N/A',
        kyc: 'Niveau 3'
      },
      stats: {
        users: '12',
        growth: '+0%'
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-anton uppercase text-text mb-2">Gestion des Utilisateurs</h1>
        <p className="text-sm text-gray-400">Gérez tous les utilisateurs du système</p>
      </div>

      {/* Statistiques - Disposition professionnelle */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 - Total Utilisateurs - Gradient Primary */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 rounded-xl p-4 shadow-md hover:shadow-lg transition-all group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/80 mb-2">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
                <p className="text-xs text-white/70">Tous les profils</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte 2 - Actifs - Fond secondary */}
        <div className="relative overflow-hidden bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-4 shadow-md hover:shadow-lg transition-all group">
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/80 mb-2">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-white mb-1">{stats.actifs}</p>
                <p className="text-xs text-white/70">Comptes actifs</p>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte 3 - KYC Validé - Fond gris propre */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 group">
          <div className="absolute top-0 right-0 w-22 h-22 bg-success/5 rounded-full -mr-11 -mt-11"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-2">KYC Validé</p>
                <p className="text-3xl font-bold text-success mb-1">{stats.kycValide}</p>
                <p className="text-xs text-gray-500">Identité vérifiée</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-success to-success/80 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte 4 - Pays - Fond blanc */}
        <div className="relative overflow-hidden bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-gray-200 group">
          <div className="absolute bottom-0 left-0 w-18 h-18 bg-warning/10 rounded-full -ml-9 -mb-9"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-2">Pays Couverts</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats.pays}</p>
                <p className="text-xs text-gray-400">Couverture globale</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-warning to-warning/80 rounded-xl group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres - Disposition professionnelle */}
      <div className="bg-card border border-darkGray rounded-xl overflow-hidden">
        {/* Filtres rapides */}
        <div className="p-5 border-b border-darkGray">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Filtres rapides</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilters({ ...filters, type_utilisateur: 'CLIENT' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.type_utilisateur === 'CLIENT'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              Clients
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, type_utilisateur: 'AGENT' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.type_utilisateur === 'AGENT'
                  ? 'bg-secondary text-white shadow-md'
                  : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, type_utilisateur: 'MARCHAND' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.type_utilisateur === 'MARCHAND'
                  ? 'bg-warning text-white shadow-md'
                  : 'bg-warning/10 text-warning hover:bg-warning/20'
              }`}
            >
              Marchands
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, type_utilisateur: 'ADMIN' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.type_utilisateur === 'ADMIN'
                  ? 'bg-danger text-white shadow-md'
                  : 'bg-danger/10 text-danger hover:bg-danger/20'
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, statut: 'ACTIF' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.statut === 'ACTIF'
                  ? 'bg-success text-white shadow-md'
                  : 'bg-success/10 text-success hover:bg-success/20'
              }`}
            >
              Actifs
            </button>
            <button
              onClick={() => {
                setFilters({ ...filters, telephone_verifie: 'true' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className={`px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                filters.telephone_verifie === 'true'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              Téléphone vérifié
            </button>
            <button
              onClick={() => {
                setFilters({ type_utilisateur: '', statut: '', niveau_kyc: '', pays_code: '', est_actif: '', telephone_verifie: '' });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium text-sm ml-auto"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Recherche et filtres avancés */}
        <div className="p-5 bg-background/50">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-secondary" />
            <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Recherche et filtres</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-text text-sm focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <Dropdown
              value={filters.type_utilisateur}
              options={typeOptions}
              onChange={(e) => {
                setFilters({ ...filters, type_utilisateur: e.value });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              placeholder="Type"
              className="w-full text-sm"
            />

            <Dropdown
              value={filters.statut}
              options={statutOptions}
              onChange={(e) => {
                setFilters({ ...filters, statut: e.value });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              placeholder="Statut"
              className="w-full text-sm"
            />

            <Dropdown
              value={filters.niveau_kyc}
              options={kycOptions}
              onChange={(e) => {
                setFilters({ ...filters, niveau_kyc: e.value });
                setLazyParams({ ...lazyParams, page: 0 });
              }}
              placeholder="Niveau KYC"
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-darkGray bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-warning" />
              <h3 className="text-sm font-semibold text-text uppercase tracking-wide">Actions</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setDialogMode('create');
                  setShowDialog(true);
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-medium text-sm shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4" />
                Nouveau
              </button>

              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        {initialLoad ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
            {[...Array(10)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 py-3 border-b border-darkGray">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
                <div className="ml-auto flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            value={users}
            lazy
            paginator
            first={lazyParams.first}
            rows={lazyParams.rows}
            totalRecords={totalRecords}
            onPage={onPage}
            loading={loading}
            rowsPerPageOptions={[10, 25, 50, 100]}
            className="custom-datatable"
            emptyMessage="Aucun utilisateur trouvé"
            scrollable
            scrollHeight="600px"
          >
            <Column 
              header="ID" 
              body={idBodyTemplate} 
              frozen
              style={{ width: '60px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="nom_complet" 
              header="Nom complet" 
              sortable 
              frozen
              style={{ minWidth: '200px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="courriel" 
              header="Email" 
              sortable 
              style={{ minWidth: '200px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="numero_telephone" 
              header="Téléphone" 
              body={phoneBodyTemplate}
              sortable 
              style={{ minWidth: '180px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="date_naissance" 
              header="Date naissance" 
              body={dateBodyTemplate}
              sortable 
              style={{ minWidth: '130px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="nationalite" 
              header="Nationalité" 
              body={nationaliteBodyTemplate}
              sortable 
              style={{ minWidth: '150px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="pays_residence" 
              header="Pays résidence" 
              body={paysResidenceBodyTemplate}
              sortable 
              style={{ minWidth: '150px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              header="Adresse" 
              body={adresseBodyTemplate}
              style={{ minWidth: '200px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="type_utilisateur" 
              header="Type" 
              body={typeBodyTemplate} 
              sortable 
              style={{ minWidth: '120px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="statut" 
              header="Statut" 
              body={statutBodyTemplate} 
              sortable 
              style={{ minWidth: '120px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              field="niveau_kyc" 
              header="KYC" 
              body={kycBodyTemplate} 
              sortable 
              style={{ minWidth: '100px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              header="Vérifications" 
              body={verifiedBodyTemplate} 
              style={{ minWidth: '150px', whiteSpace: 'nowrap' }} 
            />
            <Column 
              header="Actions" 
              body={actionsBodyTemplate} 
              frozen 
              alignFrozen="right" 
              style={{ width: '150px', whiteSpace: 'nowrap' }} 
            />
          </DataTable>
        )}
      </div>

      {/* Dialog */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={dialogMode === 'create' ? 'Nouvel utilisateur' : dialogMode === 'edit' ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'}
        style={{ width: '800px' }}
        className="custom-dialog"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 border-b border-darkGray pb-2">Informations personnelles</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Nom complet</p>
                  <p className="font-semibold text-text">{selectedUser.nom_complet}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Date de naissance</p>
                  <p className="font-semibold text-text">{selectedUser.date_naissance ? new Date(selectedUser.date_naissance).toLocaleDateString('fr-FR') : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Lieu de naissance</p>
                  <p className="font-semibold text-text">{selectedUser.lieu_naissance || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nationalité</p>
                  <p className="font-semibold text-text">{selectedUser.nationalite_details?.nom || '-'}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 border-b border-darkGray pb-2">Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="font-semibold text-text">{selectedUser.courriel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Téléphone</p>
                  <p className="font-semibold text-text">{formatPhoneNumber(selectedUser.numero_telephone)}</p>
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 border-b border-darkGray pb-2">Adresse</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Pays de résidence</p>
                  <p className="font-semibold text-text">{selectedUser.pays_residence_details?.nom || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Province</p>
                  <p className="font-semibold text-text">{selectedUser.province || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Ville</p>
                  <p className="font-semibold text-text">{selectedUser.ville || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Commune</p>
                  <p className="font-semibold text-text">{selectedUser.commune || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Quartier</p>
                  <p className="font-semibold text-text">{selectedUser.quartier || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avenue</p>
                  <p className="font-semibold text-text">{selectedUser.avenue || '-'}</p>
                </div>
              </div>
            </div>

            {/* Compte */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase mb-3 border-b border-darkGray pb-2">Compte</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  {typeBodyTemplate(selectedUser)}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Statut</p>
                  {statutBodyTemplate(selectedUser)}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Niveau KYC</p>
                  {kycBodyTemplate(selectedUser)}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Vérifications</p>
                  {verifiedBodyTemplate(selectedUser)}
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default GestionProfils;

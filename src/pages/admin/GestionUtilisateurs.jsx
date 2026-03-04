import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from '../../components/common';
import { 
  Search, Filter, Download, Plus, Edit, Trash2, Eye, 
  Users, UserCheck, Shield, Globe, Phone, Mail
} from 'lucide-react';
import apiService from '../../services/api';

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Filtres
  const [filters, setFilters] = useState({
    type_utilisateur: '',
    statut: '',
    niveau_kyc: '',
    pays_code: '',
    est_actif: '',
    telephone_verifie: ''
  });

  // Pagination
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 0
  });

  // Dialog
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // view, edit, create

  // Options pour les filtres
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
    { label: 'Suspendu', value: 'SUSPENDU' },
    { label: 'Bloqué', value: 'BLOQUE' }
  ];

  const kycOptions = [
    { label: 'Tous', value: '' },
    { label: 'Niveau 0', value: '0' },
    { label: 'Niveau 1', value: '1' },
    { label: 'Niveau 2', value: '2' },
    { label: 'Niveau 3', value: '3' }
  ];

  const booleanOptions = [
    { label: 'Tous', value: '' },
    { label: 'Oui', value: 'true' },
    { label: 'Non', value: 'false' }
  ];

  // Charger les utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: globalFilter,
        page: lazyParams.page + 1,
        page_size: lazyParams.rows
      };

      // Nettoyer les paramètres vides
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await apiService.getUsers(params);
      
      // L'API retourne { count, next, previous, results }
      setUsers(response.results || []);
      setTotalRecords(response.count || 0);
      setInitialLoad(false);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setUsers([]);
      setTotalRecords(0);
      setInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [lazyParams, filters, globalFilter]);

  // Calculer les statistiques
  const stats = {
    total: totalRecords,
    actifs: users.filter(u => u.statut === 'ACTIF').length,
    kycValide: users.filter(u => u.niveau_kyc >= 2).length,
    pays: new Set(users.map(u => u.pays_residence).filter(Boolean)).size
  };

  const onPage = (event) => {
    setLazyParams(event);
  };

  // Templates pour les colonnes
  const typeBodyTemplate = (rowData) => {
    const config = {
      CLIENT: { label: 'Client', severity: 'info' },
      AGENT: { label: 'Agent', severity: 'success' },
      MARCHAND: { label: 'Marchand', severity: 'warning' },
      ADMIN: { label: 'Admin', severity: 'danger' }
    };
    const { label, severity } = config[rowData.type_utilisateur] || { label: rowData.type_utilisateur, severity: 'secondary' };
    return <Tag value={label} severity={severity} />;
  };

  const statutBodyTemplate = (rowData) => {
    const config = {
      ACTIF: { label: 'Actif', severity: 'success' },
      SUSPENDU: { label: 'Suspendu', severity: 'warning' },
      BLOQUE: { label: 'Bloqué', severity: 'danger' }
    };
    const { label, severity } = config[rowData.statut] || { label: rowData.statut, severity: 'secondary' };
    return <Tag value={label} severity={severity} />;
  };

  const kycBodyTemplate = (rowData) => {
    return <Tag value={`Niveau ${rowData.niveau_kyc}`} severity="info" />;
  };

  const verifiedBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        {rowData.telephone_verifie && (
          <Tag icon={<Phone className="w-3 h-3 mr-1" />} value="Tél" severity="success" />
        )}
        {rowData.courriel_verifie && (
          <Tag icon={<Mail className="w-3 h-3 mr-1" />} value="Email" severity="success" />
        )}
      </div>
    );
  };

  const idBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => {
          navigator.clipboard.writeText(rowData.id);
          // TODO: Ajouter un toast de confirmation
        }}
        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
        title={`Copier l'ID: ${rowData.id}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    );
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    // Format: +257 XX XX XX XX ou similaire
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 0) return phone;
    
    // Si commence par un code pays
    if (phone.startsWith('+')) {
      const countryCode = cleaned.substring(0, 3);
      const rest = cleaned.substring(3);
      const formatted = rest.match(/.{1,2}/g)?.join(' ') || rest;
      return `+${countryCode} ${formatted}`;
    }
    
    // Sinon format simple par groupes de 2
    return cleaned.match(/.{1,2}/g)?.join(' ') || phone;
  };

  const phoneBodyTemplate = (rowData) => {
    const formatted = formatPhoneNumber(rowData.numero_telephone);
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{formatted}</span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(rowData.numero_telephone);
          }}
          className="p-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
          title="Copier le numéro"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
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
          className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          title="Voir"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedUser(rowData);
            setDialogMode('edit');
            setShowDialog(true);
          }}
          className="p-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors"
          title="Modifier"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDelete(rowData)}
          className="p-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const handleDelete = async (user) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.nom_complet} ?`)) {
      try {
        await apiService.deleteUser(user.id);
        loadUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implémenter l'export
    console.log('Export des données');
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-bold text-primary">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-400">Total Utilisateurs</p>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <UserCheck className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-3xl font-bold text-secondary">{stats.actifs}</span>
          </div>
          <p className="text-sm text-gray-400">Actifs</p>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-success/20 rounded-lg">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <span className="text-3xl font-bold text-success">{stats.kycValide}</span>
          </div>
          <p className="text-sm text-gray-400">KYC Validé</p>
        </div>

        <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-warning/20 rounded-lg">
              <Globe className="w-6 h-6 text-warning" />
            </div>
            <span className="text-3xl font-bold text-warning">{stats.pays}</span>
          </div>
          <p className="text-sm text-gray-400">Pays</p>
        </div>
      </div>

      {/* Filtres rapides */}
      <div className="bg-card border border-darkGray rounded-lg p-4">
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setFilters({ ...filters, type_utilisateur: 'CLIENT' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Clients
          </button>
          <button
            onClick={() => setFilters({ ...filters, type_utilisateur: 'AGENT' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Agents
          </button>
          <button
            onClick={() => setFilters({ ...filters, type_utilisateur: 'MARCHAND' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Marchands
          </button>
          <button
            onClick={() => setFilters({ ...filters, type_utilisateur: 'ADMIN' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Admins
          </button>
          <button
            onClick={() => setFilters({ ...filters, statut: 'ACTIF' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Actifs
          </button>
          <button
            onClick={() => setFilters({ ...filters, telephone_verifie: 'true' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Téléphone vérifié
          </button>
          <button
            onClick={() => setFilters({ type_utilisateur: '', statut: '', niveau_kyc: '', pays_code: '', est_actif: '', telephone_verifie: '' })}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text"
            />
          </div>

          <Dropdown
            value={filters.type_utilisateur}
            options={typeOptions}
            onChange={(e) => setFilters({ ...filters, type_utilisateur: e.value })}
            placeholder="Type"
            className="w-full"
          />

          <Dropdown
            value={filters.statut}
            options={statutOptions}
            onChange={(e) => setFilters({ ...filters, statut: e.value })}
            placeholder="Statut"
            className="w-full"
          />

          <Dropdown
            value={filters.niveau_kyc}
            options={kycOptions}
            onChange={(e) => setFilters({ ...filters, niveau_kyc: e.value })}
            placeholder="Niveau KYC"
            className="w-full"
          />

          <button
            onClick={() => {
              setSelectedUser(null);
              setDialogMode('create');
              setShowDialog(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nouveau
          </button>

          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        {initialLoad ? (
          // Skeleton pour le chargement initial
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
              field="pays_residence" 
              header="Pays" 
              sortable 
              style={{ minWidth: '100px', whiteSpace: 'nowrap' }} 
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Nom complet</p>
                <p className="font-semibold text-text">{selectedUser.nom_complet}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold text-text">{selectedUser.courriel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p className="font-semibold text-text">{selectedUser.numero_telephone}</p>
              </div>
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
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default GestionUtilisateurs;

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { 
  Search, UserPlus, Download, Eye, Ban, CheckCircle, 
  MapPin, Wallet, TrendingUp, Users
} from 'lucide-react';

function GestionAgents() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // Données fictives
  const agents = [
    { id: 'AG001', nom: 'Jean Mukiza', telephone: '+257 79 123 456', province: 'Bujumbura Mairie', commune: 'Mukaza', status: 'actif', float: 2500000, transactions: 1234, commissions: 125000, dateCreation: '2024-01-15' },
    { id: 'AG002', nom: 'Marie Ndayisenga', telephone: '+257 79 234 567', province: 'Bujumbura Mairie', commune: 'Ntahangwa', status: 'actif', float: 1800000, transactions: 987, commissions: 98700, dateCreation: '2024-02-20' },
    { id: 'AG003', nom: 'Pierre Nkurunziza', telephone: '+257 79 345 678', province: 'Gitega', commune: 'Gitega', status: 'suspendu', float: 500000, transactions: 234, commissions: 23400, dateCreation: '2024-01-10' },
    { id: 'AG004', nom: 'Grace Irakoze', telephone: '+257 79 456 789', province: 'Ngozi', commune: 'Ngozi', status: 'actif', float: 1900000, transactions: 945, commissions: 94500, dateCreation: '2024-03-05' },
    { id: 'AG005', nom: 'David Niyonzima', telephone: '+257 79 567 890', province: 'Muyinga', commune: 'Muyinga', status: 'actif', float: 2100000, transactions: 1023, commissions: 102300, dateCreation: '2024-02-12' },
    { id: 'AG006', nom: 'Sarah Nshimirimana', telephone: '+257 79 678 901', province: 'Kayanza', commune: 'Kayanza', status: 'inactif', float: 300000, transactions: 156, commissions: 15600, dateCreation: '2023-12-20' },
    { id: 'AG007', nom: 'Emmanuel Ndikumana', telephone: '+257 79 789 012', province: 'Bururi', commune: 'Bururi', status: 'actif', float: 1700000, transactions: 789, commissions: 78900, dateCreation: '2024-01-25' },
    { id: 'AG008', nom: 'Claudine Bizimana', telephone: '+257 79 890 123', province: 'Cibitoke', commune: 'Cibitoke', status: 'actif', float: 2300000, transactions: 1156, commissions: 115600, dateCreation: '2024-03-10' },
  ];

  const statusOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Actifs', value: 'actif' },
    { label: 'Suspendus', value: 'suspendu' },
    { label: 'Inactifs', value: 'inactif' }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    const matchesSearch = !globalFilter || 
      agent.nom.toLowerCase().includes(globalFilter.toLowerCase()) ||
      agent.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      agent.telephone.includes(globalFilter) ||
      agent.province.toLowerCase().includes(globalFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Stats
  const stats = {
    total: agents.length,
    actifs: agents.filter(a => a.status === 'actif').length,
    suspendus: agents.filter(a => a.status === 'suspendu').length,
    floatTotal: agents.reduce((sum, a) => sum + a.float, 0)
  };

  const statusBodyTemplate = (rowData) => {
    const severity = {
      actif: 'success',
      suspendu: 'warning',
      inactif: 'danger'
    };
    return <Tag value={rowData.status} severity={severity[rowData.status]} />;
  };

  const floatBodyTemplate = (rowData) => {
    return <span className="font-semibold text-primary">{rowData.float.toLocaleString()} BIF</span>;
  };

  const commissionsBodyTemplate = (rowData) => {
    return <span className="font-semibold text-secondary">{rowData.commissions.toLocaleString()} BIF</span>;
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedAgent(rowData);
            setShowDialog(true);
          }}
          className="p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
          title="Voir détails"
        >
          <Eye className="w-4 h-4" />
        </button>
        {rowData.status === 'actif' && (
          <button
            className="p-2 bg-danger/10 text-danger rounded hover:bg-danger/20 transition-colors"
            title="Suspendre"
          >
            <Ban className="w-4 h-4" />
          </button>
        )}
        {rowData.status === 'suspendu' && (
          <button
            className="p-2 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors"
            title="Activer"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-anton uppercase text-text">Gestion des Agents</h1>
          <p className="text-sm text-gray-400 mt-1">Gérer le réseau d'agents uFaranga</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <UserPlus className="w-5 h-5" />
          <span>Nouvel Agent</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Agents</p>
              <p className="text-2xl font-bold text-text">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Actifs</p>
              <p className="text-2xl font-bold text-secondary">{stats.actifs}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger/10 rounded-lg">
              <Ban className="w-6 h-6 text-danger" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Suspendus</p>
              <p className="text-2xl font-bold text-danger">{stats.suspendus}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Float Total</p>
              <p className="text-xl font-bold text-text">{(stats.floatTotal / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-darkGray rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Rechercher par nom, ID, téléphone, province..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text"
            />
          </div>
          
          <Dropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(e) => setSelectedStatus(e.value)}
            className="w-full md:w-48"
          />

          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
            <Download className="w-5 h-5" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        <DataTable
          value={filteredAgents}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="custom-datatable"
          emptyMessage="Aucun agent trouvé"
        >
          <Column field="id" header="ID Agent" sortable />
          <Column field="nom" header="Nom" sortable />
          <Column field="telephone" header="Téléphone" />
          <Column field="province" header="Province" sortable />
          <Column field="commune" header="Commune" />
          <Column field="float" header="Float" body={floatBodyTemplate} sortable />
          <Column field="transactions" header="Transactions" sortable />
          <Column field="commissions" header="Commissions" body={commissionsBodyTemplate} sortable />
          <Column field="status" header="Statut" body={statusBodyTemplate} sortable />
          <Column header="Actions" body={actionsBodyTemplate} />
        </DataTable>
      </div>

      {/* Dialog Détails Agent */}
      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Détails de l'Agent"
        style={{ width: '600px' }}
        className="custom-dialog"
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">ID Agent</p>
                <p className="font-semibold text-text">{selectedAgent.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Nom</p>
                <p className="font-semibold text-text">{selectedAgent.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p className="font-semibold text-text">{selectedAgent.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Province</p>
                <p className="font-semibold text-text">{selectedAgent.province}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Float</p>
                <p className="font-semibold text-primary">{selectedAgent.float.toLocaleString()} BIF</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="font-semibold text-text">{selectedAgent.transactions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Commissions</p>
                <p className="font-semibold text-secondary">{selectedAgent.commissions.toLocaleString()} BIF</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date création</p>
                <p className="font-semibold text-text">{selectedAgent.dateCreation}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default GestionAgents;

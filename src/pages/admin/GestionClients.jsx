import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { 
  Search, UserPlus, Download, Eye, Ban, CheckCircle, 
  Shield, Users, Wallet, TrendingUp
} from 'lucide-react';

function GestionClients() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const clients = [
    { id: 'CL00001', nom: 'Alice Niyonkuru', telephone: '+257 79 111 222', email: 'alice@email.com', solde: 125000, kycStatus: 'verifie', status: 'actif', plafond: 500000, transactions: 45, dateInscription: '2024-01-10' },
    { id: 'CL00002', nom: 'Bob Ndayishimiye', telephone: '+257 79 222 333', email: 'bob@email.com', solde: 89000, kycStatus: 'en_attente', status: 'actif', plafond: 200000, transactions: 23, dateInscription: '2024-02-15' },
    { id: 'CL00003', nom: 'Claire Habonimana', telephone: '+257 79 333 444', email: 'claire@email.com', solde: 234000, kycStatus: 'verifie', status: 'actif', plafond: 1000000, transactions: 78, dateInscription: '2023-12-05' },
    { id: 'CL00004', nom: 'Daniel Nshimirimana', telephone: '+257 79 444 555', email: 'daniel@email.com', solde: 45000, kycStatus: 'rejete', status: 'suspendu', plafond: 100000, transactions: 12, dateInscription: '2024-03-01' },
    { id: 'CL00005', nom: 'Emma Irakoze', telephone: '+257 79 555 666', email: 'emma@email.com', solde: 567000, kycStatus: 'verifie', status: 'actif', plafond: 2000000, transactions: 156, dateInscription: '2023-11-20' },
    { id: 'CL00006', nom: 'Frank Bizimana', telephone: '+257 79 666 777', email: 'frank@email.com', solde: 12000, kycStatus: 'non_verifie', status: 'actif', plafond: 50000, transactions: 5, dateInscription: '2024-03-15' },
    { id: 'CL00007', nom: 'Grace Mukiza', telephone: '+257 79 777 888', email: 'grace@email.com', solde: 345000, kycStatus: 'verifie', status: 'actif', plafond: 1500000, transactions: 92, dateInscription: '2024-01-25' },
    { id: 'CL00008', nom: 'Henry Nkurunziza', telephone: '+257 79 888 999', email: 'henry@email.com', solde: 78000, kycStatus: 'en_attente', status: 'actif', plafond: 300000, transactions: 34, dateInscription: '2024-02-28' },
  ];

  const statusOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Actifs', value: 'actif' },
    { label: 'Suspendus', value: 'suspendu' }
  ];

  const filteredClients = clients.filter(client => {
    const matchesStatus = selectedStatus === 'all' || client.status === selectedStatus;
    const matchesSearch = !globalFilter || 
      client.nom.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      client.telephone.includes(globalFilter) ||
      client.email.toLowerCase().includes(globalFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: clients.length,
    actifs: clients.filter(c => c.status === 'actif').length,
    kycVerifies: clients.filter(c => c.kycStatus === 'verifie').length,
    soldeTotal: clients.reduce((sum, c) => sum + c.solde, 0)
  };

  const kycStatusBodyTemplate = (rowData) => {
    const config = {
      verifie: { label: 'Vérifié', severity: 'success' },
      en_attente: { label: 'En attente', severity: 'warning' },
      rejete: { label: 'Rejeté', severity: 'danger' },
      non_verifie: { label: 'Non vérifié', severity: 'info' }
    };
    const { label, severity } = config[rowData.kycStatus];
    return <Tag value={label} severity={severity} />;
  };

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={rowData.status === 'actif' ? 'success' : 'danger'} />;
  };

  const soldeBodyTemplate = (rowData) => {
    return <span className="font-semibold text-primary">{rowData.solde.toLocaleString()} BIF</span>;
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedClient(rowData);
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
        {rowData.kycStatus !== 'verifie' && (
          <button
            className="p-2 bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors"
            title="Vérifier KYC"
          >
            <Shield className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-anton uppercase text-text">Gestion des Clients</h1>
          <p className="text-sm text-gray-400 mt-1">Gérer les utilisateurs de la plateforme</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <UserPlus className="w-5 h-5" />
          <span>Nouveau Client</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Clients</p>
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
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">KYC Vérifiés</p>
              <p className="text-2xl font-bold text-text">{stats.kycVerifies}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Wallet className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Solde Total</p>
              <p className="text-xl font-bold text-text">{(stats.soldeTotal / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-darkGray rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Rechercher par nom, ID, téléphone, email..."
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

      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        <DataTable
          value={filteredClients}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="custom-datatable"
          emptyMessage="Aucun client trouvé"
        >
          <Column field="id" header="ID Client" sortable />
          <Column field="nom" header="Nom" sortable />
          <Column field="telephone" header="Téléphone" />
          <Column field="email" header="Email" />
          <Column field="solde" header="Solde" body={soldeBodyTemplate} sortable />
          <Column field="plafond" header="Plafond" sortable />
          <Column field="kycStatus" header="KYC" body={kycStatusBodyTemplate} sortable />
          <Column field="status" header="Statut" body={statusBodyTemplate} sortable />
          <Column header="Actions" body={actionsBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Détails du Client"
        style={{ width: '600px' }}
        className="custom-dialog"
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">ID Client</p>
                <p className="font-semibold text-text">{selectedClient.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Nom</p>
                <p className="font-semibold text-text">{selectedClient.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p className="font-semibold text-text">{selectedClient.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="font-semibold text-text">{selectedClient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Solde</p>
                <p className="font-semibold text-primary">{selectedClient.solde.toLocaleString()} BIF</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Plafond</p>
                <p className="font-semibold text-text">{selectedClient.plafond.toLocaleString()} BIF</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Transactions</p>
                <p className="font-semibold text-text">{selectedClient.transactions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date inscription</p>
                <p className="font-semibold text-text">{selectedClient.dateInscription}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default GestionClients;

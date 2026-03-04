import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { 
  Search, Download, Eye, XCircle, CheckCircle, 
  Clock, TrendingUp, Activity, DollarSign
} from 'lucide-react';

function ToutesTransactions() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const transactions = [
    { id: 'TXN001234', type: 'depot', montant: 50000, frais: 500, expediteur: 'Alice Niyonkuru (CL00001)', destinataire: 'Jean Mukiza (AG001)', status: 'reussie', date: '2024-03-15 14:30', reference: 'REF123456' },
    { id: 'TXN001235', type: 'retrait', montant: 30000, frais: 300, expediteur: 'Bob Ndayishimiye (CL00002)', destinataire: 'Marie Ndayisenga (AG002)', status: 'reussie', date: '2024-03-15 14:35', reference: 'REF123457' },
    { id: 'TXN001236', type: 'transfert', montant: 75000, frais: 750, expediteur: 'Claire Habonimana (CL00003)', destinataire: 'Emma Irakoze (CL00005)', status: 'en_attente', date: '2024-03-15 14:40', reference: 'REF123458' },
    { id: 'TXN001237', type: 'paiement', montant: 25000, frais: 250, expediteur: 'Daniel Nshimirimana (CL00004)', destinataire: 'Facture REGIDESO', status: 'echouee', date: '2024-03-15 14:45', reference: 'REF123459' },
    { id: 'TXN001238', type: 'depot', montant: 100000, frais: 1000, expediteur: 'Emma Irakoze (CL00005)', destinataire: 'Pierre Nkurunziza (AG003)', status: 'reussie', date: '2024-03-15 14:50', reference: 'REF123460' },
    { id: 'TXN001239', type: 'retrait', montant: 45000, frais: 450, expediteur: 'Frank Bizimana (CL00006)', destinataire: 'Grace Irakoze (AG004)', status: 'reussie', date: '2024-03-15 14:55', reference: 'REF123461' },
    { id: 'TXN001240', type: 'transfert', montant: 60000, frais: 600, expediteur: 'Grace Mukiza (CL00007)', destinataire: 'Alice Niyonkuru (CL00001)', status: 'reussie', date: '2024-03-15 15:00', reference: 'REF123462' },
    { id: 'TXN001241', type: 'paiement', montant: 15000, frais: 150, expediteur: 'Henry Nkurunziza (CL00008)', destinataire: 'Facture ECONET', status: 'en_attente', date: '2024-03-15 15:05', reference: 'REF123463' },
  ];

  const typeOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Dépôt', value: 'depot' },
    { label: 'Retrait', value: 'retrait' },
    { label: 'Transfert', value: 'transfert' },
    { label: 'Paiement', value: 'paiement' }
  ];

  const statusOptions = [
    { label: 'Tous', value: 'all' },
    { label: 'Réussie', value: 'reussie' },
    { label: 'En attente', value: 'en_attente' },
    { label: 'Échouée', value: 'echouee' }
  ];

  const filteredTransactions = transactions.filter(txn => {
    const matchesType = selectedType === 'all' || txn.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;
    const matchesSearch = !globalFilter || 
      txn.id.toLowerCase().includes(globalFilter.toLowerCase()) ||
      txn.reference.toLowerCase().includes(globalFilter.toLowerCase()) ||
      txn.expediteur.toLowerCase().includes(globalFilter.toLowerCase()) ||
      txn.destinataire.toLowerCase().includes(globalFilter.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const stats = {
    total: transactions.length,
    reussies: transactions.filter(t => t.status === 'reussie').length,
    enAttente: transactions.filter(t => t.status === 'en_attente').length,
    volumeTotal: transactions.filter(t => t.status === 'reussie').reduce((sum, t) => sum + t.montant, 0)
  };

  const typeBodyTemplate = (rowData) => {
    const config = {
      depot: { label: 'Dépôt', severity: 'success', icon: '↓' },
      retrait: { label: 'Retrait', severity: 'warning', icon: '↑' },
      transfert: { label: 'Transfert', severity: 'info', icon: '⇄' },
      paiement: { label: 'Paiement', severity: 'help', icon: '💳' }
    };
    const { label, severity, icon } = config[rowData.type];
    return <Tag value={`${icon} ${label}`} severity={severity} />;
  };

  const statusBodyTemplate = (rowData) => {
    const config = {
      reussie: { label: 'Réussie', severity: 'success' },
      en_attente: { label: 'En attente', severity: 'warning' },
      echouee: { label: 'Échouée', severity: 'danger' }
    };
    const { label, severity } = config[rowData.status];
    return <Tag value={label} severity={severity} />;
  };

  const montantBodyTemplate = (rowData) => {
    return <span className="font-semibold text-primary">{rowData.montant.toLocaleString()} BIF</span>;
  };

  const fraisBodyTemplate = (rowData) => {
    return <span className="text-secondary">{rowData.frais.toLocaleString()} BIF</span>;
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedTransaction(rowData);
            setShowDialog(true);
          }}
          className="p-2 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
          title="Voir détails"
        >
          <Eye className="w-4 h-4" />
        </button>
        {rowData.status === 'reussie' && (
          <button
            className="p-2 bg-danger/10 text-danger rounded hover:bg-danger/20 transition-colors"
            title="Annuler"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-anton uppercase text-text">Toutes les Transactions</h1>
          <p className="text-sm text-gray-400 mt-1">Historique complet des transactions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
          <Download className="w-5 h-5" />
          <span>Exporter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total</p>
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
              <p className="text-sm text-gray-400">Réussies</p>
              <p className="text-2xl font-bold text-secondary">{stats.reussies}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger/10 rounded-lg">
              <Clock className="w-6 h-6 text-danger" />
            </div>
            <div>
              <p className="text-sm text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-danger">{stats.enAttente}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-darkGray rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Volume</p>
              <p className="text-xl font-bold text-text">{(stats.volumeTotal / 1000000).toFixed(1)}M</p>
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
              placeholder="Rechercher par ID, référence, expéditeur, destinataire..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text"
            />
          </div>
          
          <Dropdown
            value={selectedType}
            options={typeOptions}
            onChange={(e) => setSelectedType(e.value)}
            className="w-full md:w-48"
            placeholder="Type"
          />

          <Dropdown
            value={selectedStatus}
            options={statusOptions}
            onChange={(e) => setSelectedStatus(e.value)}
            className="w-full md:w-48"
            placeholder="Statut"
          />
        </div>
      </div>

      <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
        <DataTable
          value={filteredTransactions}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className="custom-datatable"
          emptyMessage="Aucune transaction trouvée"
        >
          <Column field="id" header="ID Transaction" sortable />
          <Column field="type" header="Type" body={typeBodyTemplate} sortable />
          <Column field="montant" header="Montant" body={montantBodyTemplate} sortable />
          <Column field="frais" header="Frais" body={fraisBodyTemplate} />
          <Column field="expediteur" header="Expéditeur" />
          <Column field="destinataire" header="Destinataire" />
          <Column field="status" header="Statut" body={statusBodyTemplate} sortable />
          <Column field="date" header="Date" sortable />
          <Column header="Actions" body={actionsBodyTemplate} />
        </DataTable>
      </div>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header="Détails de la Transaction"
        style={{ width: '600px' }}
        className="custom-dialog"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">ID Transaction</p>
                <p className="font-semibold text-text">{selectedTransaction.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Référence</p>
                <p className="font-semibold text-text">{selectedTransaction.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Type</p>
                <p className="font-semibold text-text">{selectedTransaction.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Statut</p>
                <p className="font-semibold text-text">{selectedTransaction.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Montant</p>
                <p className="font-semibold text-primary">{selectedTransaction.montant.toLocaleString()} BIF</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Frais</p>
                <p className="font-semibold text-secondary">{selectedTransaction.frais.toLocaleString()} BIF</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400">Expéditeur</p>
                <p className="font-semibold text-text">{selectedTransaction.expediteur}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400">Destinataire</p>
                <p className="font-semibold text-text">{selectedTransaction.destinataire}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-semibold text-text">{selectedTransaction.date}</p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default ToutesTransactions;

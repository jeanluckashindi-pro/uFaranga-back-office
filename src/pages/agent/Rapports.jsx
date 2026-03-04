import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Calendar as CalendarIcon, Download, TrendingUp, Activity,
  DollarSign, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight,
  CreditCard, Target, Shield, RefreshCw, BarChart3, Clock, FileText, CheckCircle
} from 'lucide-react';

function Rapports() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [showOfficialReport, setShowOfficialReport] = useState(false);
  const dt = useRef(null);
  const menuRef = useRef(null);
  const toast = useRef(null);

  const periods = [
    { label: "Aujourd'hui", value: 'today' },
    { label: 'Hier', value: 'yesterday' },
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Personnalisé', value: 'custom' }
  ];

  const financialSummary = {
    volumeTotal: 5850000,
    nombreTransactions: 42,
    totalDepots: 2500000,
    totalRetraits: 1800000,
    totalTransferts: 1200000,
    totalPaiements: 350000,
    totalCommissions: 58500,
    transactionsEchouees: 3,
    tauxSucces: 92.9
  };

  const cloture = {
    soldeDebut: 2000000,
    floatRecu: 1500000,
    floatUtilise: 850000,
    soldeFinTheorique: 2650000,
    cashDeclare: 2650000,
    ecart: 0
  };

  const [transactions] = useState([
    { id: 'TXN001', date: '2026-02-12', heure: '14:35', type: 'depot', client: 'Marie Kalala', montant: 50000, commission: 500, statut: 'success', reference: 'DEP-001' },
    { id: 'TXN002', date: '2026-02-12', heure: '14:28', type: 'retrait', client: 'Jean Mbala', montant: 30000, commission: 450, statut: 'success', reference: 'RET-002' },
    { id: 'TXN003', date: '2026-02-12', heure: '14:15', type: 'transfert', client: 'Sophie Tshala', montant: 25000, commission: 250, statut: 'success', reference: 'TRF-003' },
    { id: 'TXN004', date: '2026-02-12', heure: '13:52', type: 'depot', client: 'Paul Kabongo', montant: 100000, commission: 1000, statut: 'success', reference: 'DEP-004' },
    { id: 'TXN005', date: '2026-02-12', heure: '13:45', type: 'paiement', client: 'Alice Mbuyi', montant: 15000, commission: 200, statut: 'success', reference: 'PAY-005' }
  ]);

  const volumeEvolution = [
    { jour: 'Lun', volume: 4850000, transactions: 38 },
    { jour: 'Mar', volume: 5200000, transactions: 42 },
    { jour: 'Mer', volume: 4950000, transactions: 40 },
    { jour: 'Jeu', volume: 5850000, transactions: 45 },
    { jour: 'Ven', volume: 6100000, transactions: 48 },
    { jour: 'Sam', volume: 3200000, transactions: 28 },
    { jour: 'Dim', volume: 2100000, transactions: 18 }
  ];

  const repartitionTypes = [
    { name: 'Dépôts', value: 2500000, color: '#F58424' },
    { name: 'Retraits', value: 1800000, color: '#007BFF' },
    { name: 'Transferts', value: 1200000, color: '#10b981' },
    { name: 'Paiements', value: 350000, color: '#f59e0b' }
  ];

  const heuresActives = [
    { heure: '08h', transactions: 2 },
    { heure: '09h', transactions: 5 },
    { heure: '10h', transactions: 8 },
    { heure: '11h', transactions: 6 },
    { heure: '12h', transactions: 7 },
    { heure: '13h', transactions: 9 },
    { heure: '14h', transactions: 5 }
  ];

  const exportCSV = () => { 
    dt.current.exportCSV(); 
    toast.current.show({
      severity: 'success',
      summary: 'Export CSV',
      detail: 'Le fichier CSV a été téléchargé avec succès',
      life: 3000
    });
  };

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default();
        doc.setFontSize(18);
        doc.text('Rapport Agent uFaranga', 14, 20);
        doc.setFontSize(11);
        doc.text(`Période: ${selectedPeriod}`, 14, 30);
        doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 36);
        
        const exportColumns = [
          { title: 'Date', dataKey: 'date' },
          { title: 'Type', dataKey: 'type' },
          { title: 'Client', dataKey: 'client' },
          { title: 'Montant', dataKey: 'montant' },
          { title: 'Commission', dataKey: 'commission' }
        ];

        doc.autoTable({
          columns: exportColumns,
          body: transactions,
          startY: 45,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [0, 123, 255] }
        });

        doc.save('rapport_agent.pdf');
        
        toast.current.show({
          severity: 'success',
          summary: 'Export PDF',
          detail: 'Le rapport PDF a été généré avec succès',
          life: 3000
        });
      });
    });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(transactions);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      import('file-saver').then((module) => {
        if (module && module.default) {
          const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          module.default.saveAs(data, 'rapport_agent_' + new Date().getTime() + '.xlsx');
        }
      });
    });
  };

  const exportMenuItems = [
    { label: 'Excel', icon: 'pi pi-file-excel', command: () => exportExcel() },
    { label: 'PDF', icon: 'pi pi-file-pdf', command: () => exportPdf() },
    { label: 'CSV', icon: 'pi pi-file', command: () => exportCSV() },
    { label: 'Imprimer', icon: 'pi pi-print', command: () => window.print() }
  ];

  const typeBodyTemplate = (rowData) => {
    const types = {
      depot: { icon: ArrowDownToLine, label: 'Dépôt', color: '#F58424' },
      retrait: { icon: ArrowUpFromLine, label: 'Retrait', color: '#007BFF' },
      transfert: { icon: ArrowLeftRight, label: 'Transfert', color: '#10b981' },
      paiement: { icon: CreditCard, label: 'Paiement', color: '#f59e0b' }
    };
    const type = types[rowData.type];
    const Icon = type.icon;
    return (
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: type.color }} />
        <span className="text-text">{type.label}</span>
      </div>
    );
  };

  const montantBodyTemplate = (rowData) => (
    <div className="font-bold text-text">{rowData.montant.toLocaleString()} BIF</div>
  );

  const commissionBodyTemplate = (rowData) => (
    <div className="font-semibold text-secondary">{rowData.commission.toLocaleString()} BIF</div>
  );

  const statutBodyTemplate = (rowData) => (
    rowData.statut === 'success' ? <Tag value="Succès" severity="success" /> : <Tag value="Échec" severity="danger" />
  );

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">Rapports & Analyses</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">Comptabilité, clôture et exports officiels</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Rafraîchir">
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-text" />
          </button>
          <Button label="Rapport Officiel" icon={<Shield className="w-4 h-4 mr-2" />} onClick={() => setShowOfficialReport(true)} className="bg-primary text-white hover:bg-primary/80 px-4 py-2 rounded-lg font-semibold whitespace-nowrap" />
          <Menu model={exportMenuItems} popup ref={menuRef} />
          <Button label="Exporter" icon={<Download className="w-4 h-4 mr-2" />} onClick={(e) => menuRef.current.toggle(e)} className="bg-secondary text-white hover:bg-secondary/80 px-4 py-2 rounded-lg font-semibold whitespace-nowrap" />
        </div>
      </div>

      {/* 1. SÉLECTEUR DE PÉRIODE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h3 className="text-lg font-luckiest text-text mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Sélection de Période
        </h3>
        <div className="flex flex-wrap gap-3">
          {periods.map((period) => (
            <button key={period.value} onClick={() => { setSelectedPeriod(period.value); if (period.value !== 'custom') setCustomDateRange(null); }} className={`px-4 py-2 rounded-lg font-semibold transition-colors ${selectedPeriod === period.value ? 'bg-primary text-white' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'}`}>
              {period.label}
            </button>
          ))}
        </div>
        {selectedPeriod === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-semibold text-text mb-2">Plage de dates personnalisée</label>
            <Calendar value={customDateRange} onChange={(e) => setCustomDateRange(e.value)} selectionMode="range" readOnlyInput dateFormat="dd/mm/yy" placeholder="Sélectionner une plage" className="w-full md:w-auto" />
          </div>
        )}
      </div>

      {/* 2. RÉSUMÉ FINANCIER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4" />Volume Total</p>
          <p className="text-3xl font-bold text-text mb-1">{(financialSummary.volumeTotal / 1000000).toFixed(2)}M</p>
          <p className="text-sm text-gray-400">BIF traités</p>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold flex items-center gap-2 mb-2"><Activity className="w-4 h-4" />Transactions</p>
          <p className="text-3xl font-bold text-text mb-1">{financialSummary.nombreTransactions}</p>
          <p className="text-sm text-gray-400">Opérations</p>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4" />Commissions</p>
          <p className="text-3xl font-bold text-secondary mb-1">{(financialSummary.totalCommissions / 1000).toFixed(1)}K</p>
          <p className="text-sm text-gray-400">BIF gagnés</p>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <p className="text-gray-400 text-sm font-semibold flex items-center gap-2 mb-2"><Target className="w-4 h-4" />Taux de Succès</p>
          <p className="text-3xl font-bold text-green-500 mb-1">{financialSummary.tauxSucces}%</p>
          <p className="text-sm text-gray-400">{financialSummary.transactionsEchouees} échecs</p>
        </div>
      </div>

      {/* Détails par Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20"><ArrowDownToLine className="w-5 h-5 text-secondary" /></div>
            <div><p className="text-sm text-gray-400">Dépôts</p><p className="text-xl font-bold text-text">{(financialSummary.totalDepots / 1000).toFixed(0)}K</p></div>
          </div>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20"><ArrowUpFromLine className="w-5 h-5 text-primary" /></div>
            <div><p className="text-sm text-gray-400">Retraits</p><p className="text-xl font-bold text-text">{(financialSummary.totalRetraits / 1000).toFixed(0)}K</p></div>
          </div>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20"><ArrowLeftRight className="w-5 h-5 text-green-500" /></div>
            <div><p className="text-sm text-gray-400">Transferts</p><p className="text-xl font-bold text-text">{(financialSummary.totalTransferts / 1000).toFixed(0)}K</p></div>
          </div>
        </div>
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20"><CreditCard className="w-5 h-5 text-yellow-500" /></div>
            <div><p className="text-sm text-gray-400">Paiements</p><p className="text-xl font-bold text-text">{(financialSummary.totalPaiements / 1000).toFixed(0)}K</p></div>
          </div>
        </div>
      </div>

      {/* 3. RAPPORT COMPTABLE (CLÔTURE) */}
      <div className="border border-darkGray bg-darkGray/30 rounded-lg p-6">
        <h3 className="text-lg font-luckiest text-text mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Rapport Comptable & Clôture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Solde Début</p>
            <p className="text-2xl font-bold text-text">{(cloture.soldeDebut / 1000).toFixed(0)}K BIF</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Float Reçu</p>
            <p className="text-2xl font-bold text-green-500">+{(cloture.floatRecu / 1000).toFixed(0)}K BIF</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Float Utilisé</p>
            <p className="text-2xl font-bold text-red-500">-{(cloture.floatUtilise / 1000).toFixed(0)}K BIF</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm text-primary mb-1">Solde Fin Théorique</p>
            <p className="text-2xl font-bold text-primary">{(cloture.soldeFinTheorique / 1000).toFixed(0)}K BIF</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Cash Déclaré</p>
            <p className="text-2xl font-bold text-text">{(cloture.cashDeclare / 1000).toFixed(0)}K BIF</p>
          </div>
          <div className={`rounded-lg p-4 ${cloture.ecart === 0 ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
            <p className="text-sm text-gray-400 mb-1">Écart</p>
            <p className={`text-2xl font-bold ${cloture.ecart === 0 ? 'text-green-500' : 'text-red-500'}`}>{cloture.ecart} BIF</p>
          </div>
        </div>
      </div>

      {/* 4. GRAPHIQUES ANALYTIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4">Évolution Volume par Jour</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }} formatter={(value) => `${(value / 1000).toFixed(0)}K BIF`} />
              <Bar dataKey="volume" fill="#007BFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4">Répartition par Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={repartitionTypes} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {repartitionTypes.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4">Heures les Plus Actives</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={heuresActives}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="heure" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="transactions" stroke="#F58424" strokeWidth={3} dot={{ fill: '#F58424', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4">Évolution Commissions</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }} />
              <Bar dataKey="transactions" fill="#F58424" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. DÉTAIL EXPORTABLE */}
      <div className="overflow-x-auto rounded-lg border border-darkGray">
        <div className="p-4 border-b border-darkGray flex items-center justify-between bg-card">
          <h3 className="text-lg font-luckiest text-text">Détail des Transactions</h3>
          <span className="text-sm text-gray-400">{transactions.length} transactions</span>
        </div>
        <DataTable ref={dt} value={transactions} paginator rows={5} rowsPerPageOptions={[5, 10, 25]} stripedRows rowHover className="custom-datatable" tableStyle={{ minWidth: "60rem", fontSize: "14px" }} scrollable scrollHeight="flex">
          <Column field="date" header="Date" sortable frozen className="text-text text-sm" style={{ minWidth: '110px' }} />
          <Column field="heure" header="Heure" sortable frozen className="text-text font-mono text-sm" style={{ minWidth: '80px' }} />
          <Column field="type" header="Type" body={typeBodyTemplate} sortable style={{ minWidth: '120px' }} />
          <Column field="client" header="Client" sortable className="text-text text-sm" style={{ minWidth: '150px' }} />
          <Column field="montant" header="Montant" body={montantBodyTemplate} sortable style={{ minWidth: '130px' }} />
          <Column field="commission" header="Commission" body={commissionBodyTemplate} sortable style={{ minWidth: '130px' }} />
          <Column field="reference" header="Référence" sortable className="text-gray-400 font-mono text-sm" style={{ minWidth: '120px' }} />
          <Column field="statut" header="Statut" body={statutBodyTemplate} sortable frozen alignFrozen="right" style={{ minWidth: '100px' }} />
        </DataTable>
      </div>

      {/* Dialog Rapport Officiel */}
      <Dialog header="Rapport Officiel Agent" visible={showOfficialReport} style={{ width: '600px' }} onHide={() => setShowOfficialReport(false)} className="bg-card">
        <div className="space-y-4 p-4">
          <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h4 className="text-lg font-bold text-text">Document Officiel</h4>
                <p className="text-sm text-gray-400">Rapport certifié et horodaté</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Agent:</span><span className="text-text font-semibold">Jean Dupont</span></div>
              <div className="flex justify-between"><span className="text-gray-400">ID Agent:</span><span className="text-text font-mono">AG-001</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Point de Vente:</span><span className="text-text">Bujumbura Centre</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Période:</span><span className="text-text">{selectedPeriod}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Date Génération:</span><span className="text-text">{new Date().toLocaleString('fr-FR')}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">N° Rapport:</span><span className="text-text font-mono">RPT-2026-02-12-001</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Signature:</span><span className="text-text font-mono text-xs">SHA256:a3f5...</span></div>
            </div>
          </div>
          <div className="bg-darkBlue rounded-lg p-4">
            <h5 className="text-sm font-semibold text-text mb-3">Résumé Financier</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Volume Total:</span><span className="text-text font-bold">{financialSummary.volumeTotal.toLocaleString()} BIF</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Commissions:</span><span className="text-secondary font-bold">{financialSummary.totalCommissions.toLocaleString()} BIF</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Transactions:</span><span className="text-text">{financialSummary.nombreTransactions}</span></div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button label="Fermer" onClick={() => setShowOfficialReport(false)} className="p-button-text" />
            <Button label="Télécharger PDF" icon={<Download className="w-4 h-4 mr-2" />} onClick={exportPdf} className="bg-primary text-white" />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Rapports;

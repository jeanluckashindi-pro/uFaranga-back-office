import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Search, Download, Calendar, ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, CreditCard, TrendingUp, Activity, Clock,
  AlertTriangle, CheckCircle, XCircle, Filter, RefreshCw,
  Shield, Target, BarChart3, Eye, FileText, AlertCircle
} from 'lucide-react';

function Transactions() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState({ label: "Aujourd'hui", value: 'today' });
  const [sortField, setSortField] = useState('time');
  const [sortOrder, setSortOrder] = useState(-1);
  const dt = useRef(null);
  const menuRef = useRef(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Export functions
  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportPdf = () => {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
        const doc = new jsPDF.default();
        
        const exportColumns = [
          { title: 'Heure', dataKey: 'time' },
          { title: 'Type', dataKey: 'type' },
          { title: 'Client', dataKey: 'clientName' },
          { title: 'Référence', dataKey: 'ref' },
          { title: 'Montant', dataKey: 'montant' },
          { title: 'Commission', dataKey: 'commission' },
          { title: 'Canal', dataKey: 'canal' },
          { title: 'Statut', dataKey: 'statut' }
        ];

        doc.autoTable({
          columns: exportColumns,
          body: filteredTransactions,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [0, 123, 255] }
        });

        doc.save('transactions.pdf');
      });
    });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(filteredTransactions);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'transactions');
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

  const exportMenuItems = [
    {
      label: 'Excel',
      icon: 'pi pi-file-excel',
      command: () => exportExcel()
    },
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: () => exportPdf()
    },
    {
      label: 'CSV',
      icon: 'pi pi-file',
      command: () => exportCSV()
    }
  ];

  const dateOptions = [
    { label: "Aujourd'hui", value: 'today' },
    { label: 'Hier', value: 'yesterday' },
    { label: '7 derniers jours', value: 'week' },
    { label: '30 derniers jours', value: 'month' }
  ];

  // Mock data - Transactions avec données avancées
  const [transactions] = useState([
    { id: 'TXN20260212001', type: 'depot', client: '+257 79 123 456', clientName: 'Marie Kalala', montant: 50000, commission: 500, frais: 100, statut: 'success', time: '14:35:22', ref: 'DEP-2026-001', canal: 'Mobile', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212002', type: 'retrait', client: '+257 79 234 567', clientName: 'Jean Mbala', montant: 30000, commission: 450, frais: 150, statut: 'success', time: '14:28:15', ref: 'RET-2026-002', canal: 'Agent', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212003', type: 'transfert', client: '+257 79 345 678', clientName: 'Sophie Tshala', montant: 25000, commission: 250, frais: 50, statut: 'success', time: '14:15:08', ref: 'TRF-2026-003', canal: 'Mobile', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212004', type: 'depot', client: '+257 79 456 789', clientName: 'Paul Kabongo', montant: 100000, commission: 1000, frais: 200, statut: 'success', time: '13:52:41', ref: 'DEP-2026-004', canal: 'Agent', riskScore: 'medium', errorCode: null },
    { id: 'TXN20260212005', type: 'paiement', client: '+257 79 567 890', clientName: 'Alice Mbuyi', montant: 15000, commission: 200, frais: 75, statut: 'pending', time: '13:45:33', ref: 'PAY-2026-005', canal: 'API', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212006', type: 'retrait', client: '+257 79 678 901', clientName: 'David Kasongo', montant: 80000, commission: 800, frais: 160, statut: 'failed', time: '13:30:12', ref: 'RET-2026-006', canal: 'Agent', riskScore: 'high', errorCode: 'ERR_101' },
    { id: 'TXN20260212007', type: 'depot', client: '+257 79 789 012', clientName: 'Grace Nkulu', montant: 45000, commission: 450, frais: 90, statut: 'success', time: '13:12:55', ref: 'DEP-2026-007', canal: 'Mobile', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212008', type: 'transfert', client: '+257 79 890 123', clientName: 'Eric Mwamba', montant: 60000, commission: 600, frais: 120, statut: 'success', time: '12:58:20', ref: 'TRF-2026-008', canal: 'Mobile', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212009', type: 'depot', client: '+257 79 901 234', clientName: 'Beatrice Ilunga', montant: 35000, commission: 350, frais: 70, statut: 'success', time: '12:45:10', ref: 'DEP-2026-009', canal: 'Agent', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212010', type: 'paiement', client: '+257 79 012 345', clientName: 'Patrick Mulamba', montant: 22000, commission: 280, frais: 110, statut: 'success', time: '12:30:05', ref: 'PAY-2026-010', canal: 'API', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212011', type: 'retrait', client: '+257 79 123 456', clientName: 'Christine Kabila', montant: 55000, commission: 550, frais: 110, statut: 'success', time: '12:15:33', ref: 'RET-2026-011', canal: 'Agent', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212012', type: 'transfert', client: '+257 79 234 567', clientName: 'Joseph Tshisekedi', montant: 40000, commission: 400, frais: 80, statut: 'pending', time: '11:58:47', ref: 'TRF-2026-012', canal: 'Mobile', riskScore: 'medium', errorCode: null },
    { id: 'TXN20260212013', type: 'depot', client: '+257 79 345 678', clientName: 'Francine Mukendi', montant: 75000, commission: 750, frais: 150, statut: 'success', time: '11:42:18', ref: 'DEP-2026-013', canal: 'Agent', riskScore: 'low', errorCode: null },
    { id: 'TXN20260212014', type: 'retrait', client: '+257 79 456 789', clientName: 'Robert Ngoy', montant: 42000, commission: 420, frais: 84, statut: 'failed', time: '11:28:55', ref: 'RET-2026-014', canal: 'Mobile', riskScore: 'high', errorCode: 'ERR_301' },
    { id: 'TXN20260212015', type: 'paiement', client: '+257 79 567 890', clientName: 'Sylvie Kabamba', montant: 18000, commission: 230, frais: 90, statut: 'success', time: '11:15:22', ref: 'PAY-2026-015', canal: 'API', riskScore: 'low', errorCode: null }
  ]);

  // KPIs calculés
  const successTransactions = transactions.filter(t => t.statut === 'success');
  const failedTransactions = transactions.filter(t => t.statut === 'failed');
  const pendingTransactions = transactions.filter(t => t.statut === 'pending');
  
  const totalVolume = transactions.reduce((sum, tx) => sum + tx.montant, 0);
  const totalCommission = transactions.reduce((sum, tx) => sum + tx.commission, 0);
  const successRate = ((successTransactions.length / transactions.length) * 100).toFixed(1);
  const avgTransactionAmount = (totalVolume / transactions.length).toFixed(0);
  const avgProcessingTime = 45; // secondes (mock)

  // Comparaisons (mock data)
  const vsYesterday = 12.5;
  const vs7DaysAvg = 8.3;

  // Données pour graphiques
  const volumeByHour = [
    { heure: '08h', volume: 85000, count: 2 },
    { heure: '09h', volume: 210000, count: 5 },
    { heure: '10h', volume: 340000, count: 8 },
    { heure: '11h', volume: 280000, count: 6 },
    { heure: '12h', volume: 350000, count: 7 },
    { heure: '13h', volume: 420000, count: 9 },
    { heure: '14h', volume: 105000, count: 3 }
  ];

  const transactionsByType = [
    { name: 'Dépôts', value: 6, color: '#F58424', percentage: 40 },
    { name: 'Retraits', value: 4, color: '#007BFF', percentage: 27 },
    { name: 'Transferts', value: 3, color: '#6b7280', percentage: 20 },
    { name: 'Paiements', value: 2, color: '#9ca3af', percentage: 13 }
  ];

  const evolutionLast7Days = [
    { jour: 'Lun', transactions: 42, volume: 1850000 },
    { jour: 'Mar', transactions: 38, volume: 1620000 },
    { jour: 'Mer', transactions: 45, volume: 1980000 },
    { jour: 'Jeu', transactions: 41, volume: 1750000 },
    { jour: 'Ven', transactions: 48, volume: 2100000 },
    { jour: 'Sam', transactions: 52, volume: 2350000 },
    { jour: 'Dim', transactions: 15, volume: 650000 }
  ];

  // Transactions suspectes
  const suspiciousTransactions = transactions.filter(t => t.riskScore === 'high' || t.riskScore === 'medium');

  // Codes d'erreur
  const errorCodes = {
    'ERR_101': 'Solde insuffisant',
    'ERR_203': 'Timeout réseau',
    'ERR_301': 'PIN incorrect',
    'ERR_404': 'Compte introuvable',
    'ERR_500': 'Erreur serveur'
  };

  // Fonctions utilitaires
  const getTypeInfo = (type) => {
    const types = {
      depot: { icon: ArrowDownToLine, label: 'Dépôt', severity: 'success', color: '#F58424' },
      retrait: { icon: ArrowUpFromLine, label: 'Retrait', severity: 'info', color: '#007BFF' },
      transfert: { icon: ArrowLeftRight, label: 'Transfert', severity: 'warning', color: '#6b7280' },
      paiement: { icon: CreditCard, label: 'Paiement', severity: 'help', color: '#9ca3af' }
    };
    return types[type] || { icon: CreditCard, label: 'Autre', severity: 'secondary', color: '#9ca3af' };
  };

  const getRiskBadge = (riskScore) => {
    if (riskScore === 'low') return (
      <div className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3 text-secondary" />
        <span className="text-xs text-secondary">Normal</span>
      </div>
    );
    if (riskScore === 'medium') return (
      <div className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3 text-yellow-500" />
        <span className="text-xs text-yellow-500">Moyen</span>
      </div>
    );
    return (
      <div className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-red-500" />
        <span className="text-xs text-red-500">Élevé</span>
      </div>
    );
  };

  const maskPhone = (phone) => {
    // Masquer partie du numéro: +257 79 ***456
    return phone.replace(/(\d{2})(\d{3})(\d{3})/, '$1 ** ***$3');
  };

  // Filtrage et tri
  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filter === 'all' || tx.type === filter;
    const matchesSearch = tx.client.includes(searchTerm) || 
                         tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.ref.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Templates pour DataTable
  const typeBodyTemplate = (rowData) => {
    const typeInfo = getTypeInfo(rowData.type);
    const IconComponent = typeInfo.icon;
    return (
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${typeInfo.color}20` }}>
          <IconComponent className="w-4 h-4" style={{ color: typeInfo.color }} />
        </div>
        <span className="text-text font-semibold">{typeInfo.label}</span>
      </div>
    );
  };

  const clientBodyTemplate = (rowData) => {
    return (
      <div>
        <div className="font-semibold text-text whitespace-nowrap">{rowData.clientName}</div>
        <div className="text-sm text-gray-400 font-mono whitespace-nowrap">{maskPhone(rowData.client)}</div>
      </div>
    );
  };

  const montantBodyTemplate = (rowData) => {
    return (
      <div className="text-right">
        <div className="font-bold text-text">{rowData.montant.toLocaleString()} BIF</div>
        <div className="text-xs text-gray-400">Frais: {rowData.frais} BIF</div>
      </div>
    );
  };

  const commissionBodyTemplate = (rowData) => {
    return (
      <div className="text-right">
        <div className="font-semibold text-secondary">+{rowData.commission.toLocaleString()} BIF</div>
      </div>
    );
  };

  const statutBodyTemplate = (rowData) => {
    if (rowData.statut === 'success') {
      return (
        <div className="flex items-center gap-2">
          <Tag value="Succès" severity="success" />
        </div>
      );
    }
    if (rowData.statut === 'pending') {
      return (
        <div className="flex flex-col gap-1">
          <Tag value="En cours" severity="warning" />
          <button className="text-xs text-primary hover:underline">Vérifier</button>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <Tag value="Échec" severity="danger" />
        {rowData.errorCode && (
          <span className="text-xs text-red-500 font-mono">{rowData.errorCode}</span>
        )}
      </div>
    );
  };

  const riskBodyTemplate = (rowData) => {
    return getRiskBadge(rowData.riskScore);
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-darkGray rounded-lg transition-colors" title="Voir détails">
          <Eye className="w-4 h-4 text-primary" />
        </button>
        <button className="p-2 hover:bg-darkGray rounded-lg transition-colors" title="Télécharger reçu">
          <FileText className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">Centre d'Analyse Transactionnel</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            {transactions.length} transactions aujourd'hui • {(totalVolume / 1000000).toFixed(2)}M BIF de volume
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Rafraîchir">
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-text" />
          </button>
          <Menu model={exportMenuItems} popup ref={menuRef} />
          <Button 
            label="Exporter" 
            icon={<Download className="w-4 h-4 mr-2" />}
            onClick={(e) => menuRef.current.toggle(e)}
            className="bg-text text-background hover:bg-lightGray px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
          />
        </div>
      </div>

      {/* 1. KPI CARDS AVANCÉES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Activité Aujourd'hui */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activité Aujourd'hui
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{transactions.length}</p>
          <p className="text-sm text-gray-400 mb-2">Volume: {(totalVolume / 1000000).toFixed(2)}M BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{vsYesterday}% vs hier</span>
          </div>
        </div>

        {/* Commission Générée */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Commission Générée
            </p>
          </div>
          <p className="text-3xl font-bold text-secondary mb-1">{(totalCommission / 1000).toFixed(1)}K BIF</p>
          <p className="text-sm text-gray-400 mb-2">Moy/trans: {(totalCommission / transactions.length).toFixed(0)} BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{vs7DaysAvg}% vs 7j</span>
          </div>
        </div>

        {/* Taux de Succès */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Taux de Succès
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{successRate}%</p>
          <p className="text-sm text-gray-400 mb-2">
            {successTransactions.length} succès / {failedTransactions.length} échecs
          </p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Excellent</span>
          </div>
        </div>

        {/* Temps Moyen */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Temps Moyen
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{avgProcessingTime}s</p>
          <p className="text-sm text-gray-400 mb-2">Traitement transaction</p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Rapide</span>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS VISUELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 w-full">
        {/* Graphique 1: Volume par heure */}
        <div className="border border-darkGray bg-card rounded-lg p-4 md:p-6 min-w-0 overflow-hidden">
          <h3 className="text-base md:text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
            Volume par Heure
          </h3>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={volumeByHour}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="heure" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                  formatter={(value) => `${(value / 1000).toFixed(0)}K BIF`}
                />
                <Bar dataKey="volume" fill="#007BFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-xs md:text-sm text-gray-400">
            Pic: 13h avec 420K BIF
          </div>
        </div>

        {/* Graphique 2: Évolution 7 jours */}
        <div className="border border-darkGray bg-card rounded-lg p-4 md:p-6 min-w-0 overflow-hidden">
          <h3 className="text-base md:text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
            Évolution 7 Jours
          </h3>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={evolutionLast7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="jour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#F58424" 
                  strokeWidth={3}
                  dot={{ fill: '#F58424', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-xs md:text-sm text-gray-400">
            Tendance: +15% cette semaine
          </div>
        </div>
      </div>

      {/* 4. MODULE DÉTECTION ANOMALIES */}
      {suspiciousTransactions.length > 0 && (
        <div className="border border-yellow-500/30 bg-yellow-500/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-anton uppercase text-text flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              Détection Anomalies
            </h3>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold">
              {suspiciousTransactions.length} transaction(s) nécessitent attention
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suspiciousTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="bg-darkBlue rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text font-semibold">{tx.clientName}</span>
                  {getRiskBadge(tx.riskScore)}
                </div>
                <div className="text-sm text-gray-400 mb-1">{tx.ref}</div>
                <div className="text-lg font-bold text-text">{tx.montant.toLocaleString()} BIF</div>
                <div className="text-xs text-gray-400 mt-2">
                  {tx.riskScore === 'high' ? 'Montant inhabituel' : 'Vérification recommandée'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ANALYSE PERFORMANCE AGENT */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h3 className="text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Analyse Performance Agent
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <p className="text-2xl font-bold text-text">{avgTransactionAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Volume Moyen/Trans</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <p className="text-2xl font-bold text-text">13h00</p>
            <p className="text-sm text-gray-400 mt-1">Heure Plus Productive</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <p className="text-2xl font-bold text-text">Dépôts</p>
            <p className="text-sm text-gray-400 mt-1">Type Plus Utilisé</p>
          </div>
          <div className="text-center p-4 bg-darkBlue rounded-lg">
            <p className="text-2xl font-bold text-text">{(totalCommission / transactions.length).toFixed(0)}</p>
            <p className="text-sm text-gray-400 mt-1">Commission Moy/Trans</p>
          </div>
        </div>
      </div>

      {/* Filtres Avancés */}
      <div className="border border-darkGray bg-card rounded-lg p-4 w-full">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, téléphone ou référence..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter('depot')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === 'depot' ? 'bg-secondary text-white' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'
              }`}
            >
              <ArrowDownToLine className="w-4 h-4" />
              Dépôts
            </button>
            <button
              onClick={() => setFilter('retrait')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === 'retrait' ? 'bg-primary text-white' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'
              }`}
            >
              <ArrowUpFromLine className="w-4 h-4" />
              Retraits
            </button>
            <button
              onClick={() => setFilter('transfert')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === 'transfert' ? 'bg-text text-background' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Transferts
            </button>
            <button
              onClick={() => setFilter('paiement')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
                filter === 'paiement' ? 'bg-text text-background' : 'bg-darkBlue text-gray-400 hover:bg-darkGray'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Paiements
            </button>
          </div>

          {/* Date Filter */}
          <select
            value={selectedDate.value}
            onChange={(e) => setSelectedDate(dateOptions.find(opt => opt.value === e.target.value))}
            className="px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:border-primary focus:outline-none whitespace-nowrap flex-shrink-0"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. TABLEAU INTELLIGENT DES TRANSACTIONS */}
      <div className="overflow-x-auto rounded-lg border border-darkGray">
        <div className="p-4 border-b border-darkGray flex items-center justify-between bg-card">
          <h3 className="text-base md:text-lg font-luckiest text-text flex items-center gap-2">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />
            Tableau Intelligent des Transactions
          </h3>
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
            <span>{filteredTransactions.length} résultats</span>
          </div>
        </div>
        
        <DataTable
          ref={dt}
          value={filteredTransactions}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          stripedRows
          rowHover
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={(e) => {
            setSortField(e.sortField);
            setSortOrder(e.sortOrder);
          }}
          className="custom-datatable"
          tableStyle={{ minWidth: "80rem", fontSize: "14px" }}
          scrollable
          scrollHeight="flex"
        >
          <Column 
            field="time" 
            header="Heure" 
            sortable 
            frozen
            className="text-text font-mono text-sm"
            style={{ minWidth: '100px' }}
          />
          <Column 
            field="type" 
            header="Type" 
            body={typeBodyTemplate} 
            sortable 
            frozen
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="clientName" 
            header="Client" 
            body={clientBodyTemplate} 
            sortable 
            frozen
            style={{ minWidth: '200px' }}
          />
          <Column 
            field="ref" 
            header="Référence" 
            sortable 
            className="text-gray-400 font-mono text-sm"
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="montant" 
            header="Montant" 
            body={montantBodyTemplate} 
            sortable 
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="commission" 
            header="Commission" 
            body={commissionBodyTemplate} 
            sortable 
            style={{ minWidth: '120px' }}
          />
          <Column 
            field="canal" 
            header="Canal" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '90px' }}
          />
          <Column 
            field="riskScore" 
            header="Risque" 
            body={riskBodyTemplate} 
            sortable 
            frozen
            alignFrozen="right"
            style={{ minWidth: '100px' }}
          />
          <Column 
            field="statut" 
            header="Statut" 
            body={statutBodyTemplate} 
            sortable 
            frozen
            alignFrozen="right"
            style={{ minWidth: '120px' }}
          />
          <Column 
            header="Actions" 
            body={actionsBodyTemplate} 
            frozen
            alignFrozen="right"
            style={{ minWidth: '100px' }}
          />
        </DataTable>
      </div>

      {/* 6. GESTION AVANCÉE DES INCIDENTS */}
      {failedTransactions.length > 0 && (
        <div className="border border-darkGray bg-darkGray/30 rounded-lg p-4 md:p-6 w-full">
          <h3 className="text-base md:text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
            Gestion des Incidents ({failedTransactions.length})
          </h3>
          <div className="space-y-3">
            {failedTransactions.map((tx) => (
              <div key={tx.id} className="bg-card rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-text font-semibold">{tx.clientName}</span>
                    <span className="text-gray-400 text-sm font-mono">{tx.ref}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm flex-wrap">
                    <span className="text-text">{tx.montant.toLocaleString()} BIF</span>
                    <span className="text-gray-400">{tx.time}</span>
                    {tx.errorCode && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded font-mono text-xs">
                          {tx.errorCode}
                        </span>
                        <span className="text-red-400 text-xs">
                          {errorCodes[tx.errorCode]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="px-3 md:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-xs md:text-sm font-semibold whitespace-nowrap">
                    Réessayer
                  </button>
                  <button className="px-3 md:px-4 py-2 bg-darkGray text-text rounded-lg hover:bg-darkGray/80 transition-colors text-xs md:text-sm font-semibold whitespace-nowrap">
                    Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Transactions;

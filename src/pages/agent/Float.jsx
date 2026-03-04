import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import {
  Wallet, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Clock, RefreshCw, Plus, ArrowDownToLine, ArrowUpFromLine,
  Activity, Target, Shield, BarChart3, Calendar, FileText,
  AlertCircle, DollarSign, Zap, Eye
} from 'lucide-react';

function Float() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestAmount, setRequestAmount] = useState(null);
  const [requestMode, setRequestMode] = useState(null);
  const [requestMotif, setRequestMotif] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('7days');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // DONNÉES MOCK - Float Overview
  const floatData = {
    disponible: 2500000, // BIF
    utiliseAujourdhui: 850000,
    recuAujourdhui: 500000,
    volumeMoyenJournalier: 1200000,
    seuilMinimum: 1000000,
    seuilCritique: 800000
  };

  const ratioLiquidite = ((floatData.disponible / floatData.volumeMoyenJournalier) * 100).toFixed(0);
  const joursRestants = (floatData.disponible / floatData.volumeMoyenJournalier).toFixed(1);

  // Niveau de risque
  const getRiskLevel = () => {
    const ratio = (floatData.disponible / floatData.volumeMoyenJournalier) * 100;
    if (ratio >= 150) return { level: 'normal', color: 'success', label: 'Normal', icon: CheckCircle, bg: 'bg-green-500/10', border: 'border-green-500/30' };
    if (ratio >= 100) return { level: 'attention', color: 'warning', label: 'Attention', icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' };
    return { level: 'critique', color: 'danger', label: 'Critique', icon: AlertCircle, bg: 'bg-red-500/10', border: 'border-red-500/30' };
  };

  const riskLevel = getRiskLevel();
  const RiskIcon = riskLevel.icon;

  // Historique mouvements float (différent des transactions clients)
  const [floatMovements] = useState([
    { id: 'FM001', date: '2026-02-12', time: '14:30', type: 'credit', label: 'Réapprovisionnement', montant: 500000, soldeApres: 2500000, reference: 'REF-2026-001', statut: 'completed', initiateur: 'Admin Système' },
    { id: 'FM002', date: '2026-02-12', time: '13:45', type: 'debit', label: 'Dépôt client', montant: 50000, soldeApres: 2000000, reference: 'TXN20260212001', statut: 'completed', initiateur: 'Agent' },
    { id: 'FM003', date: '2026-02-12', time: '12:30', type: 'debit', label: 'Dépôt client', montant: 100000, soldeApres: 2050000, reference: 'TXN20260212004', statut: 'completed', initiateur: 'Agent' },
    { id: 'FM004', date: '2026-02-12', time: '11:20', type: 'credit', label: 'Commission créditée', montant: 5000, soldeApres: 2150000, reference: 'COM-2026-012', statut: 'completed', initiateur: 'Système' },
    { id: 'FM005', date: '2026-02-11', time: '16:45', type: 'debit', label: 'Dépôt client', montant: 75000, soldeApres: 2145000, reference: 'TXN20260211089', statut: 'completed', initiateur: 'Agent' },
    { id: 'FM006', date: '2026-02-11', time: '09:15', type: 'credit', label: 'Réapprovisionnement', montant: 1000000, soldeApres: 2220000, reference: 'REF-2026-002', statut: 'completed', initiateur: 'Admin Système' },
    { id: 'FM007', date: '2026-02-10', time: '15:30', type: 'adjustment', label: 'Ajustement admin', montant: -10000, soldeApres: 1220000, reference: 'ADJ-2026-001', statut: 'completed', initiateur: 'Admin Finance' },
    { id: 'FM008', date: '2026-02-10', time: '10:00', type: 'credit', label: 'Correction', montant: 20000, soldeApres: 1230000, reference: 'COR-2026-001', statut: 'completed', initiateur: 'Admin Technique' }
  ]);

  // Demandes de réapprovisionnement
  const [floatRequests] = useState([
    { id: 'REQ001', date: '2026-02-12', montant: 500000, mode: 'Banque', motif: 'Réapprovisionnement régulier', statut: 'validated', validePar: 'Admin Finance', dateValidation: '2026-02-12 14:25' },
    { id: 'REQ002', date: '2026-02-11', montant: 1000000, mode: 'Mobile Money', motif: 'Float critique', statut: 'credited', validePar: 'Admin Système', dateValidation: '2026-02-11 09:10' },
    { id: 'REQ003', date: '2026-02-10', montant: 300000, mode: 'Interne', motif: 'Anticipation weekend', statut: 'rejected', validePar: 'Admin Finance', dateValidation: '2026-02-10 16:00', motifRejet: 'Montant trop élevé' }
  ]);

  // Évolution float 7 derniers jours
  const floatEvolution = [
    { jour: 'Lun 06', solde: 1850000, entrees: 500000, sorties: 650000 },
    { jour: 'Mar 07', solde: 1620000, entrees: 300000, sorties: 530000 },
    { jour: 'Mer 08', solde: 1450000, entrees: 200000, sorties: 370000 },
    { jour: 'Jeu 09', solde: 1230000, entrees: 150000, sorties: 370000 },
    { jour: 'Ven 10', solde: 1220000, entrees: 1020000, sorties: 1030000 },
    { jour: 'Sam 11', solde: 2220000, entrees: 1000000, sorties: 0 },
    { jour: 'Dim 12', solde: 2500000, entrees: 500000, sorties: 220000 }
  ];

  // Consommation moyenne
  const consommationMoyenne = floatMovements
    .filter(m => m.type === 'debit')
    .reduce((sum, m) => sum + m.montant, 0) / 7;

  // Alertes intelligentes
  const alerts = [
    { id: 1, type: 'warning', message: 'Float inférieur au seuil recommandé', time: '2h ago', priority: 'high' },
    { id: 2, type: 'info', message: 'Demande de réapprovisionnement validée', time: '5h ago', priority: 'medium' }
  ];

  // Templates DataTable
  const typeBodyTemplate = (rowData) => {
    const types = {
      credit: { icon: ArrowDownToLine, label: 'Crédit', color: '#10b981', bg: '#10b98120' },
      debit: { icon: ArrowUpFromLine, label: 'Débit', color: '#ef4444', bg: '#ef444420' },
      adjustment: { icon: RefreshCw, label: 'Ajustement', color: '#f59e0b', bg: '#f59e0b20' }
    };
    const type = types[rowData.type] || types.credit;
    const Icon = type.icon;
    return (
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: type.bg }}>
          <Icon className="w-4 h-4" style={{ color: type.color }} />
        </div>
        <span className="text-text font-semibold">{type.label}</span>
      </div>
    );
  };

  const montantBodyTemplate = (rowData) => {
    const isCredit = rowData.type === 'credit';
    return (
      <div className="text-right">
        <div className={`font-bold text-lg ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
          {isCredit ? '+' : '-'}{Math.abs(rowData.montant).toLocaleString()} BIF
        </div>
      </div>
    );
  };

  const soldeBodyTemplate = (rowData) => {
    return (
      <div className="text-right">
        <div className="font-bold text-text">{rowData.soldeApres.toLocaleString()} BIF</div>
      </div>
    );
  };

  const statutBodyTemplate = (rowData) => {
    return <Tag value="Complété" severity="success" />;
  };

  const requestStatutBodyTemplate = (rowData) => {
    const statuts = {
      pending: { label: 'En attente', severity: 'warning' },
      validated: { label: 'Validé', severity: 'info' },
      credited: { label: 'Crédité', severity: 'success' },
      rejected: { label: 'Rejeté', severity: 'danger' }
    };
    const statut = statuts[rowData.statut];
    return <Tag value={statut.label} severity={statut.severity} />;
  };

  const handleSubmitRequest = () => {
    if (!requestAmount || !requestMode || !requestMotif) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    // Logique d'envoi de la demande
    console.log('Demande envoyée:', { requestAmount, requestMode, requestMotif });
    setShowRequestDialog(false);
    setRequestAmount(null);
    setRequestMode(null);
    setRequestMotif('');
  };

  const paymentModes = [
    { label: 'Banque', value: 'bank' },
    { label: 'Mobile Money', value: 'mobile' },
    { label: 'Transfert Interne', value: 'internal' }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">Gestion de Liquidité Float</h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Centre de contrôle et surveillance du float agent
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Rafraîchir">
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-text" />
          </button>
          <Button 
            label="Demander Réappro" 
            icon={<Plus className="w-4 h-4 mr-2" />}
            onClick={() => setShowRequestDialog(true)}
            className="bg-secondary text-white hover:bg-secondary/80 px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
          />
        </div>
      </div>

      {/* 1. FLOAT OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Float Disponible */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Float Disponible
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{(floatData.disponible / 1000000).toFixed(2)}M</p>
          <p className="text-sm text-gray-400 mb-2">BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Solde actuel</span>
          </div>
        </div>

        {/* Float Utilisé */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Float Utilisé Aujourd'hui
            </p>
          </div>
          <p className="text-3xl font-bold text-red-500 mb-1">{(floatData.utiliseAujourdhui / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-400 mb-2">BIF sortis</p>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Activity className="w-4 h-4" />
            <span>Dépôts clients</span>
          </div>
        </div>

        {/* Float Reçu */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4" />
              Float Reçu Aujourd'hui
            </p>
          </div>
          <p className="text-3xl font-bold text-green-500 mb-1">{(floatData.recuAujourdhui / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-400 mb-2">BIF entrés</p>
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Réappro validé</span>
          </div>
        </div>

        {/* Ratio Liquidité */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ratio Liquidité
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{ratioLiquidite}%</p>
          <p className="text-sm text-gray-400 mb-2">vs volume moyen</p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <Zap className="w-4 h-4" />
            <span>{joursRestants} jours restants</span>
          </div>
        </div>
      </div>

      {/* 2. INDICATEUR NIVEAU RISQUE */}
      <div className="border border-darkGray bg-darkGray/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-anton uppercase text-text flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Niveau de Risque Float
          </h3>
          <div className="flex items-center gap-2">
            <RiskIcon className="w-5 h-5" style={{ color: riskLevel.color === 'success' ? '#10b981' : riskLevel.color === 'warning' ? '#f59e0b' : '#ef4444' }} />
            <Tag value={riskLevel.label} severity={riskLevel.color} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Float Disponible</span>
              <span className="text-text font-semibold">{floatData.disponible.toLocaleString()} BIF</span>
            </div>
            <ProgressBar 
              value={ratioLiquidite} 
              showValue={false}
              style={{ height: '12px' }}
              color={riskLevel.color === 'success' ? '#10b981' : riskLevel.color === 'warning' ? '#f59e0b' : '#ef4444'}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-darkGray">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Seuil Critique</div>
              <div className="text-sm font-bold text-red-500">{(floatData.seuilCritique / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Seuil Minimum</div>
              <div className="text-sm font-bold text-yellow-500">{(floatData.seuilMinimum / 1000).toFixed(0)}K</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Volume Moyen</div>
              <div className="text-sm font-bold text-text">{(floatData.volumeMoyenJournalier / 1000).toFixed(0)}K</div>
            </div>
          </div>

          {riskLevel.level !== 'normal' && (
            <div className="mt-4 p-3 bg-darkBlue rounded-lg">
              <p className="text-sm text-yellow-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {riskLevel.level === 'critique' 
                  ? 'Action immédiate requise : Demandez un réapprovisionnement urgent'
                  : 'Recommandation : Planifiez un réapprovisionnement prochainement'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. ANALYTICS AVANCÉES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique Évolution Float */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Évolution Float (7 jours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={floatEvolution}>
              <defs>
                <linearGradient id="colorSolde" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                formatter={(value) => `${(value / 1000).toFixed(0)}K BIF`}
              />
              <Area 
                type="monotone" 
                dataKey="solde" 
                stroke="#007BFF" 
                fillOpacity={1} 
                fill="url(#colorSolde)" 
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 text-sm text-gray-400">
            Tendance: Stabilisation après réapprovisionnement
          </div>
        </div>

        {/* Analytics Détaillées */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-lg font-luckiest text-text mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Analytics Liquidité
          </h3>
          
          <div className="space-y-4">
            {/* Consommation Moyenne */}
            <div className="p-4 bg-darkBlue rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Consommation Moyenne Journalière</span>
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-text">{(consommationMoyenne / 1000).toFixed(0)}K BIF</div>
              <div className="text-xs text-gray-400 mt-1">Basé sur 7 derniers jours</div>
            </div>

            {/* Projection Rupture */}
            <div className="p-4 bg-darkBlue rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Projection Rupture</span>
                <Clock className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-text">{joursRestants} jours</div>
              <div className="text-xs text-gray-400 mt-1">Float suffisant pour {joursRestants} jours</div>
            </div>

            {/* Recommandation */}
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-secondary text-sm font-semibold">Recommandation</span>
              </div>
              <div className="text-sm text-text">
                Montant optimal de réapprovisionnement: <span className="font-bold text-secondary">{((floatData.volumeMoyenJournalier * 3) / 1000).toFixed(0)}K BIF</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Pour couvrir 3 jours d'activité</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. HISTORIQUE MOUVEMENTS FLOAT */}
      <div className="overflow-x-auto rounded-lg border border-darkGray">
        <div className="p-4 border-b border-darkGray flex items-center justify-between bg-card">
          <h3 className="text-lg font-luckiest text-text flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historique Mouvements Float
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{floatMovements.length} mouvements</span>
          </div>
        </div>
        
        <DataTable
          value={floatMovements}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          stripedRows
          rowHover
          className="custom-datatable"
          tableStyle={{ minWidth: "70rem", fontSize: "14px" }}
          scrollable
          scrollHeight="flex"
        >
          <Column 
            field="date" 
            header="Date" 
            sortable 
            frozen
            className="text-text text-sm"
            style={{ minWidth: '110px' }}
          />
          <Column 
            field="time" 
            header="Heure" 
            sortable 
            frozen
            className="text-text font-mono text-sm"
            style={{ minWidth: '80px' }}
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
            field="label" 
            header="Libellé" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '200px' }}
          />
          <Column 
            field="montant" 
            header="Montant" 
            body={montantBodyTemplate} 
            sortable 
            style={{ minWidth: '150px' }}
          />
          <Column 
            field="soldeApres" 
            header="Solde Après" 
            body={soldeBodyTemplate} 
            sortable 
            style={{ minWidth: '150px' }}
          />
          <Column 
            field="reference" 
            header="Référence" 
            sortable 
            className="text-gray-400 font-mono text-sm"
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="initiateur" 
            header="Initiateur" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="statut" 
            header="Statut" 
            body={statutBodyTemplate} 
            sortable 
            frozen
            alignFrozen="right"
            style={{ minWidth: '100px' }}
          />
        </DataTable>
      </div>

      {/* 5. DEMANDES DE RÉAPPROVISIONNEMENT */}
      <div className="overflow-x-auto rounded-lg border border-darkGray">
        <div className="p-4 border-b border-darkGray flex items-center justify-between bg-card">
          <h3 className="text-lg font-luckiest text-text flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Historique Demandes Réapprovisionnement
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{floatRequests.length} demandes</span>
          </div>
        </div>
        
        <DataTable
          value={floatRequests}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          stripedRows
          rowHover
          className="custom-datatable"
          tableStyle={{ minWidth: "60rem", fontSize: "14px" }}
        >
          <Column 
            field="date" 
            header="Date Demande" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '120px' }}
          />
          <Column 
            field="montant" 
            header="Montant" 
            sortable 
            body={(rowData) => (
              <div className="font-bold text-text">{rowData.montant.toLocaleString()} BIF</div>
            )}
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="mode" 
            header="Mode Paiement" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="motif" 
            header="Motif" 
            sortable 
            className="text-gray-400 text-sm"
            style={{ minWidth: '200px' }}
          />
          <Column 
            field="statut" 
            header="Statut" 
            body={requestStatutBodyTemplate} 
            sortable 
            style={{ minWidth: '120px' }}
          />
          <Column 
            field="validePar" 
            header="Validé Par" 
            sortable 
            className="text-text text-sm"
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="dateValidation" 
            header="Date Validation" 
            sortable 
            className="text-gray-400 text-sm font-mono"
            style={{ minWidth: '160px' }}
          />
        </DataTable>
      </div>

      {/* 6. ALERTES INTELLIGENTES */}
      {alerts.length > 0 && (
        <div className="border border-darkGray bg-darkGray/30 rounded-lg p-6">
          <h3 className="text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Alertes Système ({alerts.length})
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="bg-card rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                  )}
                  <div>
                    <div className="text-text font-semibold">{alert.message}</div>
                    <div className="text-sm text-gray-400">{alert.time}</div>
                  </div>
                </div>
                <Tag 
                  value={alert.priority === 'high' ? 'Priorité Haute' : 'Info'} 
                  severity={alert.priority === 'high' ? 'danger' : 'info'} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog Demande Réapprovisionnement */}
      <Dialog
        header="Demande de Réapprovisionnement"
        visible={showRequestDialog}
        style={{ width: '500px' }}
        onHide={() => setShowRequestDialog(false)}
        className="bg-card"
      >
        <div className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Montant Demandé (BIF)</label>
            <InputNumber
              value={requestAmount}
              onValueChange={(e) => setRequestAmount(e.value)}
              mode="decimal"
              locale="fr-FR"
              minFractionDigits={0}
              className="w-full"
              placeholder="Ex: 1000000"
            />
            <div className="text-xs text-gray-400 mt-1">
              Recommandé: {((floatData.volumeMoyenJournalier * 3) / 1000).toFixed(0)}K BIF
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Mode de Paiement</label>
            <Dropdown
              value={requestMode}
              onChange={(e) => setRequestMode(e.value)}
              options={paymentModes}
              placeholder="Sélectionner un mode"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Motif</label>
            <InputTextarea
              value={requestMotif}
              onChange={(e) => setRequestMotif(e.target.value)}
              rows={3}
              className="w-full"
              placeholder="Expliquez la raison de cette demande..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              label="Annuler"
              onClick={() => setShowRequestDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Soumettre Demande"
              onClick={handleSubmitRequest}
              className="bg-secondary text-white"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Float;

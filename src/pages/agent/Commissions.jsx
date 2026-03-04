import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Menu } from 'primereact/menu';
import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from 'recharts';
import {
  DollarSign, TrendingUp, Clock, CheckCircle, Activity,
  Calendar as CalendarIcon, Download, ArrowDownToLine,
  ArrowUpFromLine, ArrowLeftRight, CreditCard, Target,
  BarChart3, Wallet, RefreshCw, Eye, FileText, Award,
  AlertCircle, XCircle, TrendingDown, Info
} from 'lucide-react';

function Commissions() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [customDateRange, setCustomDateRange] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const dt = useRef(null);
  const dtPaiements = useRef(null);
  const menuRef = useRef(null);

  const periods = [
    { label: "Aujourd'hui", value: 'today' },
    { label: 'Cette semaine', value: 'week' },
    { label: 'Ce mois', value: 'month' },
    { label: 'Mois précédent', value: 'lastmonth' },
    { label: 'Personnalisé', value: 'custom' }
  ];

  // 1️⃣ COMMISSION OVERVIEW - KPIs
  const commissionData = {
    totale: 58500,
    aujourdhui: 5850,
    enAttente: 12000,
    payee: 46500,
    moyenne: 1393,
    vsHier: 12.5,
    vsMoisPrecedent: 8.3
  };

  // 3️⃣ DÉTAIL PAR TYPE D'OPÉRATION
  const commissionParType = [
    { 
      type: 'Dépôt', 
      volume: 2500000, 
      taux: 1.5, 
      commission: 37500, 
      count: 15, 
      color: '#F58424',
      icon: ArrowDownToLine 
    },
    { 
      type: 'Retrait', 
      volume: 1800000, 
      taux: 2.0, 
      commission: 36000, 
      count: 12, 
      color: '#007BFF',
      icon: ArrowUpFromLine 
    },
    { 
      type: 'Transfert', 
      volume: 1200000, 
      taux: 1.0, 
      commission: 12000, 
      count: 10, 
      color: '#10b981',
      icon: ArrowLeftRight 
    },
    { 
      type: 'Paiement Facture', 
      volume: 350000, 
      taux: 0.5, 
      commission: 1750, 
      count: 5, 
      color: '#f59e0b',
      icon: FileText 
    }
  ];

  // 4️⃣ HISTORIQUE DÉTAILLÉ DES COMMISSIONS
  const historiqueCommissions = [
    {
      id: 'COM-2024-001234',
      date: '2024-02-12 14:35:22',
      transaction: 'TRX-20240212-5678',
      type: 'Dépôt',
      montant: 150000,
      taux: 1.5,
      commission: 2250,
      statut: 'payee',
      client: 'Jean Mukendi'
    },
    {
      id: 'COM-2024-001233',
      date: '2024-02-12 13:20:15',
      transaction: 'TRX-20240212-5677',
      type: 'Retrait',
      montant: 80000,
      taux: 2.0,
      commission: 1600,
      statut: 'validee',
      client: 'Marie Kabila'
    },
    {
      id: 'COM-2024-001232',
      date: '2024-02-12 11:45:30',
      transaction: 'TRX-20240212-5676',
      type: 'Transfert',
      montant: 200000,
      taux: 1.0,
      commission: 2000,
      statut: 'en_attente',
      client: 'Paul Tshisekedi'
    },
    {
      id: 'COM-2024-001231',
      date: '2024-02-12 10:15:45',
      transaction: 'TRX-20240212-5675',
      type: 'Dépôt',
      montant: 300000,
      taux: 1.5,
      commission: 4500,
      statut: 'payee',
      client: 'Sophie Mbuyi'
    },
    {
      id: 'COM-2024-001230',
      date: '2024-02-11 16:30:10',
      transaction: 'TRX-20240211-5674',
      type: 'Paiement Facture',
      montant: 50000,
      taux: 0.5,
      commission: 250,
      statut: 'annulee',
      client: 'David Kasongo'
    }
  ];

  // 5️⃣ PAIEMENT DES COMMISSIONS
  const infoPaiement = {
    mode: 'Wallet uFaranga',
    periodicite: 'Quotidien',
    dernierPaiement: '2024-02-11 23:59:00',
    prochainPaiement: '2024-02-12 23:59:00',
    montantProchain: 12000
  };

  const historiquePaiements = [
    {
      id: 'PAY-2024-0212',
      date: '2024-02-11 23:59:00',
      montant: 15850,
      mode: 'Wallet',
      reference: 'WLT-PAY-20240211-001',
      statut: 'complete',
      periode: '11 Fév 2024'
    },
    {
      id: 'PAY-2024-0211',
      date: '2024-02-10 23:59:00',
      montant: 18200,
      mode: 'Wallet',
      reference: 'WLT-PAY-20240210-001',
      statut: 'complete',
      periode: '10 Fév 2024'
    },
    {
      id: 'PAY-2024-0210',
      date: '2024-02-09 23:59:00',
      montant: 12450,
      mode: 'Wallet',
      reference: 'WLT-PAY-20240209-001',
      statut: 'complete',
      periode: '09 Fév 2024'
    }
  ];

  // 6️⃣ ANALYTICS AVANCÉES
  const evolutionCommissions = [
    { date: '06 Fév', commission: 12500, transactions: 8 },
    { date: '07 Fév', commission: 15800, transactions: 10 },
    { date: '08 Fév', commission: 11200, transactions: 7 },
    { date: '09 Fév', commission: 18900, transactions: 12 },
    { date: '10 Fév', commission: 16500, transactions: 11 },
    { date: '11 Fév', commission: 14300, transactions: 9 },
    { date: '12 Fév', commission: 5850, transactions: 4 }
  ];

  const commissionParHeure = [
    { heure: '08h', commission: 850 },
    { heure: '09h', commission: 1200 },
    { heure: '10h', commission: 2100 },
    { heure: '11h', commission: 1800 },
    { heure: '12h', commission: 950 },
    { heure: '13h', commission: 1600 },
    { heure: '14h', commission: 2250 },
    { heure: '15h', commission: 0 },
    { heure: '16h', commission: 0 },
    { heure: '17h', commission: 0 }
  ];

  const projectionFinMois = {
    commissionsActuelles: 58500,
    joursEcoules: 12,
    joursRestants: 16,
    moyenneJour: 4875,
    projectionTotale: 136500,
    objectifMois: 150000,
    tauxAtteinte: 91
  };


  // TEMPLATES DE COLONNES
  const statutTemplate = (rowData) => {
    const statutConfig = {
      en_attente: { label: 'En attente', severity: 'warning', icon: Clock },
      validee: { label: 'Validée', severity: 'info', icon: CheckCircle },
      payee: { label: 'Payée', severity: 'success', icon: DollarSign },
      annulee: { label: 'Annulée', severity: 'danger', icon: XCircle }
    };
    const config = statutConfig[rowData.statut];
    const Icon = config.icon;
    return (
      <Tag 
        value={
          <span className="flex items-center gap-1">
            <Icon size={14} />
            {config.label}
          </span>
        } 
        severity={config.severity} 
      />
    );
  };

  const montantTemplate = (rowData) => (
    <span className="font-semibold text-[#F9F9F9]">{rowData.montant.toLocaleString()} FC</span>
  );

  const commissionTemplate = (rowData) => (
    <span className="font-bold text-[#10b981]">{rowData.commission.toLocaleString()} FC</span>
  );

  const tauxTemplate = (rowData) => (
    <span className="text-[#007BFF] font-medium">{rowData.taux}%</span>
  );

  const dateTemplate = (rowData) => (
    <span className="text-sm text-[#F9F9F9]">{rowData.date}</span>
  );

  const actionTemplate = (rowData) => (
    <Button 
      icon={<Eye size={16} />} 
      rounded 
      text 
      severity="info"
      tooltip="Voir détails"
      tooltipOptions={{ position: 'left' }}
    />
  );

  // Templates pour paiements
  const statutPaiementTemplate = (rowData) => {
    const config = {
      complete: { label: 'Complété', severity: 'success' },
      en_cours: { label: 'En cours', severity: 'warning' },
      echoue: { label: 'Échoué', severity: 'danger' }
    };
    return <Tag value={config[rowData.statut].label} severity={config[rowData.statut].severity} />;
  };

  const montantPaiementTemplate = (rowData) => (
    <span className="font-bold text-lg text-[#10b981]">{rowData.montant.toLocaleString()} FC</span>
  );

  // Export menu
  const exportMenuItems = [
    {
      label: 'Export PDF',
      icon: 'pi pi-file-pdf',
      command: () => console.log('Export PDF')
    },
    {
      label: 'Export Excel',
      icon: 'pi pi-file-excel',
      command: () => dt.current?.exportCSV()
    },
    {
      label: 'Relevé officiel',
      icon: 'pi pi-verified',
      command: () => console.log('Relevé officiel')
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-[#00070F] min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#F9F9F9] flex items-center gap-3">
            <DollarSign className="text-[#10b981]" size={36} />
            Mes Commissions
          </h1>
          <p className="text-[#9CA3AF] mt-1">
            Suivi détaillé et transparent de vos revenus d'agent
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            icon="pi pi-refresh" 
            label="Actualiser" 
            outlined 
            severity="secondary"
          />
          <Menu model={exportMenuItems} popup ref={menuRef} />
          <Button 
            icon="pi pi-download" 
            label="Exporter" 
            severity="success"
            onClick={(e) => menuRef.current?.toggle(e)}
          />
        </div>
      </div>

      {/* 🟦 1️⃣ COMMISSION OVERVIEW - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Commission Totale */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Commission Totale
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{commissionData.totale.toLocaleString()} FC</p>
          <p className="text-sm text-gray-400 mb-2">Période sélectionnée</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{commissionData.vsMoisPrecedent}% vs mois précédent</span>
          </div>
        </div>

        {/* Commission Aujourd'hui */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Aujourd'hui
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{commissionData.aujourdhui.toLocaleString()} FC</p>
          <p className="text-sm text-gray-400 mb-2">Commission du jour</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{commissionData.vsHier}% vs hier</span>
          </div>
        </div>

        {/* En Attente */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              En Attente
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{commissionData.enAttente.toLocaleString()} FC</p>
          <p className="text-sm text-gray-400 mb-2">Non encore payée</p>
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Paiement ce soir</span>
          </div>
        </div>

        {/* Déjà Payée */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Déjà Payée
            </p>
          </div>
          <p className="text-3xl font-bold text-secondary mb-1">{commissionData.payee.toLocaleString()} FC</p>
          <p className="text-sm text-gray-400 mb-2">
            {Math.round((commissionData.payee / commissionData.totale) * 100)}% du total
          </p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Crédité</span>
          </div>
        </div>
      </div>

      {/* 🟦 2️⃣ SÉLECTEUR DE PÉRIODE */}
      <div className="bg-[#181F27] p-4 rounded-xl shadow-lg border border-[#343A40]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon size={20} className="text-[#F58424]" />
            <span className="font-semibold text-[#F9F9F9]">Période :</span>
          </div>
          <div className="flex gap-2">
            {periods.map(period => (
              <Button
                key={period.value}
                label={period.label}
                outlined={selectedPeriod !== period.value}
                severity={selectedPeriod === period.value ? 'info' : 'secondary'}
                size="small"
                onClick={() => setSelectedPeriod(period.value)}
              />
            ))}
          </div>
          {selectedPeriod === 'custom' && (
            <Calendar 
              value={customDateRange} 
              onChange={(e) => setCustomDateRange(e.value)} 
              selectionMode="range" 
              readOnlyInput 
              placeholder="Sélectionner une période"
              className="w-64"
            />
          )}
        </div>
      </div>


      {/* 🟦 3️⃣ DÉTAIL PAR TYPE D'OPÉRATION */}
      <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
        <h2 className="text-xl font-bold text-[#F9F9F9] mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-[#007BFF]" />
          Répartition par Type d'Opération
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table détaillée */}
          <div className="space-y-3">
            {commissionParType.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="p-4 bg-[#00070F] border border-[#343A40] rounded-lg hover:border-[#007BFF] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon size={24} style={{ color: item.color }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#F9F9F9]">{item.type}</h3>
                        <p className="text-sm text-[#9CA3AF]">
                          {item.count} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.commission.toLocaleString()} FC
                      </p>
                      <p className="text-sm text-[#9CA3AF]">
                        Taux: {item.taux}%
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-[#9CA3AF]">
                    <span>Volume traité:</span>
                    <span className="font-semibold text-[#F9F9F9]">{item.volume.toLocaleString()} FC</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphique professionnel - Barres groupées */}
          <div className="bg-[#00070F] p-4 rounded-lg border border-[#343A40] flex flex-col h-full">
            <h3 className="text-sm font-semibold text-[#F9F9F9] mb-3">
              Analyse Commission vs Volume
            </h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionParType}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                  <XAxis 
                    dataKey="type" 
                    stroke="#9CA3AF" 
                    angle={-15}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Commission') return [`${value.toLocaleString()} FC`, 'Commission'];
                      if (name === 'Transactions') return [value, 'Transactions'];
                      return [value, name];
                    }}
                    contentStyle={{ 
                      backgroundColor: '#181F27', 
                      border: '1px solid #343A40', 
                      color: '#F9F9F9',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="commission" fill="#007BFF" name="Commission" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="count" fill="#F58424" name="Transactions" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#007BFF] rounded"></div>
                <span className="text-[#9CA3AF]">Commission générée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F58424] rounded"></div>
                <span className="text-[#9CA3AF]">Nombre de transactions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟦 4️⃣ HISTORIQUE DÉTAILLÉ DES COMMISSIONS */}
      <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#F9F9F9] flex items-center gap-2">
            <FileText size={24} className="text-[#8b5cf6]" />
            Historique Détaillé des Commissions
          </h2>
          <div className="flex gap-2">
            <Dropdown
              value={selectedType}
              options={[
                { label: 'Tous les types', value: null },
                ...commissionParType.map(t => ({ label: t.type, value: t.type }))
              ]}
              onChange={(e) => setSelectedType(e.value)}
              placeholder="Filtrer par type"
              className="w-48"
            />
          </div>
        </div>

        <DataTable 
          ref={dt}
          value={historiqueCommissions}
          paginator 
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          filterDisplay="row"
          emptyMessage="Aucune commission trouvée"
          className="text-sm"
          stripedRows
          responsiveLayout="scroll"
        >
          <Column 
            field="id" 
            header="ID" 
            sortable 
            style={{ minWidth: '120px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-[#007BFF]">{rowData.id}</span>
            )}
          />
          <Column 
            field="date" 
            header="Date" 
            sortable 
            body={dateTemplate}
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="transaction" 
            header="Trx" 
            sortable
            body={(rowData) => (
              <span className="font-mono text-xs text-[#F9F9F9]">{rowData.transaction}</span>
            )}
            style={{ minWidth: '130px' }}
          />
          <Column 
            field="client" 
            header="Client" 
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column 
            field="type" 
            header="Type" 
            sortable
            body={(rowData) => {
              const typeConfig = commissionParType.find(t => t.type === rowData.type);
              const Icon = typeConfig?.icon;
              return (
                <span className="flex items-center gap-2 text-[#F9F9F9]">
                  {Icon && <Icon size={16} style={{ color: typeConfig.color }} />}
                  {rowData.type}
                </span>
              );
            }}
            style={{ minWidth: '140px' }}
          />
          <Column 
            field="montant" 
            header="Montant" 
            sortable 
            body={montantTemplate}
            style={{ minWidth: '100px' }}
          />
          <Column 
            field="taux" 
            header="Taux" 
            sortable 
            body={tauxTemplate}
            style={{ minWidth: '70px' }}
          />
          <Column 
            field="commission" 
            header="Commission" 
            sortable 
            body={commissionTemplate}
            style={{ minWidth: '110px' }}
          />
          <Column 
            field="statut" 
            header="Statut" 
            sortable 
            body={statutTemplate}
            style={{ minWidth: '130px' }}
          />
          <Column 
            header="Actions" 
            body={actionTemplate}
            style={{ width: '80px' }}
          />
        </DataTable>

        {/* Légende des statuts */}
        <div className="mt-4 bg-[#181F27] p-6 rounded-lg border border-[#343A40]">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[#007BFF]/10 rounded-lg">
              <Info size={24} className="text-[#007BFF]" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#F9F9F9]">Comprendre les statuts</h4>
              <p className="text-sm text-[#9CA3AF] mt-1">Guide des différents états de commission</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#F58424] transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#F58424]/10 rounded-lg">
                  <Clock size={20} className="text-[#F58424]" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#F9F9F9] mb-1">En attente</h5>
                  <p className="text-sm text-[#9CA3AF]">
                    Transaction OK, paiement non exécuté
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                  <CheckCircle size={20} className="text-[#007BFF]" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#F9F9F9] mb-1">Validée</h5>
                  <p className="text-sm text-[#9CA3AF]">
                    Commission approuvée, en attente de paiement
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#10b981] transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#10b981]/10 rounded-lg">
                  <DollarSign size={20} className="text-[#10b981]" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#F9F9F9] mb-1">Payée</h5>
                  <p className="text-sm text-[#9CA3AF]">
                    Montant crédité sur votre wallet
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#ef4444] transition-all">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#ef4444]/10 rounded-lg">
                  <XCircle size={20} className="text-[#ef4444]" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#F9F9F9] mb-1">Annulée</h5>
                  <p className="text-sm text-[#9CA3AF]">
                    Transaction annulée, commission non due
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* 🟦 5️⃣ PAIEMENT DES COMMISSIONS */}
      <div className="space-y-6">
        {/* Informations de paiement - Bloc complet */}
        <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[#10b981]/10 rounded-lg">
              <Wallet size={24} className="text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F9F9F9]">Informations Paiement</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Configuration de vos paiements</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Mode de paiement */}
            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40]">
              <div className="flex items-center gap-2 mb-2">
                <Wallet size={16} className="text-[#10b981]" />
                <p className="text-xs text-[#9CA3AF] uppercase font-semibold tracking-wide">Mode</p>
              </div>
              <p className="font-bold text-[#F9F9F9] text-base">
                {infoPaiement.mode}
              </p>
            </div>

            {/* Périodicité */}
            <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40]">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={16} className="text-[#007BFF]" />
                <p className="text-xs text-[#9CA3AF] uppercase font-semibold tracking-wide">Périodicité</p>
              </div>
              <p className="font-bold text-[#F9F9F9] text-base">
                {infoPaiement.periodicite}
              </p>
            </div>

            {/* Dernier paiement */}
            <div className="p-4 bg-[#007BFF]/10 rounded-lg border border-[#007BFF]/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-[#007BFF]" />
                <p className="text-xs text-[#007BFF] uppercase font-semibold tracking-wide">Dernier paiement</p>
              </div>
              <p className="font-semibold text-[#F9F9F9] text-sm">
                {new Date(infoPaiement.dernierPaiement).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Prochain paiement */}
            <div className="p-4 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#10b981]" />
                <p className="text-xs text-[#10b981] uppercase font-semibold tracking-wide">Prochain paiement</p>
              </div>
              <p className="font-semibold text-[#F9F9F9] text-sm mb-1">
                {new Date(infoPaiement.prochainPaiement).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-lg font-bold text-[#10b981]">
                {infoPaiement.montantProchain.toLocaleString()} FC
              </p>
            </div>

            {/* Note importante */}
            <div className="p-4 bg-[#F58424]/10 rounded-lg border border-[#F58424]/30">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-[#F58424] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#F9F9F9] text-xs mb-1">Automatique</p>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Crédit quotidien à 23h59
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des paiements - Bloc complet */}
        <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
              <CreditCard size={24} className="text-[#8b5cf6]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#F9F9F9]">Historique des Paiements</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Tous vos paiements de commissions</p>
            </div>
          </div>

          <DataTable 
            ref={dtPaiements}
            value={historiquePaiements}
            paginator 
            rows={5}
            dataKey="id"
            emptyMessage="Aucun paiement trouvé"
            className="text-sm"
            responsiveLayout="scroll"
          >
            <Column 
              field="id" 
              header="ID" 
              style={{ minWidth: '120px' }}
              body={(rowData) => (
                <span className="font-mono text-xs text-[#8b5cf6]">{rowData.id}</span>
              )}
            />
            <Column 
              field="date" 
              header="Date" 
              sortable
              style={{ minWidth: '140px' }}
              body={(rowData) => (
                <span className="text-sm text-[#F9F9F9]">{new Date(rowData.date).toLocaleString('fr-FR')}</span>
              )}
            />
            <Column 
              field="periode" 
              header="Période"
              style={{ minWidth: '100px' }}
            />
            <Column 
              field="montant" 
              header="Montant" 
              sortable
              style={{ minWidth: '120px' }}
              body={montantPaiementTemplate}
            />
            <Column 
              field="mode" 
              header="Mode"
              style={{ minWidth: '80px' }}
            />
            <Column 
              field="reference" 
              header="Référence"
              style={{ minWidth: '150px' }}
              body={(rowData) => (
                <span className="font-mono text-xs text-[#F9F9F9]">{rowData.reference}</span>
              )}
            />
            <Column 
              field="statut" 
              header="Statut"
              style={{ minWidth: '100px' }}
              body={statutPaiementTemplate}
            />
          </DataTable>

          <div className="mt-4 p-4 bg-[#00070F] rounded-lg border border-[#343A40]">
            <div className="flex justify-between items-center">
              <span className="text-[#9CA3AF] font-semibold">
                Total payé (période affichée)
              </span>
              <span className="text-2xl font-bold text-[#10b981]">
                {historiquePaiements.reduce((sum, p) => sum + p.montant, 0).toLocaleString()} FC
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🟦 6️⃣ ANALYTICS AVANCÉES */}
      <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
        <h2 className="text-xl font-bold text-[#F9F9F9] mb-4 flex items-center gap-2">
          <BarChart3 size={24} className="text-[#6366f1]" />
          Analytics Avancées
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Évolution sur 7 jours */}
          <div className="bg-[#00070F] p-4 rounded-lg border border-[#343A40]">
            <h3 className="font-semibold text-[#F9F9F9] mb-3">
              Évolution des Commissions (7 derniers jours)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={evolutionCommissions}>
                <defs>
                  <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'commission') return [`${value.toLocaleString()} FC`, 'Commission'];
                    return [value, 'Transactions'];
                  }}
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', color: '#F9F9F9' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="commission" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorCommission)" 
                  name="Commission"
                />
                <Line 
                  type="monotone" 
                  dataKey="transactions" 
                  stroke="#F58424" 
                  strokeWidth={2}
                  name="Transactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Commission par heure */}
          <div className="bg-[#00070F] p-4 rounded-lg border border-[#343A40]">
            <h3 className="font-semibold text-[#F9F9F9] mb-3">
              Commission par Heure (Aujourd'hui)
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={commissionParHeure}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="heure" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => `${value.toLocaleString()} FC`}
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', color: '#F9F9F9' }}
                />
                <Bar dataKey="commission" fill="#007BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-[#9CA3AF] mt-2 text-center">
              Meilleure période: 14h (2,250 FC)
            </p>
          </div>
        </div>

        {/* Projection fin de mois */}
        <Divider />
        
        <div className="mt-4">
          <h3 className="font-semibold text-[#F9F9F9] mb-4 flex items-center gap-2">
            <Target size={20} className="text-[#6366f1]" />
            Projection Fin de Mois
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-[#007BFF]/10 rounded-lg border border-[#007BFF]/30">
              <p className="text-sm text-[#9CA3AF]">Commissions actuelles</p>
              <p className="text-2xl font-bold text-[#007BFF] mt-1">
                {projectionFinMois.commissionsActuelles.toLocaleString()} FC
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                {projectionFinMois.joursEcoules} jours écoulés
              </p>
            </div>

            <div className="p-4 bg-[#10b981]/10 rounded-lg border border-[#10b981]/30">
              <p className="text-sm text-[#9CA3AF]">Moyenne journalière</p>
              <p className="text-2xl font-bold text-[#10b981] mt-1">
                {projectionFinMois.moyenneJour.toLocaleString()} FC
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Basé sur l'activité actuelle
              </p>
            </div>

            <div className="p-4 bg-[#8b5cf6]/10 rounded-lg border border-[#8b5cf6]/30">
              <p className="text-sm text-[#9CA3AF]">Projection totale</p>
              <p className="text-2xl font-bold text-[#8b5cf6] mt-1">
                {projectionFinMois.projectionTotale.toLocaleString()} FC
              </p>
              <p className="text-xs text-[#9CA3AF] mt-1">
                Si tendance maintenue
              </p>
            </div>

            <div className="p-4 bg-[#F58424]/10 rounded-lg border border-[#F58424]/30">
              <p className="text-sm text-[#9CA3AF]">Objectif mensuel</p>
              <p className="text-2xl font-bold text-[#F58424] mt-1">
                {projectionFinMois.objectifMois.toLocaleString()} FC
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF]">Progression</span>
                  <span className="font-semibold text-[#F9F9F9]">{projectionFinMois.tauxAtteinte}%</span>
                </div>
                <div className="w-full bg-[#343A40] rounded-full h-2">
                  <div 
                    className="bg-[#F58424] h-2 rounded-full transition-all"
                    style={{ width: `${projectionFinMois.tauxAtteinte}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 bg-[#181F27] p-6 rounded-lg border border-[#343A40]">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-[#6366f1]/10 rounded-lg">
                <Award size={28} className="text-[#6366f1]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-[#F9F9F9] mb-1">
                  Insights & Recommandations
                </h4>
                <p className="text-sm text-[#9CA3AF]">
                  Analyse intelligente de vos performances et conseils personnalisés
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#10b981] transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#10b981]/10 rounded-lg">
                    <TrendingUp size={20} className="text-[#10b981]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#F9F9F9] mb-2">Performance Excellente</h5>
                    <p className="text-sm text-[#9CA3AF]">
                      Vous êtes à <strong className="text-[#F9F9F9]">{projectionFinMois.tauxAtteinte}%</strong> de votre objectif mensuel. 
                      Continuez sur cette lancée!
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#007BFF]/10 rounded-lg">
                    <Clock size={20} className="text-[#007BFF]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#F9F9F9] mb-2">Optimisation Horaire</h5>
                    <p className="text-sm text-[#9CA3AF]">
                      Votre meilleure période est <strong className="text-[#F9F9F9]">14h-15h</strong>. 
                      Optimisez votre disponibilité à ces heures.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#F58424] transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F58424]/10 rounded-lg">
                    <DollarSign size={20} className="text-[#F58424]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#F9F9F9] mb-2">Type le Plus Rentable</h5>
                    <p className="text-sm text-[#9CA3AF]">
                      Les <strong className="text-[#F9F9F9]">dépôts</strong> génèrent le plus de commissions (64%). 
                      Encouragez vos clients à déposer.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#8b5cf6] transition-all">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#8b5cf6]/10 rounded-lg">
                    <Target size={20} className="text-[#8b5cf6]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-[#F9F9F9] mb-2">Objectif Restant</h5>
                    <p className="text-sm text-[#9CA3AF]">
                      Pour atteindre {projectionFinMois.objectifMois.toLocaleString()} FC, 
                      visez <strong className="text-[#F9F9F9]">{Math.ceil((projectionFinMois.objectifMois - projectionFinMois.commissionsActuelles) / projectionFinMois.joursRestants).toLocaleString()} FC/jour</strong> 
                      les {projectionFinMois.joursRestants} jours restants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - Règles importantes */}
      <div className="bg-[#181F27] p-6 rounded-xl shadow-lg border border-[#343A40]">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-[#007BFF]/10 rounded-lg">
            <Info size={28} className="text-[#007BFF]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#F9F9F9] mb-1">
              Règles de Commission - Lecture Seule
            </h3>
            <p className="text-sm text-[#9CA3AF]">
              Informations importantes concernant le calcul et le paiement de vos commissions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Taux fixes</h4>
                <p className="text-sm text-[#9CA3AF]">
                  Les taux de commission sont définis par uFaranga et ne peuvent être modifiés
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Calcul automatique</h4>
                <p className="text-sm text-[#9CA3AF]">
                  Toutes les commissions sont calculées automatiquement et en temps réel
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Historique immuable</h4>
                <p className="text-sm text-[#9CA3AF]">
                  L'historique est immuable et conservé pour audit externe
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Paiements automatiques</h4>
                <p className="text-sm text-[#9CA3AF]">
                  Les paiements sont automatiques et tracés dans le système
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Exports sécurisés</h4>
                <p className="text-sm text-[#9CA3AF]">
                  Tous les exports sont horodatés et signés numériquement
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#00070F] rounded-lg border border-[#343A40] hover:border-[#007BFF] transition-all">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-[#10b981] mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[#F9F9F9] mb-1">Support disponible</h4>
                <p className="text-sm text-[#9CA3AF]">
                  En cas de litige, contactez le support avec l'ID de commission
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-[#F58424]/10 rounded-lg border border-[#F58424]/30 flex items-center gap-3">
          <AlertCircle size={20} className="text-[#F58424] flex-shrink-0" />
          <p className="text-sm text-[#9CA3AF]">
            <strong className="text-[#F9F9F9]">Important :</strong> Ces règles sont conformes aux standards bancaires internationaux et aux régulations locales en vigueur.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Commissions;

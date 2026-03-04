import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, Activity, Clock, Zap, Users, ArrowDownToLine,
  ArrowUpFromLine, ArrowLeftRight, CreditCard, RefreshCw, Download,
  AlertTriangle, CheckCircle, Target
} from 'lucide-react';

function Performance() {
  const toast = useRef(null);
  const dt = useRef(null);
  const [period, setPeriod] = useState('24h');

  const periods = [
    { label: 'Dernières 24h', value: '24h' },
    { label: '7 derniers jours', value: '7d' },
    { label: '30 derniers jours', value: '30d' }
  ];

  // KPIs globaux
  const globalKPIs = {
    totalTransactions: 145678,
    avgResponseTime: 67,
    successRate: 98.5,
    peakHour: '14h-15h',
    totalVolume: 8900000000
  };

  // Transactions par heure (24h)
  const transactionsPerHour = [
    { heure: '00h', transactions: 234, temps: 45 },
    { heure: '01h', transactions: 189, temps: 42 },
    { heure: '02h', transactions: 156, temps: 40 },
    { heure: '03h', transactions: 142, temps: 38 },
    { heure: '04h', transactions: 178, temps: 41 },
    { heure: '05h', transactions: 298, temps: 48 },
    { heure: '06h', transactions: 567, temps: 52 },
    { heure: '07h', transactions: 892, temps: 58 },
    { heure: '08h', transactions: 1234, temps: 65 },
    { heure: '09h', transactions: 1567, temps: 72 },
    { heure: '10h', transactions: 1789, temps: 78 },
    { heure: '11h', transactions: 1923, temps: 82 },
    { heure: '12h', transactions: 2145, temps: 89 },
    { heure: '13h', transactions: 2234, temps: 92 },
    { heure: '14h', transactions: 2456, temps: 95 },
    { heure: '15h', transactions: 2389, temps: 93 },
    { heure: '16h', transactions: 2123, temps: 87 },
    { heure: '17h', transactions: 1876, temps: 81 },
    { heure: '18h', transactions: 1654, temps: 75 },
    { heure: '19h', transactions: 1432, temps: 68 },
    { heure: '20h', transactions: 1123, temps: 62 },
    { heure: '21h', transactions: 876, temps: 55 },
    { heure: '22h', transactions: 567, temps: 48 },
    { heure: '23h', transactions: 345, temps: 43 }
  ];

  // Répartition par type
  const transactionsByType = [
    { type: 'Dépôts', count: 45678, volume: 2500000000, avgTime: 52, color: '#007BFF' },
    { type: 'Retraits', count: 38234, volume: 1800000000, avgTime: 58, color: '#F58424' },
    { type: 'Transferts', count: 42156, volume: 3200000000, avgTime: 65, color: '#28A745' },
    { type: 'Paiements', count: 19610, volume: 1400000000, avgTime: 48, color: '#FFC107' }
  ];

  // Top agents performants
  const topAgents = [
    { id: 'AG001', nom: 'Jean Mukiza', transactions: 2456, volume: 125000000, avgTime: 45, successRate: 99.2 },
    { id: 'AG002', nom: 'Marie Ndayisenga', transactions: 2234, volume: 118000000, avgTime: 48, successRate: 98.9 },
    { id: 'AG003', nom: 'Pierre Nkurunziza', transactions: 2123, volume: 112000000, avgTime: 52, successRate: 98.7 },
    { id: 'AG004', nom: 'Grace Irakoze', transactions: 1987, volume: 105000000, avgTime: 55, successRate: 98.5 },
    { id: 'AG005', nom: 'David Niyonzima', transactions: 1876, volume: 98000000, avgTime: 58, successRate: 98.3 }
  ];

  // Services les plus sollicités
  const topServices = [
    { service: 'Transfert P2P', requests: 42156, avgTime: 65, errorRate: 1.2 },
    { service: 'Dépôt Cash', requests: 45678, avgTime: 52, errorRate: 0.8 },
    { service: 'Retrait Cash', requests: 38234, avgTime: 58, errorRate: 1.5 },
    { service: 'Paiement Facture', requests: 19610, avgTime: 48, errorRate: 0.5 },
    { service: 'Recharge Mobile', requests: 15432, avgTime: 42, errorRate: 0.3 }
  ];

  // Insights & Recommandations
  const insights = [
    {
      type: 'peak',
      icon: TrendingUp,
      title: 'Pic d\'utilisation',
      message: 'Le pic d\'activité se situe entre 14h et 15h avec 2,456 transactions',
      recommendation: 'Augmenter les ressources serveur pendant cette période',
      severity: 'info'
    },
    {
      type: 'performance',
      icon: Zap,
      title: 'Performance optimale',
      message: 'Le temps de réponse moyen est de 67ms, en dessous de la cible de 100ms',
      recommendation: 'Maintenir les optimisations actuelles',
      severity: 'success'
    },
    {
      type: 'bottleneck',
      icon: AlertTriangle,
      title: 'Goulot d\'étranglement',
      message: 'Les webhooks ont un temps de réponse élevé (890ms)',
      recommendation: 'Optimiser les appels externes ou augmenter le timeout',
      severity: 'warning'
    }
  ];

  const exportCSV = () => {
    dt.current.exportCSV();
    toast.current.show({
      severity: 'success',
      summary: 'Export réussi',
      detail: 'Les données ont été exportées en CSV',
      life: 3000
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Performance Système
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Analyse technique et business de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Dropdown
            value={period}
            options={periods}
            onChange={(e) => setPeriod(e.value)}
            className="w-48"
          />
          <button
            onClick={exportCSV}
            className="p-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
            title="Exporter"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            className="p-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 🟦 1️⃣ KPIs GLOBAUX */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Total Trx</div>
          </div>
          <div className="text-2xl font-bold text-text">{(globalKPIs.totalTransactions / 1000).toFixed(0)}K</div>
          <div className="text-xs text-gray-400 mt-1">transactions</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Temps Moy</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalKPIs.avgResponseTime}ms</div>
          <div className="text-xs text-green-500 mt-1">Excellent</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Taux Succès</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalKPIs.successRate}%</div>
          <div className="text-xs text-gray-400 mt-1">très bon</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Heure Pic</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalKPIs.peakHour}</div>
          <div className="text-xs text-gray-400 mt-1">période</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Volume</div>
          </div>
          <div className="text-2xl font-bold text-text">{(globalKPIs.totalVolume / 1000000000).toFixed(1)}B</div>
          <div className="text-xs text-gray-400 mt-1">BIF</div>
        </div>
      </div>

      {/* 🟦 2️⃣ TRANSACTIONS PAR HEURE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Transactions par Heure</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactionsPerHour}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="heure" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181F27',
                border: '1px solid #343A40',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="transactions"
              stroke="#007BFF"
              strokeWidth={3}
              dot={{ fill: '#007BFF', r: 4 }}
              name="Transactions"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temps"
              stroke="#F58424"
              strokeWidth={2}
              dot={{ fill: '#F58424', r: 3 }}
              name="Temps (ms)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🟦 3️⃣ RÉPARTITION PAR TYPE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Répartition par Type d'Opération</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Graphique */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="type" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181F27',
                    border: '1px solid #343A40',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="#007BFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Détails */}
          <div className="space-y-3">
            {transactionsByType.map((type, idx) => (
              <div key={idx} className="border border-darkGray bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-text">{type.type}</div>
                  <div className="text-sm font-bold text-primary">{type.count.toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400">Volume</div>
                    <div className="font-bold text-text">{(type.volume / 1000000000).toFixed(1)}B BIF</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Temps moy</div>
                    <div className="font-bold text-text">{type.avgTime}ms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🟦 4️⃣ TOP AGENTS PERFORMANTS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Top Agents Performants</h2>
        <DataTable
          ref={dt}
          value={topAgents}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="id"
            header="ID Agent"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-mono text-primary">{rowData.id}</span>
            )}
          />
          <Column
            field="nom"
            header="Nom"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="font-semibold text-text">{rowData.nom}</span>
            )}
          />
          <Column
            field="transactions"
            header="Transactions"
            sortable
            style={{ minWidth: '120px' }}
            body={(rowData) => (
              <span className="font-bold text-text">{rowData.transactions.toLocaleString()}</span>
            )}
          />
          <Column
            field="volume"
            header="Volume"
            sortable
            style={{ minWidth: '120px' }}
            body={(rowData) => (
              <span className="font-bold text-secondary">{(rowData.volume / 1000000).toFixed(0)}M BIF</span>
            )}
          />
          <Column
            field="avgTime"
            header="Temps Moy"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="text-text">{rowData.avgTime}ms</span>
            )}
          />
          <Column
            field="successRate"
            header="Taux Succès"
            sortable
            style={{ minWidth: '120px' }}
            body={(rowData) => (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${rowData.successRate}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-green-500">{rowData.successRate}%</span>
              </div>
            )}
          />
        </DataTable>
      </div>

      {/* 🟦 5️⃣ SERVICES LES PLUS SOLLICITÉS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Services les Plus Sollicités</h2>
        <div className="space-y-3">
          {topServices.map((service, idx) => (
            <div key={idx} className="border border-darkGray bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-text">{service.service}</div>
                <div className="text-sm font-bold text-primary">{service.requests.toLocaleString()} req</div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Temps moyen</div>
                  <div className="font-bold text-text">{service.avgTime}ms</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Taux erreur</div>
                  <div className={`font-bold ${service.errorRate > 1 ? 'text-red-500' : 'text-green-500'}`}>
                    {service.errorRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Performance</div>
                  <div className="h-2 bg-darkGray rounded-full overflow-hidden">
                    <div
                      className={`h-full ${service.errorRate > 1 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${100 - service.errorRate * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟦 6️⃣ INSIGHTS & RECOMMANDATIONS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Insights & Recommandations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, idx) => {
            const Icon = insight.icon;
            const bgColor = insight.severity === 'success' ? 'bg-green-500/10 border-green-500/30' :
                           insight.severity === 'warning' ? 'bg-secondary/10 border-secondary/30' :
                           'bg-primary/10 border-primary/30';
            const iconColor = insight.severity === 'success' ? 'text-green-500' :
                             insight.severity === 'warning' ? 'text-secondary' :
                             'text-primary';
            return (
              <div key={idx} className={`border rounded-lg p-4 ${bgColor}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text mb-1">{insight.title}</h3>
                    <p className="text-sm text-gray-400">{insight.message}</p>
                  </div>
                </div>
                <div className="pl-11">
                  <div className="text-xs text-gray-500 mb-1">Recommandation:</div>
                  <p className="text-sm text-text">{insight.recommendation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Performance;

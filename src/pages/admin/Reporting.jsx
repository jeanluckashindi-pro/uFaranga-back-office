import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import {
  ComposedChart, Line, Bar, Area, BarChart, LineChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  FileText, TrendingUp, TrendingDown, Download, Calendar,
  RefreshCw, Filter, DollarSign, Users, Activity, Target,
  BarChart3, PieChart as PieChartIcon, Clock, CheckCircle
} from 'lucide-react';

function Reporting() {
  const toast = useRef(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [reportType, setReportType] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const kpiMetrics = {
    revenueTotal: { value: 2450000000, change: 15.8, trend: 'up', target: 3000000000 },
    transactionsTotal: { value: 156789, change: 12.3, trend: 'up' },
    utilisateursActifs: { value: 45678, change: 8.7, trend: 'up' },
    tauxReussite: { value: 98.4, change: 1.2, trend: 'up', target: 99 }
  };

  const revenueByMonth = [
    { mois: 'Jan', revenue: 180000000, transactions: 12000, agents: 3200, clients: 28000 },
    { mois: 'Fév', revenue: 195000000, transactions: 13500, agents: 3400, clients: 31000 },
    { mois: 'Mar', revenue: 210000000, transactions: 14200, agents: 3600, clients: 34000 },
    { mois: 'Avr', revenue: 198000000, transactions: 13800, agents: 3550, clients: 33000 },
    { mois: 'Mai', revenue: 225000000, transactions: 15600, agents: 3800, clients: 37000 },
    { mois: 'Juin', revenue: 240000000, transactions: 16800, agents: 4000, clients: 40000 },
    { mois: 'Juil', revenue: 235000000, transactions: 16200, agents: 3950, clients: 39000 },
    { mois: 'Août', revenue: 255000000, transactions: 17500, agents: 4200, clients: 42000 },
    { mois: 'Sep', revenue: 268000000, transactions: 18200, agents: 4350, clients: 44000 },
    { mois: 'Oct', revenue: 280000000, transactions: 19000, agents: 4500, clients: 46000 },
    { mois: 'Nov', revenue: 295000000, transactions: 19800, agents: 4650, clients: 48000 },
    { mois: 'Déc', revenue: 310000000, transactions: 20800, agents: 4800, clients: 50000 }
  ];

  const serviceDistribution = [
    { name: 'Transferts', value: 45, montant: 1102500000, color: '#007BFF' },
    { name: 'Dépôts', value: 28, montant: 686000000, color: '#28A745' },
    { name: 'Retraits', value: 18, montant: 441000000, color: '#F58424' },
    { name: 'Paiements', value: 6, montant: 147000000, color: '#FFC107' },
    { name: 'Autres', value: 3, montant: 73500000, color: '#6C757D' }
  ];

  const topAgents = [
    { rang: 1, nom: 'Agent Bujumbura Centre', transactions: 8945, revenue: 125000000, croissance: 18.5 },
    { rang: 2, nom: 'Agent Gitega Plaza', transactions: 7823, revenue: 98000000, croissance: 15.2 },
    { rang: 3, nom: 'Agent Ngozi Market', transactions: 6712, revenue: 87000000, croissance: 12.8 },
    { rang: 4, nom: 'Agent Muyinga Centre', transactions: 5890, revenue: 76000000, croissance: 10.5 },
    { rang: 5, nom: 'Agent Bururi Town', transactions: 5234, revenue: 68000000, croissance: 9.2 }
  ];

  const performanceByProvince = [
    { province: 'Bujumbura Mairie', agents: 245, transactions: 45678, revenue: 580000000, croissance: 15.8 },
    { province: 'Gitega', agents: 189, transactions: 34567, revenue: 420000000, croissance: 12.3 },
    { province: 'Ngozi', agents: 156, transactions: 28901, revenue: 350000000, croissance: 10.5 },
    { province: 'Muyinga', agents: 134, transactions: 23456, revenue: 290000000, croissance: 8.7 },
    { province: 'Bururi', agents: 112, transactions: 19876, revenue: 245000000, croissance: 7.2 }
  ];

  const scheduledReports = [
    { id: 1, nom: 'Rapport Mensuel Exécutif', type: 'Exécutif', frequence: 'Mensuel', prochaine: '01/03/2026', statut: 'Actif' },
    { id: 2, nom: 'Analyse Hebdomadaire Transactions', type: 'Opérationnel', frequence: 'Hebdomadaire', prochaine: '17/02/2026', statut: 'Actif' },
    { id: 3, nom: 'Rapport Quotidien Float', type: 'Float', frequence: 'Quotidien', prochaine: '14/02/2026', statut: 'Actif' },
    { id: 4, nom: 'Audit Trimestriel Sécurité', type: 'Sécurité', frequence: 'Trimestriel', prochaine: '01/04/2026', statut: 'Actif' },
    { id: 5, nom: 'Performance Agents Mensuelle', type: 'Agents', frequence: 'Mensuel', prochaine: '01/03/2026', statut: 'Pause' }
  ];

  const ReportKPICard = ({ title, value, change, trend, icon: Icon, subtitle, unit = '', progress }) => {
    const isPositive = change > 0;
    
    let displayValue = value;
    if (typeof value === 'number' && value >= 1000000000) {
      displayValue = `${(value / 1000000000).toFixed(2)}B`;
    } else if (typeof value === 'number' && value >= 1000000) {
      displayValue = `${(value / 1000000).toFixed(1)}M`;
    } else if (typeof value === 'number' && value >= 1000) {
      displayValue = value.toLocaleString();
    }

    return (
      <div className="border border-darkGray bg-card rounded-lg p-5 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{title}</p>
            <p className="text-3xl font-bold text-text mb-1">{displayValue}{unit}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
        
        {change !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            {isPositive ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">vs période précédente</span>
          </div>
        )}

        {progress && (
          <div className="h-1.5 bg-darkGray rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                progress >= 90 ? 'bg-green-500' : progress >= 70 ? 'bg-secondary' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Actif': 'bg-green-500/20 text-green-500',
      'Pause': 'bg-yellow-500/20 text-yellow-500',
      'Inactif': 'bg-gray-500/20 text-gray-500'
    };
    return colors[status] || colors.Inactif;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-anton uppercase text-text tracking-tight">
            Business Intelligence & Reporting
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Analyses avancées et rapports automatisés
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card border border-darkGray rounded-lg text-text text-sm"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg ${autoRefresh ? 'bg-primary text-white' : 'bg-card border border-darkGray'}`}
          >
            <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold">
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportKPICard
          title="Revenue Total"
          value={kpiMetrics.revenueTotal.value}
          change={kpiMetrics.revenueTotal.change}
          trend={kpiMetrics.revenueTotal.trend}
          icon={DollarSign}
          unit=" BIF"
          subtitle="Toutes sources confondues"
          progress={(kpiMetrics.revenueTotal.value / kpiMetrics.revenueTotal.target) * 100}
        />
        <ReportKPICard
          title="Transactions"
          value={kpiMetrics.transactionsTotal.value}
          change={kpiMetrics.transactionsTotal.change}
          trend={kpiMetrics.transactionsTotal.trend}
          icon={Activity}
          subtitle="Volume total"
        />
        <ReportKPICard
          title="Utilisateurs Actifs"
          value={kpiMetrics.utilisateursActifs.value}
          change={kpiMetrics.utilisateursActifs.change}
          trend={kpiMetrics.utilisateursActifs.trend}
          icon={Users}
          subtitle="Agents + Clients"
        />
        <ReportKPICard
          title="Taux de Réussite"
          value={kpiMetrics.tauxReussite.value}
          change={kpiMetrics.tauxReussite.change}
          trend={kpiMetrics.tauxReussite.trend}
          icon={CheckCircle}
          unit="%"
          subtitle={`Objectif: ${kpiMetrics.tauxReussite.target}%`}
          progress={kpiMetrics.tauxReussite.value}
        />
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Évolution Annuelle du Revenue et Transactions
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={revenueByMonth}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#007BFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '12px' }} />
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
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#007BFF"
              strokeWidth={3}
              fill="url(#colorRevenue)"
              name="Revenue (BIF)"
            />
            <Bar yAxisId="right" dataKey="transactions" fill="#F58424" name="Transactions" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="agents"
              stroke="#28A745"
              strokeWidth={2}
              name="Agents Actifs"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-secondary" />
            Distribution par Service
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {serviceDistribution.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                  <span className="text-gray-400">{service.name}</span>
                </div>
                <span className="text-text font-semibold">{(service.montant / 1000000).toFixed(0)}M BIF</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Top 5 Agents Performants
          </h2>
          <div className="space-y-4">
            {topAgents.map((agent) => (
              <div key={agent.rang} className="flex items-center gap-4 p-3 bg-darkGray/30 rounded-lg hover:bg-darkGray/50 transition-colors">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold">
                  #{agent.rang}
                </div>
                <div className="flex-1">
                  <p className="text-text font-semibold">{agent.nom}</p>
                  <p className="text-xs text-gray-400">{agent.transactions.toLocaleString()} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-text font-bold">{(agent.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +{agent.croissance}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Performance par Province
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-darkGray">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Province</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Agents</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Transactions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Revenue</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Croissance</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody>
              {performanceByProvince.map((province, index) => (
                <tr key={index} className="border-b border-darkGray/50 hover:bg-darkGray/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-text font-semibold">{province.province}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{province.agents}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{province.transactions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-text font-semibold">{(province.revenue / 1000000).toFixed(0)}M</td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{province.croissance}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-darkGray rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(province.revenue / 580000000) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-anton uppercase text-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Rapports Programmés
          </h2>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm">
            <FileText size={16} />
            Nouveau Rapport
          </button>
        </div>
        <div className="space-y-3">
          {scheduledReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-darkGray/30 rounded-lg hover:bg-darkGray/50 transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-text font-semibold">{report.nom}</p>
                  <p className="text-xs text-gray-400">{report.type} • {report.frequence}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Prochaine génération</p>
                  <p className="text-sm text-text font-semibold">{report.prochaine}</p>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBadge(report.statut)}`}>
                  {report.statut}
                </span>
                <button className="text-primary hover:text-primary/80">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reporting;

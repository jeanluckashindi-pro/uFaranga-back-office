import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import {
  ComposedChart, Line, Bar, Area, BarChart, LineChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Users, Award,
  RefreshCw, Download, Filter, Calendar, Target,
  Percent, Activity, CheckCircle, AlertCircle, Clock
} from 'lucide-react';

function GestionCommissions() {
  const toast = useRef(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [filterType, setFilterType] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const commissionsMetrics = {
    totalCommissions: { value: 125000000, change: 18.5, trend: 'up', target: 150000000 },
    commissionsPayees: { value: 98000000, change: 15.2, trend: 'up', taux: 78.4 },
    commissionsEnAttente: { value: 27000000, change: -8.3, trend: 'down', count: 234 },
    tauxMoyenCommission: { value: 2.8, change: 0.3, trend: 'up', target: 3.0 }
  };

  const commissionsEvolution = Array.from({ length: 12 }, (_, i) => {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'][i];
    return {
      mois,
      total: Math.floor(Math.random() * 30000000) + 80000000,
      payees: Math.floor(Math.random() * 25000000) + 65000000,
      attente: Math.floor(Math.random() * 8000000) + 10000000,
      agents: Math.floor(Math.random() * 500) + 3500
    };
  });

  const commissionsParType = [
    { type: 'Transferts', montant: 45000000, pourcentage: 36, agents: 1234, color: '#007BFF' },
    { type: 'Dépôts', montant: 32000000, pourcentage: 25.6, agents: 1456, color: '#28A745' },
    { type: 'Retraits', montant: 28000000, pourcentage: 22.4, agents: 1123, color: '#F58424' },
    { type: 'Paiements', montant: 15000000, pourcentage: 12, agents: 789, color: '#FFC107' },
    { type: 'Autres', montant: 5000000, pourcentage: 4, agents: 345, color: '#6C757D' }
  ];

  const topAgentsCommissions = [
    { rang: 1, nom: 'Agent Bujumbura Centre', id: 'AG-001', commissions: 2500000, transactions: 8945, taux: 2.9, croissance: 22.5, statut: 'Payé' },
    { rang: 2, nom: 'Agent Gitega Plaza', id: 'AG-002', commissions: 2100000, transactions: 7823, taux: 2.8, croissance: 18.3, statut: 'Payé' },
    { rang: 3, nom: 'Agent Ngozi Market', id: 'AG-003', commissions: 1850000, transactions: 6712, taux: 2.7, croissance: 15.7, statut: 'En attente' },
    { rang: 4, nom: 'Agent Muyinga Centre', id: 'AG-004', commissions: 1620000, transactions: 5890, taux: 2.6, croissance: 12.4, statut: 'Payé' },
    { rang: 5, nom: 'Agent Bururi Town', id: 'AG-005', commissions: 1450000, transactions: 5234, taux: 2.5, croissance: 10.8, statut: 'Payé' },
    { rang: 6, nom: 'Agent Makamba City', id: 'AG-006', commissions: 1320000, transactions: 4876, taux: 2.5, croissance: 9.2, statut: 'En attente' },
    { rang: 7, nom: 'Agent Rutana Hub', id: 'AG-007', commissions: 1180000, transactions: 4523, taux: 2.4, croissance: 8.5, statut: 'Payé' },
    { rang: 8, nom: 'Agent Ruyigi Point', id: 'AG-008', commissions: 1050000, transactions: 4012, taux: 2.4, croissance: 7.1, statut: 'Payé' }
  ];

  const commissionsParProvince = [
    { province: 'Bujumbura Mairie', agents: 245, commissions: 28000000, moyenne: 114285, performance: 95 },
    { province: 'Gitega', agents: 189, commissions: 21000000, moyenne: 111111, performance: 88 },
    { province: 'Ngozi', agents: 156, commissions: 17500000, moyenne: 112179, performance: 82 },
    { province: 'Muyinga', agents: 134, commissions: 14200000, moyenne: 105970, performance: 76 },
    { province: 'Bururi', agents: 112, commissions: 12000000, moyenne: 107142, performance: 71 },
    { province: 'Makamba', agents: 98, commissions: 10500000, moyenne: 107142, performance: 68 },
    { province: 'Rutana', agents: 87, commissions: 9200000, moyenne: 105747, performance: 64 },
    { province: 'Ruyigi', agents: 76, commissions: 8100000, moyenne: 106578, performance: 60 }
  ];

  const paiementsRecents = [
    { id: 'PAY-8901', agent: 'Agent-234', montant: 2500000, periode: 'Janvier 2026', date: '05/02/2026', statut: 'Payé', methode: 'Virement' },
    { id: 'PAY-8902', agent: 'Agent-567', montant: 2100000, periode: 'Janvier 2026', date: '05/02/2026', statut: 'Payé', methode: 'Mobile Money' },
    { id: 'PAY-8903', agent: 'Agent-123', montant: 1850000, periode: 'Janvier 2026', date: '06/02/2026', statut: 'En attente', methode: 'Virement' },
    { id: 'PAY-8904', agent: 'Agent-890', montant: 1620000, periode: 'Janvier 2026', date: '06/02/2026', statut: 'Payé', methode: 'Espèces' },
    { id: 'PAY-8905', agent: 'Agent-456', montant: 1450000, periode: 'Janvier 2026', date: '07/02/2026', statut: 'Payé', methode: 'Mobile Money' }
  ];

  const performanceIndicators = [
    { indicateur: 'Ponctualité', score: 94 },
    { indicateur: 'Précision', score: 97 },
    { indicateur: 'Satisfaction', score: 92 },
    { indicateur: 'Conformité', score: 96 },
    { indicateur: 'Efficacité', score: 89 }
  ];

  const CommissionKPICard = ({ title, value, change, trend, icon: Icon, subtitle, unit = '', progress }) => {
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
      'Payé': 'bg-green-500/20 text-green-500',
      'En attente': 'bg-yellow-500/20 text-yellow-500',
      'Rejeté': 'bg-red-500/20 text-red-500'
    };
    return colors[status] || colors['En attente'];
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-anton uppercase text-text tracking-tight">
            Commission Management System
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Gestion et suivi des commissions agents
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
        <CommissionKPICard
          title="Total Commissions"
          value={commissionsMetrics.totalCommissions.value}
          change={commissionsMetrics.totalCommissions.change}
          trend={commissionsMetrics.totalCommissions.trend}
          icon={DollarSign}
          unit=" BIF"
          subtitle="Toutes périodes"
          progress={(commissionsMetrics.totalCommissions.value / commissionsMetrics.totalCommissions.target) * 100}
        />
        <CommissionKPICard
          title="Commissions Payées"
          value={commissionsMetrics.commissionsPayees.value}
          change={commissionsMetrics.commissionsPayees.change}
          trend={commissionsMetrics.commissionsPayees.trend}
          icon={CheckCircle}
          unit=" BIF"
          subtitle={`Taux: ${commissionsMetrics.commissionsPayees.taux}%`}
          progress={commissionsMetrics.commissionsPayees.taux}
        />
        <CommissionKPICard
          title="En Attente"
          value={commissionsMetrics.commissionsEnAttente.value}
          change={commissionsMetrics.commissionsEnAttente.change}
          trend={commissionsMetrics.commissionsEnAttente.trend}
          icon={Clock}
          unit=" BIF"
          subtitle={`${commissionsMetrics.commissionsEnAttente.count} paiements`}
        />
        <CommissionKPICard
          title="Taux Moyen"
          value={commissionsMetrics.tauxMoyenCommission.value}
          change={commissionsMetrics.tauxMoyenCommission.change}
          trend={commissionsMetrics.tauxMoyenCommission.trend}
          icon={Percent}
          unit="%"
          subtitle={`Objectif: ${commissionsMetrics.tauxMoyenCommission.target}%`}
          progress={(commissionsMetrics.tauxMoyenCommission.value / commissionsMetrics.tauxMoyenCommission.target) * 100}
        />
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Évolution des Commissions (12 mois)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={commissionsEvolution}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="total"
              stroke="#007BFF"
              strokeWidth={3}
              fill="url(#colorTotal)"
              name="Total (BIF)"
            />
            <Bar yAxisId="left" dataKey="payees" fill="#28A745" name="Payées (BIF)" />
            <Bar yAxisId="left" dataKey="attente" fill="#F58424" name="En Attente (BIF)" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="agents"
              stroke="#FFC107"
              strokeWidth={2}
              name="Agents Actifs"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-secondary" />
            Distribution par Type de Service
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={commissionsParType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, pourcentage }) => `${type} ${pourcentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="pourcentage"
              >
                {commissionsParType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {commissionsParType.map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                  <span className="text-gray-400">{service.type}</span>
                </div>
                <span className="text-text font-semibold">{(service.montant / 1000000).toFixed(1)}M BIF</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Indicateurs de Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={performanceIndicators}>
              <PolarGrid stroke="#343A40" />
              <PolarAngleAxis dataKey="indicateur" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#007BFF"
                fill="#007BFF"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Top Agents par Commissions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-darkGray">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Rang</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Agent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">ID</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Commissions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Transactions</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Taux</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Croissance</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody>
              {topAgentsCommissions.map((agent) => (
                <tr key={agent.rang} className="border-b border-darkGray/50 hover:bg-darkGray/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                      #{agent.rang}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text font-semibold">{agent.nom}</td>
                  <td className="py-3 px-4 text-sm text-gray-400 font-mono">{agent.id}</td>
                  <td className="py-3 px-4 text-sm text-text font-bold">{(agent.commissions / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{agent.transactions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-text">{agent.taux}%</td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-green-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      +{agent.croissance}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(agent.statut)}`}>
                      {agent.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Performance par Province
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={commissionsParProvince}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="province" stroke="#9ca3af" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181F27',
                border: '1px solid #343A40',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="commissions" fill="#007BFF" name="Commissions (BIF)" />
            <Bar dataKey="moyenne" fill="#F58424" name="Moyenne par Agent (BIF)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-darkGray bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-anton uppercase text-text flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Paiements Récents
          </h2>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-darkGray border border-darkGray rounded-lg text-text text-sm"
          >
            <option value="all">Tous</option>
            <option value="paye">Payés</option>
            <option value="attente">En attente</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-darkGray">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">ID Paiement</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Agent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Montant</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Période</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Méthode</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiementsRecents.map((paiement) => (
                <tr key={paiement.id} className="border-b border-darkGray/50 hover:bg-darkGray/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-text font-mono font-semibold">{paiement.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{paiement.agent}</td>
                  <td className="py-3 px-4 text-sm text-text font-bold">{(paiement.montant / 1000).toFixed(0)}K BIF</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{paiement.periode}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{paiement.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-400">{paiement.methode}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(paiement.statut)}`}>
                      {paiement.statut}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-primary hover:text-primary/80 text-sm font-semibold">
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GestionCommissions;

import { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Users, UserCheck, Activity, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, Wallet, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

function AdminDashboard() {
  // KPIs Globaux
  const [globalKPIs] = useState({
    volumeTotal: 2345678900, // BIF
    commissionsTotal: 45678900,
    agentsActifs: 1234,
    agentsInactifs: 156,
    clientsActifs: 45678,
    clientsNouveaux: 234,
    transactionsJour: 12456,
    floatGlobal: 5678900000,
    alertesFraude: 12,
    tauxReussite: 98.5
  });

  // Données graphique - Volume par jour
  const volumeData = [
    { jour: 'Lun', volume: 1850000000, transactions: 10234 },
    { jour: 'Mar', volume: 2100000000, transactions: 11456 },
    { jour: 'Mer', volume: 1950000000, transactions: 10876 },
    { jour: 'Jeu', volume: 2300000000, transactions: 12234 },
    { jour: 'Ven', volume: 2800000000, transactions: 14567 },
    { jour: 'Sam', volume: 3200000000, transactions: 15678 },
    { jour: 'Dim', volume: 2345000000, transactions: 12456 }
  ];

  // Données graphique - Commissions par type
  const commissionsData = [
    { type: 'Dépôts', montant: 15678900, pourcentage: 34 },
    { type: 'Retraits', montant: 12345600, pourcentage: 27 },
    { type: 'Transferts', montant: 10234500, pourcentage: 22 },
    { type: 'Paiements', montant: 7419900, pourcentage: 17 }
  ];

  // Données graphique - Agents par région
  const agentsParRegion = [
    { region: 'Bujumbura', actifs: 456, inactifs: 34 },
    { region: 'Gitega', actifs: 234, inactifs: 23 },
    { region: 'Ngozi', actifs: 189, inactifs: 18 },
    { region: 'Muyinga', actifs: 156, inactifs: 15 },
    { region: 'Autres', actifs: 199, inactifs: 66 }
  ];

  // Top 10 Agents
  const topAgents = [
    { id: 'AG001', nom: 'Jean Mukiza', region: 'Bujumbura', volume: 45678900, commissions: 456789, transactions: 1234 },
    { id: 'AG002', nom: 'Marie Ndayisenga', region: 'Gitega', volume: 42345600, commissions: 423456, transactions: 1156 },
    { id: 'AG003', nom: 'Pierre Nkurunziza', region: 'Ngozi', volume: 39876500, commissions: 398765, transactions: 1089 },
    { id: 'AG004', nom: 'Grace Irakoze', region: 'Bujumbura', volume: 37654300, commissions: 376543, transactions: 1023 },
    { id: 'AG005', nom: 'David Niyonzima', region: 'Muyinga', volume: 35432100, commissions: 354321, transactions: 967 }
  ];

  // Alertes récentes
  const alertes = [
    { id: 1, type: 'fraude', message: 'Transaction suspecte détectée - Agent AG234', time: 'Il y a 5 min', severity: 'high' },
    { id: 2, type: 'float', message: 'Float faible - Agent AG456 (Région Gitega)', time: 'Il y a 15 min', severity: 'medium' },
    { id: 3, type: 'kyc', message: '23 clients en attente de validation KYC', time: 'Il y a 1h', severity: 'low' },
    { id: 4, type: 'system', message: 'Pic de transactions détecté - Système stable', time: 'Il y a 2h', severity: 'info' }
  ];

  const COLORS = ['#F58424', '#007BFF', '#6b7280', '#9ca3af'];

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-danger/10 border-darkGray text-danger',
      medium: 'bg-secondary/10 border-darkGray text-secondary',
      low: 'bg-primary/10 border-darkGray text-primary',
      info: 'bg-gray-500/10 border-darkGray text-gray-400'
    };
    return colors[severity] || colors.info;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-anton uppercase text-text">Dashboard Global</h1>
        <p className="text-gray-400 mt-1">Vue d'ensemble complète de la plateforme uFaranga</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Volume Total */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Volume Total Jour</p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(globalKPIs.volumeTotal / 1000000000).toFixed(2)}B BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+15% vs hier</span>
          </div>
        </div>

        {/* Commissions */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Commissions Totales</p>
            <DollarSign className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(globalKPIs.commissionsTotal / 1000000).toFixed(1)}M BIF</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12% vs hier</span>
          </div>
        </div>

        {/* Agents Actifs */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Agents Actifs</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{globalKPIs.agentsActifs.toLocaleString()}</p>
          <p className="text-sm text-gray-400">{globalKPIs.agentsInactifs} inactifs</p>
        </div>

        {/* Clients */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Clients Actifs</p>
            <UserCheck className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold text-text mb-2">{(globalKPIs.clientsActifs / 1000).toFixed(1)}K</p>
          <p className="text-sm text-secondary">+{globalKPIs.clientsNouveaux} nouveaux aujourd'hui</p>
        </div>
      </div>

      {/* Alertes Importantes */}
      {alertes.filter(a => a.severity === 'high').length > 0 && (
        <div className="border border-darkGray bg-danger/5 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-danger" />
            <div className="flex-1">
              <p className="text-text font-semibold">Alertes Critiques</p>
              <p className="text-gray-400 text-sm">{globalKPIs.alertesFraude} alertes fraude nécessitent votre attention</p>
            </div>
            <button className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 transition-colors">
              Voir Tout
            </button>
          </div>
        </div>
      )}

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume & Transactions */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4">Volume Hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="jour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                labelStyle={{ color: '#F9F9F9' }}
              />
              <Legend />
              <Bar dataKey="volume" fill="#007BFF" name="Volume (BIF)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Commissions par Type */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4">Commissions par Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={commissionsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, pourcentage }) => `${type} ${pourcentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="montant"
              >
                {commissionsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agents par Région */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h3 className="text-xl font-anton uppercase text-text mb-4">Agents par Région</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={agentsParRegion}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="region" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
              labelStyle={{ color: '#F9F9F9' }}
            />
            <Legend />
            <Bar dataKey="actifs" fill="#F58424" name="Actifs" />
            <Bar dataKey="inactifs" fill="#6b7280" name="Inactifs" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Agents & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Agents */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4">Top 5 Agents</h3>
          <div className="space-y-3">
            {topAgents.map((agent, index) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-darkBlue rounded-lg hover:bg-darkGray transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="text-text font-semibold">{agent.nom}</p>
                    <p className="text-gray-400 text-sm">{agent.id} • {agent.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text font-bold">{(agent.volume / 1000000).toFixed(1)}M BIF</p>
                  <p className="text-secondary text-sm">{agent.transactions} txns</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes Récentes */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h3 className="text-xl font-anton uppercase text-text mb-4">Alertes Récentes</h3>
          <div className="space-y-3">
            {alertes.map((alerte) => (
              <div key={alerte.id} className={`p-3 border rounded-lg ${getSeverityColor(alerte.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{alerte.message}</p>
                    <p className="text-xs opacity-70 mt-1">{alerte.time}</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 ml-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

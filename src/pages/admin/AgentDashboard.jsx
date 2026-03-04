import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Button } from '../../components/common';

function AgentDashboard() {
  const [period, setPeriod] = useState('week');

  // Données pour le graphique des revenus mensuels
  const revenueData = [
    { mois: 'Jan', revenus: 4500, commissions: 450, transactions: 120 },
    { mois: 'Fév', revenus: 5200, commissions: 520, transactions: 145 },
    { mois: 'Mar', revenus: 4800, commissions: 480, transactions: 135 },
    { mois: 'Avr', revenus: 6100, commissions: 610, transactions: 168 },
    { mois: 'Mai', revenus: 7200, commissions: 720, transactions: 195 },
    { mois: 'Juin', revenus: 6800, commissions: 680, transactions: 182 },
    { mois: 'Juil', revenus: 7500, commissions: 750, transactions: 205 },
    { mois: 'Août', revenus: 8200, commissions: 820, transactions: 225 },
    { mois: 'Sep', revenus: 7800, commissions: 780, transactions: 210 },
    { mois: 'Oct', revenus: 8900, commissions: 890, transactions: 240 },
    { mois: 'Nov', revenus: 9500, commissions: 950, transactions: 260 },
    { mois: 'Déc', revenus: 10200, commissions: 1020, transactions: 280 }
  ];

  // Données pour les transactions par type
  const transactionTypeData = [
    { type: 'Dépôts', valeur: 45, montant: 125000 },
    { type: 'Retraits', valeur: 30, montant: 89000 },
    { type: 'Transferts', valeur: 15, montant: 45000 },
    { type: 'Recharges', valeur: 10, montant: 12000 }
  ];

  // Données pour la progression hebdomadaire
  const weeklyData = [
    { jour: 'Lun', transactions: 35, montant: 8500 },
    { jour: 'Mar', transactions: 42, montant: 10200 },
    { jour: 'Mer', transactions: 38, montant: 9100 },
    { jour: 'Jeu', transactions: 51, montant: 12400 },
    { jour: 'Ven', transactions: 48, montant: 11800 },
    { jour: 'Sam', transactions: 65, montant: 15600 },
    { jour: 'Dim', transactions: 28, montant: 6800 }
  ];

  // Données pour les heures de pointe
  const hourlyData = [
    { heure: '8h', activite: 12 },
    { heure: '9h', activite: 25 },
    { heure: '10h', activite: 38 },
    { heure: '11h', activite: 45 },
    { heure: '12h', activite: 52 },
    { heure: '13h', activite: 48 },
    { heure: '14h', activite: 55 },
    { heure: '15h', activite: 62 },
    { heure: '16h', activite: 58 },
    { heure: '17h', activite: 42 },
    { heure: '18h', activite: 35 },
    { heure: '19h', activite: 18 }
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

  // Calcul des statistiques
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenus, 0);
  const totalCommissions = revenueData.reduce((sum, item) => sum + item.commissions, 0);
  const avgMonthlyRevenue = (totalRevenue / revenueData.length).toFixed(0);
  const growthRate = (((revenueData[11].revenus - revenueData[0].revenus) / revenueData[0].revenus) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Tableau de Bord Agent</h1>
          <p className="text-muted">Analyse détaillée de vos performances</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={period === 'week' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setPeriod('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={period === 'month' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setPeriod('month')}
          >
            Mois
          </Button>
          <Button 
            variant={period === 'year' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setPeriod('year')}
          >
            Année
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-indigo-100">Revenus Totaux</p>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-indigo-100 mt-2">↗ +{growthRate}% cette année</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100">Commissions</p>
            <span className="text-3xl">💵</span>
          </div>
          <p className="text-3xl font-bold">${totalCommissions.toLocaleString()}</p>
          <p className="text-sm text-purple-100 mt-2">10% des revenus</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-pink-100">Moyenne Mensuelle</p>
            <span className="text-3xl">📊</span>
          </div>
          <p className="text-3xl font-bold">${avgMonthlyRevenue}</p>
          <p className="text-sm text-pink-100 mt-2">Sur 12 mois</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-amber-100">Croissance</p>
            <span className="text-3xl">📈</span>
          </div>
          <p className="text-3xl font-bold">+{growthRate}%</p>
          <p className="text-sm text-amber-100 mt-2">Tendance annuelle</p>
        </div>
      </div>

      {/* Graphique principal - Revenus et Commissions */}
      <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Évolution des Revenus et Commissions</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="mois" 
              stroke="#9ca3af"
              style={{ fontSize: '14px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '14px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Bar dataKey="revenus" fill="#6366f1" name="Revenus ($)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="commissions" fill="#8b5cf6" name="Commissions ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression hebdomadaire */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Progression Hebdomadaire</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="jour" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="montant" 
                stroke="#6366f1" 
                fillOpacity={1} 
                fill="url(#colorMontant)"
                name="Montant ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par type */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Répartition par Type de Transaction</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, valeur }) => `${type}: ${valeur}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valeur"
              >
                {transactionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphiques de tendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nombre de transactions */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tendance des Transactions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="mois" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#ec4899" 
                strokeWidth={3}
                name="Nombre de transactions"
                dot={{ fill: '#ec4899', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Heures de pointe */}
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Heures de Pointe</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="heure" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="activite" 
                fill="#f59e0b" 
                name="Activité"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tableau de détails */}
      <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Détails Mensuels</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-default">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Mois</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Revenus</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Commissions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Transactions</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Variation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {revenueData.map((item, index) => {
                const variation = index > 0 
                  ? (((item.revenus - revenueData[index - 1].revenus) / revenueData[index - 1].revenus) * 100).toFixed(1)
                  : 0;
                return (
                  <tr key={item.mois} className="hover:bg-background transition-colors">
                    <td className="px-4 py-3 font-medium">{item.mois}</td>
                    <td className="px-4 py-3 text-right font-semibold">${item.revenus.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-purple-600">${item.commissions.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{item.transactions}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variation >= 0 ? '↗' : '↘'} {Math.abs(variation)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;

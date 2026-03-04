import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common';

function Dashboard() {
  const [stats, setStats] = useState({
    users: 1247,
    transactions: 8934,
    revenue: 45678.90,
    activeAgents: 156
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Tableau de Bord Admin</h1>
        <p className="text-muted">Vue d'ensemble de la plateforme uFaranga</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Utilisateurs</p>
              <p className="text-3xl font-bold text-primary">{stats.users.toLocaleString()}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
          <p className="text-xs text-green-600 mt-2">+12% ce mois</p>
        </div>

        <div className="bg-card border border-default rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Transactions</p>
              <p className="text-3xl font-bold text-primary">{stats.transactions.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💳</div>
          </div>
          <p className="text-xs text-green-600 mt-2">+8% ce mois</p>
        </div>

        <div className="bg-card border border-default rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Revenus</p>
              <p className="text-3xl font-bold text-primary">${stats.revenue.toLocaleString()}</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
          <p className="text-xs text-green-600 mt-2">+15% ce mois</p>
        </div>

        <div className="bg-card border border-default rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted mb-1">Agents Actifs</p>
              <p className="text-3xl font-bold text-primary">{stats.activeAgents}</p>
            </div>
            <div className="text-4xl">🏪</div>
          </div>
          <p className="text-xs text-green-600 mt-2">+5% ce mois</p>
        </div>
      </div>

      {/* Graphiques et activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Activité Récente</h2>
          <div className="space-y-3">
            {[
              { user: 'Jean Dupont', action: 'Nouveau transfert', amount: '+$250', time: 'Il y a 5 min' },
              { user: 'Marie Claire', action: 'Recharge mobile', amount: '+$15', time: 'Il y a 12 min' },
              { user: 'Agent #45', action: 'Dépôt client', amount: '+$500', time: 'Il y a 23 min' },
              { user: 'Paul Martin', action: 'Paiement facture', amount: '+$80', time: 'Il y a 1h' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background rounded border border-default">
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-muted">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{activity.amount}</p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-default rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="primary" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">👤</span>
              <span>Gérer Utilisateurs</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">💸</span>
              <span>Transactions</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🏪</span>
              <span>Agents</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">⚙️</span>
              <span>Paramètres</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

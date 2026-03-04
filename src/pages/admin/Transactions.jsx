import React, { useState } from 'react';
import { Button, Input } from '../../components/common';

function Transactions() {
  const [filter, setFilter] = useState('all');
  const [transactions] = useState([
    { id: 'TXN001', user: 'Jean Dupont', type: 'transfer', amount: 250.00, status: 'completed', date: '2026-02-12 14:30' },
    { id: 'TXN002', user: 'Marie Claire', type: 'recharge', amount: 15.00, status: 'completed', date: '2026-02-12 14:18' },
    { id: 'TXN003', user: 'Paul Martin', type: 'payment', amount: 80.00, status: 'pending', date: '2026-02-12 13:45' },
    { id: 'TXN004', user: 'Sophie Dubois', type: 'withdrawal', amount: 500.00, status: 'completed', date: '2026-02-12 12:20' },
    { id: 'TXN005', user: 'Luc Bernard', type: 'transfer', amount: 120.00, status: 'failed', date: '2026-02-12 11:15' },
    { id: 'TXN006', user: 'Agent #45', type: 'deposit', amount: 1000.00, status: 'completed', date: '2026-02-12 10:30' }
  ]);

  const getTypeLabel = (type) => {
    const labels = {
      transfer: 'Transfert',
      recharge: 'Recharge',
      payment: 'Paiement',
      withdrawal: 'Retrait',
      deposit: 'Dépôt'
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      transfer: '💸',
      recharge: '📱',
      payment: '💳',
      withdrawal: '🏧',
      deposit: '💰'
    };
    return icons[type] || '📄';
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    const labels = {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Transactions</h1>
        <p className="text-muted">Historique de toutes les transactions</p>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-default rounded-lg p-4">
          <p className="text-sm text-muted mb-1">Total Aujourd'hui</p>
          <p className="text-2xl font-bold text-primary">$1,965.00</p>
        </div>
        <div className="bg-card border border-default rounded-lg p-4">
          <p className="text-sm text-muted mb-1">Complétées</p>
          <p className="text-2xl font-bold text-green-600">4</p>
        </div>
        <div className="bg-card border border-default rounded-lg p-4">
          <p className="text-sm text-muted mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">1</p>
        </div>
        <div className="bg-card border border-default rounded-lg p-4">
          <p className="text-sm text-muted mb-1">Échouées</p>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-card border border-default rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setFilter('all')}
          >
            Toutes
          </Button>
          <Button 
            variant={filter === 'completed' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setFilter('completed')}
          >
            Complétées
          </Button>
          <Button 
            variant={filter === 'pending' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setFilter('pending')}
          >
            En attente
          </Button>
          <Button 
            variant={filter === 'failed' ? 'primary' : 'outline'} 
            size="small"
            onClick={() => setFilter('failed')}
          >
            Échouées
          </Button>
          <div className="ml-auto">
            <Button variant="outline" size="small">
              📊 Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="bg-card border border-default rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-default">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  ID Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium">{txn.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{txn.user}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(txn.type)}</span>
                      <span className="text-sm">{getTypeLabel(txn.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold">${txn.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(txn.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted">{txn.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
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

export default Transactions;

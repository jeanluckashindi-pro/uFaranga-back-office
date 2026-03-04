import React, { useState } from 'react';
import { Button, Input } from '../../components/common';

function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', phone: '+243 900 000 001', status: 'active', balance: 1250.50 },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', phone: '+243 900 000 002', status: 'active', balance: 890.00 },
    { id: 3, name: 'Paul Martin', email: 'paul@example.com', phone: '+243 900 000 003', status: 'suspended', balance: 450.75 },
    { id: 4, name: 'Sophie Dubois', email: 'sophie@example.com', phone: '+243 900 000 004', status: 'active', balance: 2100.00 },
    { id: 5, name: 'Luc Bernard', email: 'luc@example.com', phone: '+243 900 000 005', status: 'inactive', balance: 0.00 }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    
    const labels = {
      active: 'Actif',
      suspended: 'Suspendu',
      inactive: 'Inactif'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Gestion des Utilisateurs</h1>
        <p className="text-muted">Gérez tous les utilisateurs de la plateforme</p>
      </div>

      {/* Barre de recherche et actions */}
      <div className="bg-card border border-default rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="primary">
              + Nouvel Utilisateur
            </Button>
            <Button variant="outline">
              📊 Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-card border border-default rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-default">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Solde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-background transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-sm text-muted">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-sm text-muted">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold">${user.balance.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Voir
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                        Modifier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          Affichage de {filteredUsers.length} utilisateur(s)
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="small">Précédent</Button>
          <Button variant="outline" size="small">Suivant</Button>
        </div>
      </div>
    </div>
  );
}

export default Users;

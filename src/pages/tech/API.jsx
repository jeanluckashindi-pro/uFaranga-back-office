import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import {
  Activity, CheckCircle, XCircle, Clock, TrendingUp, Key,
  RefreshCw, Power, PowerOff, Copy, Eye, EyeOff, Settings,
  AlertTriangle, Zap
} from 'lucide-react';

function API() {
  const toast = useRef(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk_live_51HxYz2KqP9mN8vL4cX3bW7fG6hJ5kM2nQ1rT8yU9iO0pA');

  // Liste des endpoints
  const endpoints = [
    {
      id: 1,
      name: '/api/v1/transactions',
      method: 'POST',
      status: 'active',
      calls: 145678,
      avgTime: 45,
      errors: 234,
      errorRate: 0.16,
      lastCall: '2024-02-13 10:45:23'
    },
    {
      id: 2,
      name: '/api/v1/transactions/:id',
      method: 'GET',
      status: 'active',
      calls: 89234,
      avgTime: 32,
      errors: 89,
      errorRate: 0.10,
      lastCall: '2024-02-13 10:45:18'
    },
    {
      id: 3,
      name: '/api/v1/wallets/balance',
      method: 'GET',
      status: 'active',
      calls: 234567,
      avgTime: 28,
      errors: 456,
      errorRate: 0.19,
      lastCall: '2024-02-13 10:45:20'
    },
    {
      id: 4,
      name: '/api/v1/agents',
      method: 'GET',
      status: 'active',
      calls: 12345,
      avgTime: 52,
      errors: 23,
      errorRate: 0.19,
      lastCall: '2024-02-13 10:44:56'
    },
    {
      id: 5,
      name: '/api/v1/webhooks',
      method: 'POST',
      status: 'degraded',
      calls: 45678,
      avgTime: 890,
      errors: 1234,
      errorRate: 2.70,
      lastCall: '2024-02-13 10:45:15'
    },
    {
      id: 6,
      name: '/api/v1/auth/login',
      method: 'POST',
      status: 'active',
      calls: 34567,
      avgTime: 125,
      errors: 567,
      errorRate: 1.64,
      lastCall: '2024-02-13 10:45:10'
    }
  ];

  // Stats globales
  const globalStats = {
    totalCalls: endpoints.reduce((sum, e) => sum + e.calls, 0),
    avgResponseTime: Math.round(endpoints.reduce((sum, e) => sum + e.avgTime, 0) / endpoints.length),
    totalErrors: endpoints.reduce((sum, e) => sum + e.errors, 0),
    activeEndpoints: endpoints.filter(e => e.status === 'active').length,
    degradedEndpoints: endpoints.filter(e => e.status === 'degraded').length
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.current.show({
      severity: 'success',
      summary: 'Copié',
      detail: 'Clé API copiée dans le presse-papier',
      life: 2000
    });
  };

  const regenerateKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 50);
    setApiKey(newKey);
    toast.current.show({
      severity: 'success',
      summary: 'Clé régénérée',
      detail: 'Une nouvelle clé API a été générée',
      life: 3000
    });
  };

  const toggleEndpoint = (endpoint) => {
    toast.current.show({
      severity: 'info',
      summary: endpoint.status === 'active' ? 'Endpoint désactivé' : 'Endpoint activé',
      detail: `${endpoint.name} a été ${endpoint.status === 'active' ? 'désactivé' : 'activé'}`,
      life: 3000
    });
  };

  const statusBodyTemplate = (rowData) => {
    const severity = rowData.status === 'active' ? 'success' : 'warning';
    const label = rowData.status === 'active' ? 'Actif' : 'Dégradé';
    return <Tag value={label} severity={severity} />;
  };

  const methodBodyTemplate = (rowData) => {
    const colors = {
      GET: 'bg-primary/20 text-primary',
      POST: 'bg-secondary/20 text-secondary',
      PUT: 'bg-text/20 text-text',
      DELETE: 'bg-danger/20 text-danger'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${colors[rowData.method]}`}>
        {rowData.method}
      </span>
    );
  };

  const callsBodyTemplate = (rowData) => {
    return <span className="font-bold text-text">{rowData.calls.toLocaleString()}</span>;
  };

  const avgTimeBodyTemplate = (rowData) => {
    const isHigh = rowData.avgTime > 500;
    const isMedium = rowData.avgTime > 100 && rowData.avgTime <= 500;
    return (
      <span className={`font-bold ${isHigh ? 'text-danger' : isMedium ? 'text-secondary' : 'text-green-500'}`}>
        {rowData.avgTime}ms
      </span>
    );
  };

  const errorRateBodyTemplate = (rowData) => {
    const isHigh = rowData.errorRate > 2;
    const isMedium = rowData.errorRate > 1 && rowData.errorRate <= 2;
    return (
      <div className="flex items-center gap-2">
        <span className={`font-bold ${isHigh ? 'text-danger' : isMedium ? 'text-secondary' : 'text-green-500'}`}>
          {rowData.errorRate.toFixed(2)}%
        </span>
        {isHigh && <AlertTriangle size={14} className="text-danger" />}
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => toggleEndpoint(rowData)}
          className={`p-2 rounded-lg transition-colors ${
            rowData.status === 'active'
              ? 'bg-danger/20 text-danger hover:bg-danger/30'
              : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
          }`}
          title={rowData.status === 'active' ? 'Désactiver' : 'Activer'}
        >
          {rowData.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
        </button>
        <button
          onClick={() => setSelectedEndpoint(rowData)}
          className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
          title="Détails"
        >
          <Settings size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Gestion des APIs
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Surveillance et configuration des endpoints API
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowKeyDialog(true)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
          >
            <Key size={18} />
            Gérer les clés
          </button>
        </div>
      </div>

      {/* 🟦 STATS GLOBALES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Total Appels</div>
          </div>
          <div className="text-2xl font-bold text-text">{(globalStats.totalCalls / 1000).toFixed(0)}K</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Temps Moy</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.avgResponseTime}ms</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Erreurs</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.totalErrors.toLocaleString()}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Actifs</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.activeEndpoints}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Dégradés</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.degradedEndpoints}</div>
        </div>
      </div>

      {/* 🟦 LISTE DES ENDPOINTS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Endpoints API</h2>
        <DataTable
          value={endpoints}
          responsiveLayout="scroll"
          className="text-sm"
          paginator
          rows={10}
        >
          <Column
            field="method"
            header="Méthode"
            body={methodBodyTemplate}
            style={{ minWidth: '80px' }}
          />
          <Column
            field="name"
            header="Endpoint"
            sortable
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <span className="font-mono text-sm text-text">{rowData.name}</span>
            )}
          />
          <Column
            field="status"
            header="Statut"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="calls"
            header="Appels"
            body={callsBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="avgTime"
            header="Temps Moy"
            body={avgTimeBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="errors"
            header="Erreurs"
            sortable
            style={{ minWidth: '80px' }}
            body={(rowData) => (
              <span className="text-danger font-bold">{rowData.errors}</span>
            )}
          />
          <Column
            field="errorRate"
            header="Taux Erreur"
            body={errorRateBodyTemplate}
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            field="lastCall"
            header="Dernier Appel"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.lastCall}</span>
            )}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '120px' }}
          />
        </DataTable>
      </div>

      {/* DIALOG GESTION DES CLÉS */}
      <Dialog
        visible={showKeyDialog}
        onHide={() => setShowKeyDialog(false)}
        header="Gestion des Clés API"
        style={{ width: '600px' }}
        className="bg-card"
      >
        <div className="space-y-6">
          <div className="border border-darkGray bg-background rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text mb-1">Clé API Production</h3>
                <p className="text-xs text-gray-400">Utilisée pour les appels en production</p>
              </div>
              <Tag value="Active" severity="success" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-card border border-darkGray rounded-lg p-3 font-mono text-sm text-text overflow-x-auto">
                {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••••••••••'}
              </div>
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button
                onClick={() => copyToClipboard(apiKey)}
                className="p-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={regenerateKey}
              className="flex items-center gap-2 bg-secondary text-white hover:bg-secondary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
            >
              <RefreshCw size={18} />
              Régénérer la clé
            </button>
            <p className="text-xs text-gray-400">
              Attention: la régénération invalidera l'ancienne clé
            </p>
          </div>

          <div className="border border-secondary/30 bg-secondary/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-text mb-1">Rate Limiting</h4>
                <p className="text-sm text-gray-400">
                  Limite actuelle: 1000 requêtes/minute par clé API
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default API;

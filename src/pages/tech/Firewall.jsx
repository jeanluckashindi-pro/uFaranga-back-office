import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import {
  Shield, Ban, CheckCircle, AlertTriangle, Globe,
  Plus, Trash2, Lock, Unlock, TrendingUp
} from 'lucide-react';

function Firewall() {
  const toast = useRef(null);
  const [showAddIPDialog, setShowAddIPDialog] = useState(false);
  const [showBlockCountryDialog, setShowBlockCountryDialog] = useState(false);
  const [autoBlockEnabled, setAutoBlockEnabled] = useState(true);

  // IPs bloquées
  const blockedIPs = [
    {
      id: 1,
      ip: '45.67.89.123',
      reason: 'Multiple failed login attempts',
      blockedAt: '2024-02-13 10:45:10',
      attempts: 15,
      type: 'auto'
    },
    {
      id: 2,
      ip: '123.45.67.89',
      reason: 'Suspicious transaction pattern',
      blockedAt: '2024-02-13 09:30:25',
      attempts: 8,
      type: 'auto'
    },
    {
      id: 3,
      ip: '89.123.45.67',
      reason: 'Manual block - Fraud investigation',
      blockedAt: '2024-02-12 15:20:00',
      attempts: 0,
      type: 'manual'
    },
    {
      id: 4,
      ip: '67.89.123.45',
      reason: 'API rate limit exceeded',
      blockedAt: '2024-02-12 12:10:30',
      attempts: 1000,
      type: 'auto'
    }
  ];

  // IPs autorisées (whitelist)
  const whitelistedIPs = [
    {
      id: 1,
      ip: '192.168.1.100',
      description: 'Office HQ',
      addedAt: '2024-01-15 10:00:00'
    },
    {
      id: 2,
      ip: '10.0.0.0/24',
      description: 'Internal Network',
      addedAt: '2024-01-15 10:00:00'
    },
    {
      id: 3,
      ip: '203.45.67.89',
      description: 'Partner API Server',
      addedAt: '2024-01-20 14:30:00'
    }
  ];

  // Tentatives suspectes
  const suspiciousAttempts = [
    {
      id: 1,
      ip: '156.78.90.123',
      type: 'Failed Login',
      attempts: 8,
      lastAttempt: '2024-02-13 10:50:15',
      country: 'Nigeria',
      risk: 'high'
    },
    {
      id: 2,
      ip: '234.56.78.90',
      type: 'API Abuse',
      attempts: 450,
      lastAttempt: '2024-02-13 10:48:30',
      country: 'Russia',
      risk: 'critical'
    },
    {
      id: 3,
      ip: '78.90.123.45',
      type: 'SQL Injection Attempt',
      attempts: 3,
      lastAttempt: '2024-02-13 10:45:20',
      country: 'China',
      risk: 'critical'
    },
    {
      id: 4,
      ip: '90.123.45.67',
      type: 'Brute Force',
      attempts: 12,
      lastAttempt: '2024-02-13 10:42:10',
      country: 'Unknown',
      risk: 'high'
    }
  ];

  // Pays bloqués
  const blockedCountries = [
    { id: 1, country: 'North Korea', code: 'KP', blockedAt: '2024-01-15 10:00:00', reason: 'Security policy' },
    { id: 2, country: 'Iran', code: 'IR', blockedAt: '2024-01-15 10:00:00', reason: 'Security policy' }
  ];

  // Attaques détectées
  const detectedAttacks = [
    {
      id: 1,
      type: 'DDoS',
      source: '45.67.89.0/24',
      timestamp: '2024-02-13 10:30:00',
      blocked: true,
      requests: 15000
    },
    {
      id: 2,
      type: 'SQL Injection',
      source: '78.90.123.45',
      timestamp: '2024-02-13 10:45:20',
      blocked: true,
      requests: 3
    },
    {
      id: 3,
      type: 'XSS Attempt',
      source: '123.45.67.89',
      timestamp: '2024-02-13 09:15:30',
      blocked: true,
      requests: 5
    }
  ];

  // Stats
  const stats = {
    blockedIPs: blockedIPs.length,
    whitelistedIPs: whitelistedIPs.length,
    suspiciousAttempts: suspiciousAttempts.reduce((sum, a) => sum + a.attempts, 0),
    attacksBlocked: detectedAttacks.length,
    blockedCountries: blockedCountries.length
  };

  const blockIP = (ip) => {
    toast.current.show({
      severity: 'success',
      summary: 'IP bloquée',
      detail: `L'adresse IP ${ip} a été bloquée`,
      life: 3000
    });
  };

  const unblockIP = (ip) => {
    toast.current.show({
      severity: 'info',
      summary: 'IP débloquée',
      detail: `L'adresse IP ${ip.ip} a été débloquée`,
      life: 3000
    });
  };

  const removeWhitelistedIP = (ip) => {
    toast.current.show({
      severity: 'info',
      summary: 'IP retirée',
      detail: `L'adresse IP ${ip.ip} a été retirée de la whitelist`,
      life: 3000
    });
  };

  const typeBodyTemplate = (rowData) => {
    const colors = {
      auto: 'bg-secondary/20 text-secondary',
      manual: 'bg-primary/20 text-primary'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[rowData.type]}`}>
        {rowData.type === 'auto' ? 'Automatique' : 'Manuel'}
      </span>
    );
  };

  const riskBodyTemplate = (rowData) => {
    const severityMap = {
      low: 'info',
      medium: 'warning',
      high: 'warning',
      critical: 'danger'
    };
    const labelMap = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé',
      critical: 'Critique'
    };
    return <Tag value={labelMap[rowData.risk]} severity={severityMap[rowData.risk]} />;
  };

  const blockedActionsBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => unblockIP(rowData)}
        className="p-2 bg-green-500/20 text-green-500 hover:bg-green-500/30 rounded-lg transition-colors"
        title="Débloquer"
      >
        <Unlock size={16} />
      </button>
    );
  };

  const whitelistActionsBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => removeWhitelistedIP(rowData)}
        className="p-2 bg-danger/20 text-danger hover:bg-danger/30 rounded-lg transition-colors"
        title="Retirer"
      >
        <Trash2 size={16} />
      </button>
    );
  };

  const suspiciousActionsBodyTemplate = (rowData) => {
    return (
      <button
        onClick={() => blockIP(rowData.ip)}
        className="p-2 bg-danger/20 text-danger hover:bg-danger/30 rounded-lg transition-colors"
        title="Bloquer"
      >
        <Ban size={16} />
      </button>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Firewall & Sécurité
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Protection avancée et gestion des accès
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setShowAddIPDialog(true)}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
          >
            <Plus size={18} />
            Ajouter IP
          </button>
        </div>
      </div>

      {/* 🟦 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ban size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">IPs Bloquées</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.blockedIPs}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">IPs Autorisées</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.whitelistedIPs}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Tentatives</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.suspiciousAttempts}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Attaques</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.attacksBlocked}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Pays Bloqués</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.blockedCountries}</div>
        </div>
      </div>

      {/* 🟦 RÈGLES AUTOMATIQUES */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Règles Automatiques</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-3">
              <Shield size={24} className={autoBlockEnabled ? 'text-green-500' : 'text-gray-400'} />
              <div>
                <h3 className="font-semibold text-text">Blocage Automatique Anti-Fraude</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Bloque automatiquement les IPs suspectes après 10 tentatives échouées
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAutoBlockEnabled(!autoBlockEnabled);
                toast.current.show({
                  severity: autoBlockEnabled ? 'warning' : 'success',
                  summary: autoBlockEnabled ? 'Règle désactivée' : 'Règle activée',
                  detail: 'Le blocage automatique a été ' + (autoBlockEnabled ? 'désactivé' : 'activé'),
                  life: 3000
                });
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                autoBlockEnabled
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-danger text-white hover:bg-danger/90'
              }`}
            >
              {autoBlockEnabled ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>
      </div>

      {/* 🟦 TENTATIVES SUSPECTES */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Tentatives Suspectes</h2>
        <DataTable
          value={suspiciousAttempts}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="ip"
            header="IP"
            sortable
            style={{ minWidth: '130px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text">{rowData.ip}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-300">{rowData.type}</span>
            )}
          />
          <Column
            field="attempts"
            header="Tentatives"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-danger">{rowData.attempts}</span>
            )}
          />
          <Column
            field="country"
            header="Pays"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-400">{rowData.country}</span>
            )}
          />
          <Column
            field="risk"
            header="Risque"
            body={riskBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="lastAttempt"
            header="Dernière Tentative"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.lastAttempt}</span>
            )}
          />
          <Column
            header="Actions"
            body={suspiciousActionsBodyTemplate}
            style={{ minWidth: '80px' }}
          />
        </DataTable>
      </div>

      {/* 🟦 IPS BLOQUÉES */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">IPs Bloquées</h2>
        <DataTable
          value={blockedIPs}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="ip"
            header="IP"
            sortable
            style={{ minWidth: '130px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text">{rowData.ip}</span>
            )}
          />
          <Column
            field="reason"
            header="Raison"
            sortable
            style={{ minWidth: '250px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-300">{rowData.reason}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            body={typeBodyTemplate}
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            field="attempts"
            header="Tentatives"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-danger">{rowData.attempts || '-'}</span>
            )}
          />
          <Column
            field="blockedAt"
            header="Bloquée le"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.blockedAt}</span>
            )}
          />
          <Column
            header="Actions"
            body={blockedActionsBodyTemplate}
            style={{ minWidth: '80px' }}
          />
        </DataTable>
      </div>

      {/* 🟦 IPS AUTORISÉES (WHITELIST) */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">IPs Autorisées (Whitelist)</h2>
        <DataTable
          value={whitelistedIPs}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="ip"
            header="IP / Range"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text">{rowData.ip}</span>
            )}
          />
          <Column
            field="description"
            header="Description"
            sortable
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-300">{rowData.description}</span>
            )}
          />
          <Column
            field="addedAt"
            header="Ajoutée le"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.addedAt}</span>
            )}
          />
          <Column
            header="Actions"
            body={whitelistActionsBodyTemplate}
            style={{ minWidth: '80px' }}
          />
        </DataTable>
      </div>

      {/* DIALOG AJOUTER IP */}
      <Dialog
        visible={showAddIPDialog}
        onHide={() => setShowAddIPDialog(false)}
        header="Ajouter une IP"
        style={{ width: '500px' }}
        className="bg-card"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ipType" value="whitelist" defaultChecked className="text-primary" />
                <span className="text-sm text-text">Whitelist (Autoriser)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="ipType" value="blacklist" className="text-primary" />
                <span className="text-sm text-text">Blacklist (Bloquer)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Adresse IP</label>
            <input
              type="text"
              placeholder="Ex: 192.168.1.100 ou 10.0.0.0/24"
              className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Description / Raison</label>
            <textarea
              rows={3}
              placeholder="Ex: Office HQ ou Fraud investigation"
              className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddIPDialog(false)}
              className="px-4 py-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                toast.current.show({
                  severity: 'success',
                  summary: 'IP ajoutée',
                  detail: 'L\'adresse IP a été ajoutée avec succès',
                  life: 3000
                });
                setShowAddIPDialog(false);
              }}
              className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Firewall;

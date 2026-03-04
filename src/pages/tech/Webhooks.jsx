import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import {
  Webhook, CheckCircle, XCircle, Clock, RefreshCw, Play,
  Power, PowerOff, Eye, Code, AlertTriangle, Send
} from 'lucide-react';

function Webhooks() {
  const toast = useRef(null);
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Liste des webhooks
  const webhooks = [
    {
      id: 1,
      url: 'https://api.partner1.com/webhooks/ufaranga',
      event: 'transaction.completed',
      status: 'active',
      lastTrigger: '2024-02-13 10:45:23',
      successCount: 1234,
      failureCount: 12,
      avgResponseTime: 245,
      lastPayload: { transaction_id: 'TRX123456', amount: 50000, status: 'completed' },
      lastResponse: { status: 200, message: 'OK' }
    },
    {
      id: 2,
      url: 'https://api.partner2.com/notify',
      event: 'transaction.failed',
      status: 'active',
      lastTrigger: '2024-02-13 10:42:15',
      successCount: 89,
      failureCount: 3,
      avgResponseTime: 189,
      lastPayload: { transaction_id: 'TRX123457', amount: 25000, status: 'failed', reason: 'insufficient_funds' },
      lastResponse: { status: 200, message: 'Received' }
    },
    {
      id: 3,
      url: 'https://api.partner3.com/events',
      event: 'agent.registered',
      status: 'failed',
      lastTrigger: '2024-02-13 10:30:45',
      successCount: 456,
      failureCount: 45,
      avgResponseTime: 1250,
      lastPayload: { agent_id: 'AG001', name: 'Jean Mukiza', province: 'Bujumbura' },
      lastResponse: { status: 500, message: 'Internal Server Error' }
    },
    {
      id: 4,
      url: 'https://api.partner4.com/hooks/wallet',
      event: 'wallet.low_balance',
      status: 'active',
      lastTrigger: '2024-02-13 10:15:30',
      successCount: 234,
      failureCount: 8,
      avgResponseTime: 320,
      lastPayload: { wallet_id: 'WLT789', balance: 50000, threshold: 100000 },
      lastResponse: { status: 200, message: 'Alert received' }
    },
    {
      id: 5,
      url: 'https://api.partner5.com/notifications',
      event: 'kyc.verified',
      status: 'inactive',
      lastTrigger: '2024-02-12 18:20:10',
      successCount: 567,
      failureCount: 15,
      avgResponseTime: 280,
      lastPayload: { user_id: 'USR456', kyc_level: 2, verified_at: '2024-02-12T18:20:00Z' },
      lastResponse: { status: 200, message: 'Success' }
    }
  ];

  // Stats globales
  const globalStats = {
    totalWebhooks: webhooks.length,
    activeWebhooks: webhooks.filter(w => w.status === 'active').length,
    totalSuccess: webhooks.reduce((sum, w) => sum + w.successCount, 0),
    totalFailures: webhooks.reduce((sum, w) => sum + w.failureCount, 0),
    avgResponseTime: Math.round(webhooks.reduce((sum, w) => sum + w.avgResponseTime, 0) / webhooks.length)
  };

  const testWebhook = (webhook) => {
    setSelectedWebhook(webhook);
    setShowTestDialog(true);
  };

  const retryWebhook = (webhook) => {
    toast.current.show({
      severity: 'info',
      summary: 'Webhook relancé',
      detail: `Tentative de renvoi vers ${webhook.url}`,
      life: 3000
    });
  };

  const toggleWebhook = (webhook) => {
    toast.current.show({
      severity: 'info',
      summary: webhook.status === 'active' ? 'Webhook désactivé' : 'Webhook activé',
      detail: `${webhook.url} a été ${webhook.status === 'active' ? 'désactivé' : 'activé'}`,
      life: 3000
    });
  };

  const viewDetails = (webhook) => {
    setSelectedWebhook(webhook);
    setShowDetailDialog(true);
  };

  const statusBodyTemplate = (rowData) => {
    const severityMap = {
      active: 'success',
      failed: 'danger',
      inactive: 'warning'
    };
    const labelMap = {
      active: 'Actif',
      failed: 'Échoué',
      inactive: 'Inactif'
    };
    return <Tag value={labelMap[rowData.status]} severity={severityMap[rowData.status]} />;
  };

  const eventBodyTemplate = (rowData) => {
    return (
      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
        {rowData.event}
      </span>
    );
  };

  const successRateBodyTemplate = (rowData) => {
    const total = rowData.successCount + rowData.failureCount;
    const rate = (rowData.successCount / total * 100).toFixed(1);
    const isGood = rate >= 95;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
          <div
            className={`h-full ${isGood ? 'bg-green-500' : 'bg-secondary'}`}
            style={{ width: `${rate}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${isGood ? 'text-green-500' : 'text-secondary'}`}>
          {rate}%
        </span>
      </div>
    );
  };

  const responseTimeBodyTemplate = (rowData) => {
    const isHigh = rowData.avgResponseTime > 1000;
    const isMedium = rowData.avgResponseTime > 500 && rowData.avgResponseTime <= 1000;
    return (
      <span className={`font-bold ${isHigh ? 'text-danger' : isMedium ? 'text-secondary' : 'text-green-500'}`}>
        {rowData.avgResponseTime}ms
      </span>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => testWebhook(rowData)}
          className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
          title="Tester"
        >
          <Play size={16} />
        </button>
        <button
          onClick={() => retryWebhook(rowData)}
          className="p-2 bg-secondary/20 text-secondary hover:bg-secondary/30 rounded-lg transition-colors"
          title="Relancer"
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={() => toggleWebhook(rowData)}
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
          onClick={() => viewDetails(rowData)}
          className="p-2 bg-text/20 text-text hover:bg-text/30 rounded-lg transition-colors"
          title="Détails"
        >
          <Eye size={16} />
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
            Gestion des Webhooks
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Configuration et surveillance des intégrations externes
          </p>
        </div>
      </div>

      {/* 🟦 STATS GLOBALES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Webhook size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Total</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.totalWebhooks}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Actifs</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.activeWebhooks}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Succès</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.totalSuccess.toLocaleString()}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Échecs</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.totalFailures}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Temps Moy</div>
          </div>
          <div className="text-2xl font-bold text-text">{globalStats.avgResponseTime}ms</div>
        </div>
      </div>

      {/* 🟦 LISTE DES WEBHOOKS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Webhooks Configurés</h2>
        <DataTable
          value={webhooks}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="url"
            header="URL"
            sortable
            style={{ minWidth: '250px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text truncate block">{rowData.url}</span>
            )}
          />
          <Column
            field="event"
            header="Événement"
            body={eventBodyTemplate}
            sortable
            style={{ minWidth: '150px' }}
          />
          <Column
            field="status"
            header="Statut"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            header="Taux Succès"
            body={successRateBodyTemplate}
            style={{ minWidth: '150px' }}
          />
          <Column
            field="avgResponseTime"
            header="Temps Moy"
            body={responseTimeBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="lastTrigger"
            header="Dernier Envoi"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.lastTrigger}</span>
            )}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '180px' }}
          />
        </DataTable>
      </div>

      {/* DIALOG DÉTAILS */}
      <Dialog
        visible={showDetailDialog}
        onHide={() => setShowDetailDialog(false)}
        header="Détails du Webhook"
        style={{ width: '700px' }}
        className="bg-card"
      >
        {selectedWebhook && (
          <div className="space-y-4">
            <div className="border border-darkGray bg-background rounded-lg p-4">
              <h3 className="font-semibold text-text mb-3">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">URL:</span>
                  <span className="text-text font-mono text-xs">{selectedWebhook.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Événement:</span>
                  <span className="text-primary font-semibold">{selectedWebhook.event}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Statut:</span>
                  {statusBodyTemplate(selectedWebhook)}
                </div>
              </div>
            </div>

            <div className="border border-darkGray bg-background rounded-lg p-4">
              <h3 className="font-semibold text-text mb-3">Dernier Payload Envoyé</h3>
              <pre className="bg-card border border-darkGray rounded p-3 text-xs text-text overflow-x-auto">
                {JSON.stringify(selectedWebhook.lastPayload, null, 2)}
              </pre>
            </div>

            <div className="border border-darkGray bg-background rounded-lg p-4">
              <h3 className="font-semibold text-text mb-3">Dernière Réponse Reçue</h3>
              <pre className="bg-card border border-darkGray rounded p-3 text-xs text-text overflow-x-auto">
                {JSON.stringify(selectedWebhook.lastResponse, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-darkGray bg-background rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Succès</div>
                <div className="text-2xl font-bold text-green-500">{selectedWebhook.successCount}</div>
              </div>
              <div className="border border-darkGray bg-background rounded-lg p-4">
                <div className="text-xs text-gray-400 mb-1">Échecs</div>
                <div className="text-2xl font-bold text-danger">{selectedWebhook.failureCount}</div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* DIALOG TEST */}
      <Dialog
        visible={showTestDialog}
        onHide={() => setShowTestDialog(false)}
        header="Tester le Webhook"
        style={{ width: '600px' }}
        className="bg-card"
      >
        {selectedWebhook && (
          <div className="space-y-4">
            <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Send size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text mb-1">Test du webhook</h4>
                  <p className="text-sm text-gray-400">
                    Un payload de test sera envoyé à: <span className="font-mono text-xs">{selectedWebhook.url}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-darkGray bg-background rounded-lg p-4">
              <h3 className="font-semibold text-text mb-3">Payload de Test</h3>
              <pre className="bg-card border border-darkGray rounded p-3 text-xs text-text overflow-x-auto">
                {JSON.stringify({ test: true, event: selectedWebhook.event, timestamp: new Date().toISOString() }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTestDialog(false)}
                className="px-4 py-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.current.show({
                    severity: 'success',
                    summary: 'Test envoyé',
                    detail: 'Le webhook a été testé avec succès',
                    life: 3000
                  });
                  setShowTestDialog(false);
                }}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-colors"
              >
                Envoyer le test
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default Webhooks;

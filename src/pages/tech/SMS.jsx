import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import {
  MessageSquare, CheckCircle, XCircle, Send, Settings,
  Eye, Power, PowerOff, Edit, DollarSign, TrendingUp
} from 'lucide-react';

function SMS() {
  const toast = useRef(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Configuration SMS
  const smsConfig = {
    provider: 'Twilio',
    balance: 45678,
    sentToday: 1234,
    successRate: 98.5,
    failureRate: 1.5,
    costPerSMS: 25
  };

  // Templates SMS
  const smsTemplates = [
    {
      id: 1,
      name: 'Transaction Réussie',
      type: 'transaction.success',
      status: 'active',
      content: 'Votre transaction de {amount} BIF a été effectuée avec succès. Nouveau solde: {balance} BIF. Ref: {ref}',
      sentCount: 45678,
      successRate: 99.2
    },
    {
      id: 2,
      name: 'Transaction Échouée',
      type: 'transaction.failed',
      status: 'active',
      content: 'Votre transaction de {amount} BIF a échoué. Raison: {reason}. Contactez le support si nécessaire.',
      sentCount: 1234,
      successRate: 98.5
    },
    {
      id: 3,
      name: 'Code OTP',
      type: 'auth.otp',
      status: 'active',
      content: 'Votre code de vérification uFaranga est: {otp}. Valide pendant 5 minutes. Ne le partagez jamais.',
      sentCount: 23456,
      successRate: 99.8
    },
    {
      id: 4,
      name: 'Solde Faible',
      type: 'wallet.low_balance',
      status: 'active',
      content: 'Alerte: Votre solde est faible ({balance} BIF). Rechargez votre compte pour continuer à utiliser uFaranga.',
      sentCount: 3456,
      successRate: 97.5
    },
    {
      id: 5,
      name: 'Bienvenue',
      type: 'user.welcome',
      status: 'active',
      content: 'Bienvenue sur uFaranga! Votre compte a été créé avec succès. Téléchargez l\'app: ufaranga.bi/app',
      sentCount: 8901,
      successRate: 99.5
    },
    {
      id: 6,
      name: 'Maintenance',
      type: 'system.maintenance',
      status: 'inactive',
      content: 'uFaranga sera en maintenance le {date} de {start} à {end}. Merci de votre compréhension.',
      sentCount: 234,
      successRate: 98.0
    }
  ];

  // Historique récent
  const recentSMS = [
    {
      id: 1,
      phone: '+257 79 XXX XXX',
      type: 'transaction.success',
      status: 'delivered',
      sentAt: '2024-02-13 10:45:23',
      deliveredAt: '2024-02-13 10:45:25'
    },
    {
      id: 2,
      phone: '+257 79 XXX XXX',
      type: 'auth.otp',
      status: 'delivered',
      sentAt: '2024-02-13 10:44:18',
      deliveredAt: '2024-02-13 10:44:20'
    },
    {
      id: 3,
      phone: '+257 79 XXX XXX',
      type: 'transaction.success',
      status: 'failed',
      sentAt: '2024-02-13 10:43:45',
      deliveredAt: null
    },
    {
      id: 4,
      phone: '+257 79 XXX XXX',
      type: 'wallet.low_balance',
      status: 'delivered',
      sentAt: '2024-02-13 10:42:30',
      deliveredAt: '2024-02-13 10:42:32'
    },
    {
      id: 5,
      phone: '+257 79 XXX XXX',
      type: 'user.welcome',
      status: 'delivered',
      sentAt: '2024-02-13 10:40:15',
      deliveredAt: '2024-02-13 10:40:17'
    }
  ];

  const editTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
  };

  const toggleTemplate = (template) => {
    toast.current.show({
      severity: 'info',
      summary: template.status === 'active' ? 'Template désactivé' : 'Template activé',
      detail: `${template.name} a été ${template.status === 'active' ? 'désactivé' : 'activé'}`,
      life: 3000
    });
  };

  const statusBodyTemplate = (rowData) => {
    const severityMap = {
      active: 'success',
      inactive: 'warning'
    };
    const labelMap = {
      active: 'Actif',
      inactive: 'Inactif'
    };
    return <Tag value={labelMap[rowData.status]} severity={severityMap[rowData.status]} />;
  };

  const smsStatusBodyTemplate = (rowData) => {
    const severityMap = {
      delivered: 'success',
      failed: 'danger',
      pending: 'warning'
    };
    const labelMap = {
      delivered: 'Délivré',
      failed: 'Échoué',
      pending: 'En cours'
    };
    return <Tag value={labelMap[rowData.status]} severity={severityMap[rowData.status]} />;
  };

  const successRateBodyTemplate = (rowData) => {
    const isGood = rowData.successRate >= 98;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
          <div
            className={`h-full ${isGood ? 'bg-green-500' : 'bg-secondary'}`}
            style={{ width: `${rowData.successRate}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${isGood ? 'text-green-500' : 'text-secondary'}`}>
          {rowData.successRate}%
        </span>
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => editTemplate(rowData)}
          className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
          title="Modifier"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={() => toggleTemplate(rowData)}
          className={`p-2 rounded-lg transition-colors ${
            rowData.status === 'active'
              ? 'bg-danger/20 text-danger hover:bg-danger/30'
              : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
          }`}
          title={rowData.status === 'active' ? 'Désactiver' : 'Activer'}
        >
          {rowData.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
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
            Gestion SMS
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Configuration et surveillance des notifications SMS
          </p>
        </div>
      </div>

      {/* 🟦 STATS GLOBALES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Fournisseur</div>
          </div>
          <div className="text-2xl font-bold text-text">{smsConfig.provider}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Solde SMS</div>
          </div>
          <div className="text-2xl font-bold text-text">{smsConfig.balance.toLocaleString()}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Envoyés Aujourd'hui</div>
          </div>
          <div className="text-2xl font-bold text-text">{smsConfig.sentToday.toLocaleString()}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Taux Succès</div>
          </div>
          <div className="text-2xl font-bold text-text">{smsConfig.successRate}%</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Coût/SMS</div>
          </div>
          <div className="text-2xl font-bold text-text">{smsConfig.costPerSMS} BIF</div>
        </div>
      </div>

      {/* 🟦 TEMPLATES SMS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Templates SMS</h2>
        <DataTable
          value={smsTemplates}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="name"
            header="Nom"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="font-semibold text-text">{rowData.name}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                {rowData.type}
              </span>
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
            field="content"
            header="Contenu"
            style={{ minWidth: '300px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400 line-clamp-2">{rowData.content}</span>
            )}
          />
          <Column
            field="sentCount"
            header="Envoyés"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-text">{rowData.sentCount.toLocaleString()}</span>
            )}
          />
          <Column
            header="Taux Succès"
            body={successRateBodyTemplate}
            style={{ minWidth: '150px' }}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '120px' }}
          />
        </DataTable>
      </div>

      {/* 🟦 HISTORIQUE RÉCENT */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Historique Récent</h2>
        <DataTable
          value={recentSMS}
          responsiveLayout="scroll"
          className="text-sm"
          paginator
          rows={10}
        >
          <Column
            field="phone"
            header="Téléphone"
            style={{ minWidth: '130px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text">{rowData.phone}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
                {rowData.type}
              </span>
            )}
          />
          <Column
            field="status"
            header="Statut"
            body={smsStatusBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="sentAt"
            header="Envoyé à"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.sentAt}</span>
            )}
          />
          <Column
            field="deliveredAt"
            header="Délivré à"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.deliveredAt || '-'}</span>
            )}
          />
        </DataTable>
      </div>

      {/* DIALOG MODIFIER TEMPLATE */}
      <Dialog
        visible={showTemplateDialog}
        onHide={() => setShowTemplateDialog(false)}
        header="Modifier le Template SMS"
        style={{ width: '700px' }}
        className="bg-card"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Nom du Template</label>
              <input
                type="text"
                defaultValue={selectedTemplate.name}
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Type</label>
              <input
                type="text"
                defaultValue={selectedTemplate.type}
                disabled
                className="w-full px-4 py-2 bg-darkGray border border-darkGray rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Contenu</label>
              <textarea
                rows={4}
                defaultValue={selectedTemplate.content}
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-2">
                Variables disponibles: {'{amount}'}, {'{balance}'}, {'{ref}'}, {'{otp}'}, {'{reason}'}, {'{date}'}, {'{start}'}, {'{end}'}
              </p>
            </div>

            <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
              <h4 className="font-semibold text-text mb-2">Aperçu</h4>
              <p className="text-sm text-gray-300">
                {selectedTemplate.content.replace(/{(\w+)}/g, '[VALEUR]')}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateDialog(false)}
                className="px-4 py-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  toast.current.show({
                    severity: 'success',
                    summary: 'Template modifié',
                    detail: 'Le template SMS a été mis à jour',
                    life: 3000
                  });
                  setShowTemplateDialog(false);
                }}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default SMS;

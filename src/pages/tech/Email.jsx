import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import {
  Mail, CheckCircle, XCircle, Send, Settings,
  Eye, Power, PowerOff, Edit, TrendingUp, AlertTriangle
} from 'lucide-react';

function Email() {
  const toast = useRef(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Configuration Email
  const emailConfig = {
    provider: 'SendGrid',
    sentToday: 892,
    deliveryRate: 97.8,
    bounceRate: 1.2,
    openRate: 45.6,
    clickRate: 12.3
  };

  // Templates Email
  const emailTemplates = [
    {
      id: 1,
      name: 'Confirmation Transaction',
      subject: 'Transaction effectuée - uFaranga',
      type: 'transaction.confirmation',
      status: 'active',
      sentCount: 12345,
      openRate: 52.3,
      clickRate: 15.8
    },
    {
      id: 2,
      name: 'Bienvenue',
      subject: 'Bienvenue sur uFaranga!',
      type: 'user.welcome',
      status: 'active',
      sentCount: 3456,
      openRate: 68.9,
      clickRate: 28.4
    },
    {
      id: 3,
      name: 'Réinitialisation Mot de Passe',
      subject: 'Réinitialiser votre mot de passe',
      type: 'auth.password_reset',
      status: 'active',
      sentCount: 1234,
      openRate: 78.5,
      clickRate: 65.2
    },
    {
      id: 4,
      name: 'Relevé Mensuel',
      subject: 'Votre relevé mensuel uFaranga',
      type: 'report.monthly',
      status: 'active',
      sentCount: 8901,
      openRate: 42.1,
      clickRate: 8.9
    },
    {
      id: 5,
      name: 'Alerte Sécurité',
      subject: 'Activité inhabituelle détectée',
      type: 'security.alert',
      status: 'active',
      sentCount: 234,
      openRate: 89.3,
      clickRate: 45.6
    },
    {
      id: 6,
      name: 'Maintenance Programmée',
      subject: 'Maintenance système - uFaranga',
      type: 'system.maintenance',
      status: 'inactive',
      sentCount: 156,
      openRate: 35.2,
      clickRate: 5.1
    }
  ];

  // Historique récent
  const recentEmails = [
    {
      id: 1,
      email: 'user@example.com',
      subject: 'Transaction effectuée - uFaranga',
      type: 'transaction.confirmation',
      status: 'delivered',
      sentAt: '2024-02-13 10:45:23',
      openedAt: '2024-02-13 10:47:15'
    },
    {
      id: 2,
      email: 'agent@example.com',
      subject: 'Votre relevé mensuel uFaranga',
      type: 'report.monthly',
      status: 'delivered',
      sentAt: '2024-02-13 10:30:18',
      openedAt: null
    },
    {
      id: 3,
      email: 'client@example.com',
      subject: 'Bienvenue sur uFaranga!',
      type: 'user.welcome',
      status: 'bounced',
      sentAt: '2024-02-13 10:15:45',
      openedAt: null
    },
    {
      id: 4,
      email: 'support@example.com',
      subject: 'Activité inhabituelle détectée',
      type: 'security.alert',
      status: 'delivered',
      sentAt: '2024-02-13 09:58:30',
      openedAt: '2024-02-13 10:02:12'
    },
    {
      id: 5,
      email: 'admin@example.com',
      subject: 'Réinitialiser votre mot de passe',
      type: 'auth.password_reset',
      status: 'delivered',
      sentAt: '2024-02-13 09:42:15',
      openedAt: '2024-02-13 09:43:20'
    }
  ];

  const editTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDialog(true);
  };

  const testTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTestDialog(true);
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

  const emailStatusBodyTemplate = (rowData) => {
    const severityMap = {
      delivered: 'success',
      bounced: 'danger',
      pending: 'warning'
    };
    const labelMap = {
      delivered: 'Délivré',
      bounced: 'Rejeté',
      pending: 'En cours'
    };
    return <Tag value={labelMap[rowData.status]} severity={severityMap[rowData.status]} />;
  };

  const rateBodyTemplate = (rowData, field) => {
    const value = rowData[field];
    const isGood = value >= 50;
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
          <div
            className={`h-full ${isGood ? 'bg-green-500' : 'bg-secondary'}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${isGood ? 'text-green-500' : 'text-secondary'}`}>
          {value}%
        </span>
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => testTemplate(rowData)}
          className="p-2 bg-secondary/20 text-secondary hover:bg-secondary/30 rounded-lg transition-colors"
          title="Tester"
        >
          <Send size={16} />
        </button>
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
            Gestion Email
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Configuration et surveillance des emails système
          </p>
        </div>
      </div>

      {/* 🟦 STATS GLOBALES */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Fournisseur</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.provider}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Envoyés</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.sentToday}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={18} className="text-green-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Délivrabilité</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.deliveryRate}%</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Bounce Rate</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.bounceRate}%</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Taux Ouverture</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.openRate}%</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Taux Clic</div>
          </div>
          <div className="text-2xl font-bold text-text">{emailConfig.clickRate}%</div>
        </div>
      </div>

      {/* 🟦 TEMPLATES EMAIL */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Templates Email</h2>
        <DataTable
          value={emailTemplates}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="name"
            header="Nom"
            sortable
            style={{ minWidth: '180px' }}
            body={(rowData) => (
              <span className="font-semibold text-text">{rowData.name}</span>
            )}
          />
          <Column
            field="subject"
            header="Sujet"
            sortable
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-300">{rowData.subject}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            sortable
            style={{ minWidth: '180px' }}
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
            field="sentCount"
            header="Envoyés"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-text">{rowData.sentCount.toLocaleString()}</span>
            )}
          />
          <Column
            header="Taux Ouverture"
            body={(rowData) => rateBodyTemplate(rowData, 'openRate')}
            style={{ minWidth: '150px' }}
          />
          <Column
            header="Taux Clic"
            body={(rowData) => rateBodyTemplate(rowData, 'clickRate')}
            style={{ minWidth: '150px' }}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '150px' }}
          />
        </DataTable>
      </div>

      {/* 🟦 HISTORIQUE RÉCENT */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Historique Récent</h2>
        <DataTable
          value={recentEmails}
          responsiveLayout="scroll"
          className="text-sm"
          paginator
          rows={10}
        >
          <Column
            field="email"
            header="Email"
            style={{ minWidth: '180px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-text">{rowData.email}</span>
            )}
          />
          <Column
            field="subject"
            header="Sujet"
            sortable
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <span className="text-sm text-gray-300">{rowData.subject}</span>
            )}
          />
          <Column
            field="type"
            header="Type"
            sortable
            style={{ minWidth: '180px' }}
            body={(rowData) => (
              <span className="px-2 py-1 bg-secondary/20 text-secondary rounded text-xs font-semibold">
                {rowData.type}
              </span>
            )}
          />
          <Column
            field="status"
            header="Statut"
            body={emailStatusBodyTemplate}
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
            field="openedAt"
            header="Ouvert à"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-xs text-gray-400">{rowData.openedAt || '-'}</span>
            )}
          />
        </DataTable>
      </div>

      {/* DIALOG MODIFIER TEMPLATE */}
      <Dialog
        visible={showTemplateDialog}
        onHide={() => setShowTemplateDialog(false)}
        header="Modifier le Template Email"
        style={{ width: '800px' }}
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
              <label className="block text-sm font-semibold text-text mb-2">Sujet</label>
              <input
                type="text"
                defaultValue={selectedTemplate.subject}
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
              <label className="block text-sm font-semibold text-text mb-2">Contenu HTML</label>
              <textarea
                rows={8}
                placeholder="<html>...</html>"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-2">
                Variables disponibles: {'{user_name}'}, {'{amount}'}, {'{transaction_id}'}, {'{date}'}, {'{link}'}
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
                    detail: 'Le template email a été mis à jour',
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

      {/* DIALOG TEST */}
      <Dialog
        visible={showTestDialog}
        onHide={() => setShowTestDialog(false)}
        header="Tester le Template Email"
        style={{ width: '500px' }}
        className="bg-card"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Send size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-text mb-1">Test d'envoi</h4>
                  <p className="text-sm text-gray-400">
                    Un email de test sera envoyé avec le template: {selectedTemplate.name}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-text mb-2">Email de destination</label>
              <input
                type="email"
                placeholder="test@example.com"
                className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
              />
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
                    summary: 'Email envoyé',
                    detail: 'L\'email de test a été envoyé avec succès',
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

export default Email;

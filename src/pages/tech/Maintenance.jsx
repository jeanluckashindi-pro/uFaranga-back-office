import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import {
  Wrench, Power, Clock, AlertTriangle, CheckCircle,
  Plus, Edit, Trash2, Send
} from 'lucide-react';

function Maintenance() {
  const toast = useRef(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  // Services impactés
  const services = [
    { id: 1, name: 'API Transactions', selected: true },
    { id: 2, name: 'API Paiement', selected: true },
    { id: 3, name: 'SMS Gateway', selected: false },
    { id: 4, name: 'Email Service', selected: false },
    { id: 5, name: 'Webhooks', selected: true },
    { id: 6, name: 'Mobile App', selected: true }
  ];

  // Message de maintenance
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'uFaranga est actuellement en maintenance. Nous serons de retour très bientôt. Merci de votre patience.'
  );

  // Historique des maintenances
  const maintenanceHistory = [
    {
      id: 1,
      title: 'Mise à jour base de données',
      startDate: '2024-02-10 02:00',
      endDate: '2024-02-10 04:30',
      duration: '2h 30min',
      status: 'completed',
      services: ['API Transactions', 'API Paiement'],
      notified: 1234
    },
    {
      id: 2,
      title: 'Migration serveurs',
      startDate: '2024-02-05 01:00',
      endDate: '2024-02-05 05:00',
      duration: '4h',
      status: 'completed',
      services: ['Tous les services'],
      notified: 5678
    },
    {
      id: 3,
      title: 'Optimisation performances',
      startDate: '2024-01-28 03:00',
      endDate: '2024-01-28 04:15',
      duration: '1h 15min',
      status: 'completed',
      services: ['API Transactions', 'Webhooks'],
      notified: 892
    },
    {
      id: 4,
      title: 'Mise à jour sécurité',
      startDate: '2024-02-15 02:00',
      endDate: '2024-02-15 03:30',
      duration: '1h 30min',
      status: 'scheduled',
      services: ['Tous les services'],
      notified: 0
    }
  ];

  const toggleMaintenanceMode = () => {
    setMaintenanceMode(!maintenanceMode);
    toast.current.show({
      severity: maintenanceMode ? 'info' : 'warning',
      summary: maintenanceMode ? 'Mode maintenance désactivé' : 'Mode maintenance activé',
      detail: maintenanceMode
        ? 'Les services sont à nouveau accessibles'
        : 'Les services sélectionnés sont maintenant inaccessibles',
      life: 3000
    });
  };

  const scheduleMaintenance = () => {
    setSelectedMaintenance(null);
    setShowScheduleDialog(true);
  };

  const editMaintenance = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowScheduleDialog(true);
  };

  const deleteMaintenance = (maintenance) => {
    toast.current.show({
      severity: 'success',
      summary: 'Maintenance supprimée',
      detail: `La maintenance "${maintenance.title}" a été supprimée`,
      life: 3000
    });
  };

  const notifyUsers = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Notifications envoyées',
      detail: 'Les agents et clients ont été notifiés de la maintenance',
      life: 3000
    });
  };

  const statusBodyTemplate = (rowData) => {
    const severityMap = {
      completed: 'success',
      scheduled: 'info',
      cancelled: 'danger'
    };
    const labelMap = {
      completed: 'Terminée',
      scheduled: 'Programmée',
      cancelled: 'Annulée'
    };
    return <Tag value={labelMap[rowData.status]} severity={severityMap[rowData.status]} />;
  };

  const servicesBodyTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">
        {rowData.services.map((service, idx) => (
          <span key={idx} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
            {service}
          </span>
        ))}
      </div>
    );
  };

  const actionsBodyTemplate = (rowData) => {
    if (rowData.status === 'scheduled') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => editMaintenance(rowData)}
            className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => deleteMaintenance(rowData)}
            className="p-2 bg-danger/20 text-danger hover:bg-danger/30 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }
    return <span className="text-xs text-gray-400">-</span>;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Gestion Maintenance
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Planification et gestion des interruptions de service
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={scheduleMaintenance}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
          >
            <Plus size={18} />
            Programmer
          </button>
        </div>
      </div>

      {/* 🟦 MODE MAINTENANCE ACTUEL */}
      <div className={`border rounded-lg p-6 ${
        maintenanceMode
          ? 'bg-secondary/10 border-secondary/30'
          : 'bg-green-500/10 border-green-500/30'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {maintenanceMode ? (
              <AlertTriangle size={48} className="text-secondary" />
            ) : (
              <CheckCircle size={48} className="text-green-500" />
            )}
            <div>
              <h2 className="text-2xl font-anton uppercase text-text">
                Mode Maintenance: {maintenanceMode ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {maintenanceMode
                  ? 'Les services sélectionnés sont actuellement inaccessibles'
                  : 'Tous les services fonctionnent normalement'}
              </p>
            </div>
          </div>
          <button
            onClick={toggleMaintenanceMode}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              maintenanceMode
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-secondary text-white hover:bg-secondary/90'
            }`}
          >
            <Power size={20} />
            {maintenanceMode ? 'Désactiver' : 'Activer'}
          </button>
        </div>

        {maintenanceMode && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Services Impactés</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center gap-2 p-3 border border-darkGray bg-background rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={service.selected}
                      onChange={() => {}}
                      className="w-4 h-4 text-primary bg-darkGray border-darkGray rounded focus:ring-primary"
                    />
                    <span className="text-sm text-text">{service.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-text mb-3">Message Affiché</h3>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={notifyUsers}
                className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
              >
                <Send size={18} />
                Notifier les utilisateurs
              </button>
              <p className="text-xs text-gray-400">
                Envoyer une notification à tous les agents et clients
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 🟦 HISTORIQUE DES MAINTENANCES */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Historique des Maintenances</h2>
        <DataTable
          value={maintenanceHistory}
          responsiveLayout="scroll"
          className="text-sm"
        >
          <Column
            field="title"
            header="Titre"
            sortable
            style={{ minWidth: '200px' }}
            body={(rowData) => (
              <span className="font-semibold text-text">{rowData.title}</span>
            )}
          />
          <Column
            field="startDate"
            header="Début"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">{rowData.startDate}</span>
              </div>
            )}
          />
          <Column
            field="endDate"
            header="Fin"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">{rowData.endDate}</span>
              </div>
            )}
          />
          <Column
            field="duration"
            header="Durée"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-secondary">{rowData.duration}</span>
            )}
          />
          <Column
            field="status"
            header="Statut"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            header="Services"
            body={servicesBodyTemplate}
            style={{ minWidth: '250px' }}
          />
          <Column
            field="notified"
            header="Notifiés"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-bold text-text">
                {rowData.notified > 0 ? rowData.notified.toLocaleString() : '-'}
              </span>
            )}
          />
          <Column
            header="Actions"
            body={actionsBodyTemplate}
            style={{ minWidth: '120px' }}
          />
        </DataTable>
      </div>

      {/* DIALOG PROGRAMMER MAINTENANCE */}
      <Dialog
        visible={showScheduleDialog}
        onHide={() => setShowScheduleDialog(false)}
        header={selectedMaintenance ? 'Modifier la Maintenance' : 'Programmer une Maintenance'}
        style={{ width: '700px' }}
        className="bg-card"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-2">Titre</label>
            <input
              type="text"
              placeholder="Ex: Mise à jour base de données"
              defaultValue={selectedMaintenance?.title}
              className="w-full px-4 py-2 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Date/Heure Début</label>
              <Calendar
                showTime
                hourFormat="24"
                placeholder="Sélectionner"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-2">Date/Heure Fin</label>
              <Calendar
                showTime
                hourFormat="24"
                placeholder="Sélectionner"
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-3">Services Impactés</label>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <label
                  key={service.id}
                  className="flex items-center gap-2 p-3 border border-darkGray bg-background rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked={service.selected}
                    className="w-4 h-4 text-primary bg-darkGray border-darkGray rounded focus:ring-primary"
                  />
                  <span className="text-sm text-text">{service.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text mb-2">Message de Maintenance</label>
            <textarea
              rows={3}
              placeholder="Message qui sera affiché aux utilisateurs..."
              defaultValue={maintenanceMessage}
              className="w-full px-4 py-3 bg-background border border-darkGray rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          <div className="border border-primary/30 bg-primary/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-text mb-1">Notification Automatique</h4>
                <p className="text-sm text-gray-400">
                  Les agents et clients seront automatiquement notifiés 24h avant le début de la maintenance
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowScheduleDialog(false)}
              className="px-4 py-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                toast.current.show({
                  severity: 'success',
                  summary: 'Maintenance programmée',
                  detail: 'La maintenance a été programmée avec succès',
                  life: 3000
                });
                setShowScheduleDialog(false);
              }}
              className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold transition-colors"
            >
              {selectedMaintenance ? 'Modifier' : 'Programmer'}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Maintenance;

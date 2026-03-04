import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import {
  Bell, AlertTriangle, CheckCircle, DollarSign, Wallet,
  XCircle, Clock, Info, Shield, Server, Eye, Archive,
  Filter, RefreshCw, Volume2, AlertCircle, TrendingDown,
  User, Settings, Zap, Activity, TrendingUp
} from 'lucide-react';

function Notifications() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const dt = useRef(null);

  const categories = [
    { label: 'Toutes', value: 'all' },
    { label: 'Float', value: 'float' },
    { label: 'Transactions', value: 'transaction' },
    { label: 'Commissions', value: 'commission' },
    { label: 'Supervision', value: 'supervision' },
    { label: 'Système', value: 'system' }
  ];

  const priorities = [
    { label: 'Toutes', value: 'all' },
    { label: 'Critique', value: 'critical' },
    { label: 'Normal', value: 'normal' },
    { label: 'Info', value: 'info' }
  ];

  // DONNÉES - Notifications
  const notifications = [
    {
      id: 'NOT-2024-001',
      time: '2024-02-12 09:10:22',
      category: 'float',
      priority: 'critical',
      title: 'Float critique',
      message: 'Votre float est à 20,000 FC. Seuil critique atteint.',
      detail: 'Montant actuel: 20,000 FC | Seuil: 50,000 FC',
      action: 'Demander réapprovisionnement',
      status: 'unread',
      icon: AlertTriangle,
      color: '#ef4444'
    },
    {
      id: 'NOT-2024-002',
      time: '2024-02-12 09:30:15',
      category: 'transaction',
      priority: 'critical',
      title: 'Transaction échouée',
      message: 'Transaction de 100,000 FC échouée - PIN incorrect',
      detail: 'Client: +257 79 123 456 | Code: ERR_PIN_INVALID',
      action: 'Voir transaction',
      status: 'unread',
      icon: XCircle,
      color: '#ef4444'
    },
    {
      id: 'NOT-2024-003',
      time: '2024-02-12 10:15:45',
      category: 'float',
      priority: 'normal',
      title: 'Réapprovisionnement validé',
      message: 'Votre demande de réapprovisionnement a été approuvée',
      detail: 'Montant: 50,000 FC | Nouveau solde: 70,000 FC',
      action: 'Voir détails',
      status: 'read',
      icon: CheckCircle,
      color: '#10b981'
    },
    {
      id: 'NOT-2024-004',
      time: '2024-02-12 12:00:30',
      category: 'commission',
      priority: 'normal',
      title: 'Commission validée',
      message: 'Commission de 1,500 FC créditée sur votre wallet',
      detail: 'Transaction: TRX-20240212-5678 | Type: Dépôt',
      action: 'Voir commission',
      status: 'read',
      icon: DollarSign,
      color: '#10b981'
    },
    {
      id: 'NOT-2024-005',
      time: '2024-02-12 14:20:10',
      category: 'supervision',
      priority: 'normal',
      title: 'Message du superviseur',
      message: 'Vérifiez vos ventes de la journée avant 17h',
      detail: 'De: Jean Superviseur | Priorité: Normale',
      action: 'Lire message',
      status: 'unread',
      icon: User,
      color: '#007BFF'
    },
    {
      id: 'NOT-2024-006',
      time: '2024-02-12 15:45:00',
      category: 'transaction',
      priority: 'normal',
      title: 'Transaction en attente',
      message: '3 transactions en attente de validation',
      detail: 'Total: 250,000 FC | Délai: 2h',
      action: 'Voir transactions',
      status: 'unread',
      icon: Clock,
      color: '#F58424'
    },
    {
      id: 'NOT-2024-007',
      time: '2024-02-12 16:30:25',
      category: 'system',
      priority: 'info',
      title: 'Maintenance programmée',
      message: 'Maintenance serveur prévue ce soir à 22h',
      detail: 'Durée estimée: 30 minutes | Impact: Minimal',
      action: 'Plus d\'infos',
      status: 'read',
      icon: Server,
      color: '#9CA3AF'
    },
    {
      id: 'NOT-2024-008',
      time: '2024-02-12 08:15:00',
      category: 'float',
      priority: 'normal',
      title: 'Float faible',
      message: 'Votre float approche du seuil minimum',
      detail: 'Montant actuel: 45,000 FC | Seuil: 50,000 FC',
      action: 'Voir float',
      status: 'read',
      icon: TrendingDown,
      color: '#F58424'
    },
    {
      id: 'NOT-2024-009',
      time: '2024-02-12 07:30:00',
      category: 'commission',
      priority: 'info',
      title: 'Rapport mensuel disponible',
      message: 'Votre rapport de commissions de janvier est prêt',
      detail: 'Total: 58,500 FC | Téléchargement disponible',
      action: 'Télécharger',
      status: 'read',
      icon: DollarSign,
      color: '#10b981'
    },
    {
      id: 'NOT-2024-010',
      time: '2024-02-11 18:45:00',
      category: 'supervision',
      priority: 'normal',
      title: 'Nouvelle procédure KYC',
      message: 'Mise à jour des règles de vérification client',
      detail: 'Effectif: 15 février 2024 | Formation obligatoire',
      action: 'Voir procédure',
      status: 'read',
      icon: Shield,
      color: '#007BFF'
    }
  ];

  // Statistiques
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => n.status === 'unread').length,
    critical: notifications.filter(n => n.priority === 'critical').length,
    today: notifications.filter(n => {
      const notifDate = new Date(n.time);
      const today = new Date();
      return notifDate.toDateString() === today.toDateString();
    }).length
  };

  // Filtrage
  const filteredNotifications = notifications.filter(notif => {
    const matchCategory = selectedCategory === 'all' || notif.category === selectedCategory;
    const matchPriority = selectedPriority === 'all' || notif.priority === selectedPriority;
    return matchCategory && matchPriority;
  });

  // Notifications critiques non lues
  const criticalUnread = filteredNotifications.filter(n => n.priority === 'critical' && n.status === 'unread');


  // Templates de colonnes
  const timeTemplate = (rowData) => {
    const date = new Date(rowData.time);
    const isToday = date.toDateString() === new Date().toDateString();
    return (
      <div>
        <div className="font-semibold text-text">
          {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-xs text-gray-400">
          {isToday ? "Aujourd'hui" : date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
        </div>
      </div>
    );
  };

  const categoryTemplate = (rowData) => {
    const Icon = rowData.icon;
    return (
      <div className="flex items-center gap-2">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${rowData.color}20` }}
        >
          <Icon size={18} style={{ color: rowData.color }} />
        </div>
      </div>
    );
  };

  const priorityTemplate = (rowData) => {
    const config = {
      critical: { label: 'Critique', severity: 'danger' },
      normal: { label: 'Normal', severity: 'warning' },
      info: { label: 'Info', severity: 'info' }
    };
    const priorityConfig = config[rowData.priority];
    return <Tag value={priorityConfig.label} severity={priorityConfig.severity} />;
  };

  const messageTemplate = (rowData) => {
    return (
      <div>
        <div className="font-bold text-text mb-1 flex items-center gap-2">
          {rowData.title}
          {rowData.status === 'unread' && (
            <Badge value="Nouveau" severity="danger" />
          )}
        </div>
        <div className="text-sm text-gray-400 mb-1">{rowData.message}</div>
        <div className="text-xs text-gray-500 font-mono">{rowData.detail}</div>
      </div>
    );
  };

  const actionTemplate = (rowData) => {
    return (
      <div className="flex items-center gap-2">
        <Button 
          icon={<Eye size={16} />} 
          label={rowData.action}
          size="small"
          outlined
          severity="info"
        />
      </div>
    );
  };

  const statusTemplate = (rowData) => {
    if (rowData.status === 'unread') {
      return (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
          <span className="text-secondary font-semibold text-sm">Non lu</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-gray-400" />
        <span className="text-gray-400 text-sm">Lu</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Centre de Notifications
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            {stats.total} notifications • {stats.unread} non lues • {stats.critical} critiques
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="p-2 hover:bg-card rounded-lg transition-colors" title="Rafraîchir">
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-text" />
          </button>
          <Button 
            label="Marquer tout lu" 
            icon={<CheckCircle className="w-4 h-4 mr-2" />}
            className="bg-text text-background hover:bg-lightGray px-4 py-2 rounded-lg font-semibold whitespace-nowrap"
          />
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total notifications */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Total Notifications
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400 mb-2">Toutes périodes</p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <Activity className="w-4 h-4" />
            <span>Temps réel</span>
          </div>
        </div>

        {/* Non lues */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Non Lues
            </p>
          </div>
          <p className="text-3xl font-bold text-secondary mb-1">{stats.unread}</p>
          <p className="text-sm text-gray-400 mb-2">À traiter</p>
          <div className="flex items-center gap-1 text-secondary text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Action requise</span>
          </div>
        </div>

        {/* Critiques */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Critiques
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{stats.critical}</p>
          <p className="text-sm text-gray-400 mb-2">Urgentes</p>
          <div className="flex items-center gap-1 text-red-500 text-sm">
            <Zap className="w-4 h-4" />
            <span>Priorité haute</span>
          </div>
        </div>

        {/* Aujourd'hui */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Aujourd'hui
            </p>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{stats.today}</p>
          <p className="text-sm text-gray-400 mb-2">Reçues</p>
          <div className="flex items-center gap-1 text-primary text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>24h</span>
          </div>
        </div>
      </div>


      {/* ALERTES CRITIQUES - Si présentes */}
      {criticalUnread.length > 0 && (
        <div className="border-2 border-red-500 bg-card rounded-lg p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-anton uppercase text-text mb-1 flex items-center gap-2">
                Alertes Critiques
                <Badge value={criticalUnread.length} severity="danger" />
              </h3>
              <p className="text-sm text-gray-400">
                Actions urgentes requises - Veuillez traiter immédiatement
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            {criticalUnread.map((notif) => {
              const Icon = notif.icon;
              return (
                <div 
                  key={notif.id}
                  className="border border-darkGray bg-background rounded-lg p-4 hover:border-red-500 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${notif.color}20` }}
                    >
                      <Icon size={24} style={{ color: notif.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-text text-base">{notif.title}</h4>
                          <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                          {new Date(notif.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="p-2 bg-darkGray rounded text-xs text-gray-400 font-mono mb-3">
                        {notif.detail}
                      </div>
                      <Button 
                        label={notif.action}
                        icon={<Eye size={16} className="mr-2" />}
                        severity="danger"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTRES */}
      <div className="border border-darkGray bg-card rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            <span className="font-semibold text-text">Filtrer :</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Catégorie:</span>
            <Dropdown
              value={selectedCategory}
              options={categories}
              onChange={(e) => setSelectedCategory(e.value)}
              className="w-40"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Priorité:</span>
            <Dropdown
              value={selectedPriority}
              options={priorities}
              onChange={(e) => setSelectedPriority(e.value)}
              className="w-40"
            />
          </div>
        </div>
      </div>

      {/* TABLE DES NOTIFICATIONS */}
      <div className="border border-darkGray bg-card rounded-lg p-4 md:p-6 min-w-0 overflow-hidden">
        <h3 className="text-base md:text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          Toutes les Notifications
        </h3>

        <DataTable 
          ref={dt}
          value={filteredNotifications}
          paginator 
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          dataKey="id"
          emptyMessage="Aucune notification trouvée"
          className="text-sm"
          stripedRows
          responsiveLayout="scroll"
          rowClassName={(data) => data.status === 'unread' ? 'bg-primary/5' : ''}
        >
          <Column 
            field="time" 
            header="Heure" 
            sortable 
            body={timeTemplate}
            style={{ minWidth: '100px' }}
          />
          <Column 
            header="Type" 
            body={categoryTemplate}
            style={{ width: '80px' }}
          />
          <Column 
            field="priority" 
            header="Priorité" 
            sortable 
            body={priorityTemplate}
            style={{ minWidth: '110px' }}
          />
          <Column 
            field="message" 
            header="Message" 
            body={messageTemplate}
            style={{ minWidth: '350px' }}
          />
          <Column 
            field="status" 
            header="Statut" 
            sortable 
            body={statusTemplate}
            style={{ minWidth: '100px' }}
          />
          <Column 
            header="Actions" 
            body={actionTemplate}
            style={{ minWidth: '180px' }}
          />
        </DataTable>
      </div>

      {/* CATÉGORIES - Statistiques visuelles */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h3 className="text-lg font-anton uppercase text-text mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Répartition par Catégorie
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Float */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#343A40"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#F58424"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(notifications.filter(n => n.category === 'float').length / notifications.length) * 226} 226`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wallet size={24} className="text-secondary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              {notifications.filter(n => n.category === 'float').length}
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Float</div>
          </div>

          {/* Transactions */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#343A40"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#ef4444"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(notifications.filter(n => n.category === 'transaction').length / notifications.length) * 226} 226`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <XCircle size={24} className="text-red-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              {notifications.filter(n => n.category === 'transaction').length}
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Transactions</div>
          </div>

          {/* Commissions */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#343A40"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(notifications.filter(n => n.category === 'commission').length / notifications.length) * 226} 226`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <DollarSign size={24} className="text-green-500" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              {notifications.filter(n => n.category === 'commission').length}
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Commissions</div>
          </div>

          {/* Supervision */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#343A40"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#007BFF"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(notifications.filter(n => n.category === 'supervision').length / notifications.length) * 226} 226`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              {notifications.filter(n => n.category === 'supervision').length}
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Supervision</div>
          </div>

          {/* Système */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#343A40"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#9CA3AF"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(notifications.filter(n => n.category === 'system').length / notifications.length) * 226} 226`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Server size={24} className="text-gray-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              {notifications.filter(n => n.category === 'system').length}
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Système</div>
          </div>

          {/* Règles */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <div className="w-20 h-20 rounded-full border-8 border-darkGray flex items-center justify-center">
                <Shield size={24} className="text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold text-text mb-1">
              <CheckCircle size={24} className="text-green-500 inline" />
            </div>
            <div className="text-xs text-gray-400 uppercase font-semibold">Conforme</div>
          </div>
        </div>
      </div>

      {/* RÈGLES & CONFORMITÉ */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield size={28} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-anton uppercase text-text mb-1">
              Règles de Notification
            </h3>
            <p className="text-sm text-gray-400">
              Conformité bancaire et traçabilité complète
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-darkGray bg-background rounded-lg hover:border-primary transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Aucune suppression</h4>
                <p className="text-sm text-gray-400">
                  Toutes les notifications sont conservées de manière permanente pour audit
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg hover:border-primary transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Horodatage complet</h4>
                <p className="text-sm text-gray-400">
                  Chaque notification est horodatée avec précision au moment de sa création
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg hover:border-primary transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Archive size={20} className="text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-text mb-1">Historique auditable</h4>
                <p className="text-sm text-gray-400">
                  Accès complet à l'historique pour contrôle interne et audit externe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;

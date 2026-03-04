import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import {
  FileText, AlertTriangle, Info, XCircle, Download,
  Search, Filter, RefreshCw
} from 'lucide-react';

function Logs() {
  const toast = useRef(null);
  const dt = useRef(null);
  const [logType, setLogType] = useState('all');
  const [logLevel, setLogLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState(null);

  const logTypes = [
    { label: 'Tous les logs', value: 'all' },
    { label: 'Logs Système', value: 'system' },
    { label: 'Logs API', value: 'api' },
    { label: 'Logs Transactions', value: 'transaction' },
    { label: 'Logs Sécurité', value: 'security' }
  ];

  const logLevels = [
    { label: 'Tous les niveaux', value: 'all' },
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Critical', value: 'critical' }
  ];

  // Logs simulés
  const logs = [
    {
      id: 1,
      timestamp: '2024-02-13 10:45:23.456',
      level: 'info',
      type: 'api',
      source: 'API Gateway',
      message: 'POST /api/v1/transactions - 200 OK - 45ms',
      user: 'AG001',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: '2024-02-13 10:45:18.234',
      level: 'warning',
      type: 'transaction',
      source: 'Transaction Service',
      message: 'Transaction timeout warning - TRX123456 - Retrying...',
      user: 'USR456',
      ip: '192.168.1.105'
    },
    {
      id: 3,
      timestamp: '2024-02-13 10:45:15.789',
      level: 'error',
      type: 'api',
      source: 'Webhook Service',
      message: 'Failed to deliver webhook to https://api.partner3.com/events - 500 Internal Server Error',
      user: 'SYSTEM',
      ip: '10.0.0.1'
    },
    {
      id: 4,
      timestamp: '2024-02-13 10:45:10.123',
      level: 'critical',
      type: 'security',
      source: 'Auth Service',
      message: 'Multiple failed login attempts detected from IP 45.67.89.123 - Account locked',
      user: 'USR789',
      ip: '45.67.89.123'
    },
    {
      id: 5,
      timestamp: '2024-02-13 10:45:05.567',
      level: 'info',
      type: 'system',
      source: 'Database',
      message: 'Database connection pool resized - New size: 50 connections',
      user: 'SYSTEM',
      ip: '10.0.0.2'
    },
    {
      id: 6,
      timestamp: '2024-02-13 10:44:58.890',
      level: 'warning',
      type: 'transaction',
      source: 'Transaction Service',
      message: 'Low balance warning for wallet WLT789 - Current: 50,000 BIF, Threshold: 100,000 BIF',
      user: 'AG002',
      ip: '192.168.1.102'
    },
    {
      id: 7,
      timestamp: '2024-02-13 10:44:52.345',
      level: 'error',
      type: 'api',
      source: 'SMS Gateway',
      message: 'Failed to send SMS to +257 79 XXX XXX - Provider error: Insufficient credits',
      user: 'SYSTEM',
      ip: '10.0.0.3'
    },
    {
      id: 8,
      timestamp: '2024-02-13 10:44:45.678',
      level: 'info',
      type: 'transaction',
      source: 'Transaction Service',
      message: 'Transaction completed successfully - TRX123457 - Amount: 50,000 BIF',
      user: 'AG003',
      ip: '192.168.1.103'
    },
    {
      id: 9,
      timestamp: '2024-02-13 10:44:40.234',
      level: 'warning',
      type: 'system',
      source: 'Cache Service',
      message: 'Cache hit rate below threshold - Current: 75%, Expected: 85%',
      user: 'SYSTEM',
      ip: '10.0.0.4'
    },
    {
      id: 10,
      timestamp: '2024-02-13 10:44:35.901',
      level: 'info',
      type: 'security',
      source: 'Auth Service',
      message: 'User logged in successfully - Session created',
      user: 'USR123',
      ip: '192.168.1.110'
    }
  ];

  // Filtrer les logs
  const filteredLogs = logs.filter(log => {
    const matchesType = logType === 'all' || log.type === logType;
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    const matchesSearch = searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesLevel && matchesSearch;
  });

  // Stats
  const stats = {
    total: logs.length,
    info: logs.filter(l => l.level === 'info').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
    critical: logs.filter(l => l.level === 'critical').length
  };

  const exportCSV = () => {
    dt.current.exportCSV();
    toast.current.show({
      severity: 'success',
      summary: 'Export réussi',
      detail: 'Les logs ont été exportés en CSV',
      life: 3000
    });
  };

  const levelBodyTemplate = (rowData) => {
    const severityMap = {
      info: 'info',
      warning: 'warning',
      error: 'danger',
      critical: 'danger'
    };
    const labelMap = {
      info: 'INFO',
      warning: 'WARNING',
      error: 'ERROR',
      critical: 'CRITICAL'
    };
    return <Tag value={labelMap[rowData.level]} severity={severityMap[rowData.level]} />;
  };

  const typeBodyTemplate = (rowData) => {
    const colors = {
      system: 'bg-primary/20 text-primary',
      api: 'bg-secondary/20 text-secondary',
      transaction: 'bg-text/20 text-text',
      security: 'bg-danger/20 text-danger'
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[rowData.type]}`}>
        {rowData.type}
      </span>
    );
  };

  const messageBodyTemplate = (rowData) => {
    return (
      <span className="text-xs text-gray-300 line-clamp-2" title={rowData.message}>
        {rowData.message}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Logs Système
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Traçabilité complète de la plateforme
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold"
          >
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* 🟦 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={18} className="text-primary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Total</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.total}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-blue-500" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Info</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.info}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-secondary" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Warning</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.warning}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-danger" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Error</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.error}</div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle size={18} className="text-red-700" />
            <div className="text-xs text-gray-400 uppercase font-semibold">Critical</div>
          </div>
          <div className="text-2xl font-bold text-text">{stats.critical}</div>
        </div>
      </div>

      {/* 🟦 FILTRES */}
      <div className="border border-darkGray bg-card rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-primary" />
          <h2 className="text-lg font-semibold text-text">Filtres</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase font-semibold">Type de log</label>
            <Dropdown
              value={logType}
              options={logTypes}
              onChange={(e) => setLogType(e.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase font-semibold">Niveau</label>
            <Dropdown
              value={logLevel}
              options={logLevels}
              onChange={(e) => setLogLevel(e.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase font-semibold">Période</label>
            <Calendar
              value={dateRange}
              onChange={(e) => setDateRange(e.value)}
              selectionMode="range"
              readOnlyInput
              placeholder="Sélectionner une période"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase font-semibold">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🟦 LISTE DES LOGS */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-anton uppercase text-text">
            Logs ({filteredLogs.length})
          </h2>
          <button
            onClick={() => {
              toast.current.show({
                severity: 'info',
                summary: 'Logs rafraîchis',
                detail: 'Les logs ont été mis à jour',
                life: 2000
              });
            }}
            className="p-2 bg-card border border-darkGray rounded-lg text-gray-400 hover:text-text hover:border-primary transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
        <DataTable
          ref={dt}
          value={filteredLogs}
          responsiveLayout="scroll"
          className="text-sm"
          paginator
          rows={20}
          rowsPerPageOptions={[10, 20, 50, 100]}
        >
          <Column
            field="timestamp"
            header="Timestamp"
            sortable
            style={{ minWidth: '180px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-gray-400">{rowData.timestamp}</span>
            )}
          />
          <Column
            field="level"
            header="Niveau"
            body={levelBodyTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="type"
            header="Type"
            body={typeBodyTemplate}
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            field="source"
            header="Source"
            sortable
            style={{ minWidth: '150px' }}
            body={(rowData) => (
              <span className="text-sm text-text font-semibold">{rowData.source}</span>
            )}
          />
          <Column
            field="message"
            header="Message"
            body={messageBodyTemplate}
            style={{ minWidth: '350px' }}
          />
          <Column
            field="user"
            header="Utilisateur"
            sortable
            style={{ minWidth: '100px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-primary">{rowData.user}</span>
            )}
          />
          <Column
            field="ip"
            header="IP"
            sortable
            style={{ minWidth: '130px' }}
            body={(rowData) => (
              <span className="font-mono text-xs text-gray-400">{rowData.ip}</span>
            )}
          />
        </DataTable>
      </div>
    </div>
  );
}

export default Logs;

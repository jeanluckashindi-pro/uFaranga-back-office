import { useState, useRef, useEffect } from 'react';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import {
  Server, Activity, Zap, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Users, Database, Wifi, Globe, Mail, MessageSquare,
  RefreshCw, XCircle, Cpu, HardDrive, BarChart3
} from 'lucide-react';

function Monitoring() {
  const toast = useRef(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Statut global
  const systemStatus = {
    global: 'ok', // ok, degraded, incident
    uptime24h: 99.98,
    uptime7d: 99.95,
    uptime30d: 99.92,
    activeIncidents: 0,
    mttr: 12 // minutes
  };

  // Services
  const services = [
    { name: 'API Transactions', status: 'ok', responseTime: 45, errorRate: 0.02, icon: Activity },
    { name: 'API Paiement', status: 'ok', responseTime: 52, errorRate: 0.01, icon: Zap },
    { name: 'SMS Gateway', status: 'ok', responseTime: 180, errorRate: 0.5, icon: MessageSquare },
    { name: 'Email Service', status: 'ok', responseTime: 320, errorRate: 0.1, icon: Mail },
    { name: 'Webhooks', status: 'degraded', responseTime: 890, errorRate: 2.3, icon: Globe },
    { name: 'Database', status: 'ok', responseTime: 8, errorRate: 0, icon: Database }
  ];

  // Métriques temps réel
  const realtimeMetrics = {
    transactionsPerMinute: 1247,
    activeAgents: 892,
    activeClients: 12456,
    avgResponseTime: 67,
    errorRate: 0.15
  };

  // Ressources système
  const systemResources = [
    { name: 'CPU', usage: 42, status: 'ok', icon: Cpu },
    { name: 'RAM', usage: 68, status: 'ok', icon: HardDrive },
    { name: 'Disque', usage: 54, status: 'ok', icon: Database },
    { name: 'Réseau', usage: 35, status: 'ok', icon: Wifi }
  ];

  // Incidents récents
  const recentIncidents = [
    {
      id: 1,
      date: '2024-02-12 14:23',
      service: 'Webhooks',
      severity: 'warning',
      message: 'Temps de réponse élevé détecté',
      status: 'investigating',
      duration: '12 min'
    }
  ];

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 30000); // 30 secondes
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-500';
      case 'degraded': return 'text-secondary';
      case 'incident': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'ok': return 'bg-green-500/10 border-green-500/30';
      case 'degraded': return 'bg-secondary/10 border-secondary/30';
      case 'incident': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'incident': return XCircle;
      default: return Activity;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ok': return 'Opérationnel';
      case 'degraded': return 'Dégradé';
      case 'incident': return 'Incident';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-anton uppercase text-text truncate">
            Monitoring Système
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Surveillance en temps réel de la plateforme uFaranga
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-xs text-gray-400">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </div>
          <button
            onClick={() => {
              setAutoRefresh(!autoRefresh);
              toast.current.show({
                severity: 'info',
                summary: autoRefresh ? 'Auto-refresh désactivé' : 'Auto-refresh activé',
                life: 2000
              });
            }}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh ? 'bg-primary text-white' : 'bg-card border border-darkGray text-gray-400'
            }`}
            title={autoRefresh ? 'Désactiver auto-refresh' : 'Activer auto-refresh'}
          >
            <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 🟦 1️⃣ STATUT GLOBAL */}
      <div className={`border rounded-lg p-6 ${getStatusBg(systemStatus.global)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(() => {
              const StatusIcon = getStatusIcon(systemStatus.global);
              return <StatusIcon size={48} className={getStatusColor(systemStatus.global)} />;
            })()}
            <div>
              <h2 className="text-2xl font-anton uppercase text-text">
                Système {getStatusLabel(systemStatus.global)}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Tous les services fonctionnent normalement
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">Incidents actifs</div>
              <div className="text-3xl font-bold text-text">{systemStatus.activeIncidents}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">MTTR</div>
              <div className="text-3xl font-bold text-secondary">{systemStatus.mttr}min</div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟦 2️⃣ UPTIME */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400 uppercase font-semibold">Uptime 24h</div>
            <Clock size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-text mb-2">{systemStatus.uptime24h}%</div>
          <div className="h-2 bg-darkGray rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${systemStatus.uptime24h}%` }} />
          </div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400 uppercase font-semibold">Uptime 7j</div>
            <Clock size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-text mb-2">{systemStatus.uptime7d}%</div>
          <div className="h-2 bg-darkGray rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${systemStatus.uptime7d}%` }} />
          </div>
        </div>

        <div className="border border-darkGray bg-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400 uppercase font-semibold">Uptime 30j</div>
            <Clock size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-text mb-2">{systemStatus.uptime30d}%</div>
          <div className="h-2 bg-darkGray rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${systemStatus.uptime30d}%` }} />
          </div>
        </div>
      </div>

      {/* 🟦 3️⃣ MÉTRIQUES TEMPS RÉEL */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Métriques Temps Réel</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-primary" />
              <div className="text-xs text-gray-400">Trx/min</div>
            </div>
            <div className="text-2xl font-bold text-text">{realtimeMetrics.transactionsPerMinute.toLocaleString()}</div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-secondary" />
              <div className="text-xs text-gray-400">Agents actifs</div>
            </div>
            <div className="text-2xl font-bold text-text">{realtimeMetrics.activeAgents.toLocaleString()}</div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-primary" />
              <div className="text-xs text-gray-400">Clients actifs</div>
            </div>
            <div className="text-2xl font-bold text-text">{(realtimeMetrics.activeClients / 1000).toFixed(1)}K</div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-secondary" />
              <div className="text-xs text-gray-400">Temps réponse</div>
            </div>
            <div className="text-2xl font-bold text-text">{realtimeMetrics.avgResponseTime}ms</div>
          </div>

          <div className="p-4 border border-darkGray bg-background rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-500" />
              <div className="text-xs text-gray-400">Taux erreur</div>
            </div>
            <div className="text-2xl font-bold text-text">{realtimeMetrics.errorRate}%</div>
          </div>
        </div>
      </div>

      {/* 🟦 4️⃣ SERVICES */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">État des Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, idx) => {
            const ServiceIcon = service.icon;
            return (
              <div
                key={idx}
                className={`border rounded-lg p-4 ${getStatusBg(service.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${service.status === 'ok' ? 'bg-green-500/20' : 'bg-secondary/20'}`}>
                      <ServiceIcon size={20} className={getStatusColor(service.status)} />
                    </div>
                    <div>
                      <div className="font-semibold text-text">{service.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {service.status === 'ok' ? 'Opérationnel' : 'Dégradé'}
                      </div>
                    </div>
                  </div>
                  {(() => {
                    const StatusIcon = getStatusIcon(service.status);
                    return <StatusIcon size={16} className={getStatusColor(service.status)} />;
                  })()}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-400">Temps réponse</div>
                    <div className="font-bold text-text">{service.responseTime}ms</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Taux erreur</div>
                    <div className="font-bold text-text">{service.errorRate}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟦 5️⃣ RESSOURCES SYSTÈME */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Ressources Système</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemResources.map((resource, idx) => {
            const ResourceIcon = resource.icon;
            const isHigh = resource.usage > 80;
            const isMedium = resource.usage > 60 && resource.usage <= 80;
            return (
              <div key={idx} className="border border-darkGray bg-background rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ResourceIcon size={18} className="text-primary" />
                    <div className="text-sm font-semibold text-text">{resource.name}</div>
                  </div>
                  <div className={`text-2xl font-bold ${isHigh ? 'text-red-500' : isMedium ? 'text-secondary' : 'text-green-500'}`}>
                    {resource.usage}%
                  </div>
                </div>
                <div className="h-2 bg-darkGray rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isHigh ? 'bg-red-500' : isMedium ? 'bg-secondary' : 'bg-green-500'}`}
                    style={{ width: `${resource.usage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟦 6️⃣ INCIDENTS RÉCENTS */}
      {recentIncidents.length > 0 && (
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6">Incidents Récents</h2>
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div
                key={incident.id}
                className="border border-secondary/30 bg-secondary/10 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle size={18} className="text-secondary" />
                      <div className="font-semibold text-text">{incident.service}</div>
                      <Tag value={incident.severity} severity="warning" />
                      <Tag value={incident.status} severity="info" />
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{incident.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{incident.date}</span>
                      <span>Durée: {incident.duration}</span>
                    </div>
                  </div>
                  <button className="bg-text text-background hover:bg-lightGray transition-colors px-4 py-2 rounded-lg text-sm font-semibold">
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Monitoring;

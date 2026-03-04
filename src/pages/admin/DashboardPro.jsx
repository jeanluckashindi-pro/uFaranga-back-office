import { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Chart } from 'primereact/chart';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  TrendingUp, TrendingDown, Activity, Users, Wallet, DollarSign,
  AlertTriangle, CheckCircle, Clock, Zap, Target, Award,
  ArrowUpRight, ArrowDownRight, Eye, Download, RefreshCw,
  Globe, Shield, Cpu, Database, Server, BarChart3
} from 'lucide-react';

function DashboardPro() {
  const toast = useRef(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // KPIs Temps Réel avec tendances
  const realtimeKPIs = {
    volumeTotal: { value: 8945678900, change: 15.3, trend: 'up', target: 10000000000 },
    transactionsCount: { value: 145678, change: 12.8, trend: 'up', target: 150000 },
    avgTransactionValue: { value: 61423, change: 2.1, trend: 'up', target: 65000 },
    commissionsTotal: { value: 89456789, change: 18.5, trend: 'up', target: 100000000 },
    agentsActifs: { value: 1234, change: 5.2, trend: 'up', target: 1500 },
    clientsActifs: { value: 45678, change: 8.9, trend: 'up', target: 50000 },
    tauxReussite: { value: 98.7, change: 0.3, trend: 'up', target: 99.5 },
    tempsReponse: { value: 245, change: -12.5, trend: 'down', target: 200 }
  };

  // Métriques de Performance Avancées
  const performanceMetrics = {
    uptime: 99.98,
    availability: 99.95,
    latency: 245,
    throughput: 1247,
    errorRate: 0.15,
    saturation: 68
  };

  // Données pour graphique multi-axes sophistiqué
  const advancedTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    heure: `${i}h`,
    volume: Math.floor(Math.random() * 500000000) + 300000000,
    transactions: Math.floor(Math.random() * 8000) + 4000,
    agents: Math.floor(Math.random() * 800) + 400,
    tauxReussite: 95 + Math.random() * 4,
    tempsReponse: 200 + Math.random() * 100
  }));

  // Analyse de cohorte
  const cohorteData = [
    { periode: 'Sem 1', nouveaux: 234, actifs: 189, retention: 80.8, churn: 19.2 },
    { periode: 'Sem 2', nouveaux: 267, actifs: 223, retention: 83.5, churn: 16.5 },
    { periode: 'Sem 3', nouveaux: 298, actifs: 256, retention: 85.9, churn: 14.1 },
    { periode: 'Sem 4', nouveaux: 312, actifs: 278, retention: 89.1, churn: 10.9 }
  ];

  // Distribution géographique avancée
  const geoDistribution = [
    { region: 'Bujumbura Mairie', volume: 3200000000, agents: 456, penetration: 78.5, growth: 15.3 },
    { region: 'Bujumbura Rural', volume: 1800000000, agents: 234, penetration: 65.2, growth: 12.8 },
    { region: 'Gitega', volume: 980000000, agents: 189, penetration: 58.9, growth: 18.5 },
    { region: 'Ngozi', volume: 720000000, agents: 156, penetration: 52.3, growth: 14.2 },
    { region: 'Muyinga', volume: 650000000, agents: 134, penetration: 48.7, growth: 16.8 }
  ];

  // Analyse de segmentation clients
  const clientSegments = [
    { segment: 'Premium', count: 2345, volume: 4500000000, avgTransaction: 1920000, frequency: 45 },
    { segment: 'Standard', count: 12456, volume: 3200000000, avgTransaction: 257000, frequency: 18 },
    { segment: 'Basic', count: 23678, volume: 1245000000, avgTransaction: 52600, frequency: 8 },
    { segment: 'Nouveau', count: 7199, volume: 234000000, avgTransaction: 32500, frequency: 3 }
  ];

  // Matrice de risque
  const riskMatrix = [
    { categorie: 'Fraude', niveau: 'Faible', incidents: 12, impact: 2.3, probabilite: 15 },
    { categorie: 'Liquidité', niveau: 'Moyen', incidents: 45, impact: 6.8, probabilite: 35 },
    { categorie: 'Opérationnel', niveau: 'Faible', incidents: 8, impact: 1.5, probabilite: 10 },
    { categorie: 'Conformité', niveau: 'Faible', incidents: 3, impact: 0.8, probabilite: 5 }
  ];

  // Radar chart data - Performance multi-dimensionnelle
  const radarData = [
    { metric: 'Volume', value: 85, max: 100 },
    { metric: 'Qualité', value: 92, max: 100 },
    { metric: 'Rapidité', value: 88, max: 100 },
    { metric: 'Satisfaction', value: 94, max: 100 },
    { metric: 'Croissance', value: 78, max: 100 },
    { metric: 'Rentabilité', value: 90, max: 100 }
  ];

  const KPICard = ({ title, value, change, trend, target, icon: Icon, unit = '', format = 'number' }) => {
    const isPositive = trend === 'up' ? change > 0 : change < 0;
    const progress = (value / target) * 100;
    
    let displayValue = value;
    if (format === 'currency') {
      displayValue = value >= 1000000000 
        ? `${(value / 1000000000).toFixed(2)}B`
        : value >= 1000000
        ? `${(value / 1000000).toFixed(1)}M`
        : value.toLocaleString();
    } else if (format === 'number') {
      displayValue = value.toLocaleString();
    } else {
      displayValue = value;
    }

    return (
      <div className="border border-darkGray bg-card rounded-lg p-5 hover:border-primary/50 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{title}</p>
            <p className="text-3xl font-bold text-text">{displayValue}{unit}</p>
          </div>
          <div className={`p-3 rounded-lg ${isPositive ? 'bg-green-500/20' : 'bg-danger/20'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-500' : 'text-danger'}`} />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-danger" />
            )}
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-danger'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">vs hier</span>
          </div>
          <span className="text-xs text-gray-400">
            Objectif: {format === 'currency' ? `${(target / 1000000000).toFixed(1)}B` : target.toLocaleString()}
          </span>
        </div>

        <div className="h-1.5 bg-darkGray rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              progress >= 90 ? 'bg-green-500' : progress >= 70 ? 'bg-secondary' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <Toast ref={toast} />

      {/* HEADER AVANCÉ */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-anton uppercase text-text tracking-tight">
            Dashboard Exécutif
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Vue stratégique temps réel • Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-card border border-darkGray rounded-lg text-text text-sm focus:outline-none focus:border-primary transition-colors"
          >
            <option value="1h">Dernière heure</option>
            <option value="24h">24 heures</option>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
          </select>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh ? 'bg-primary text-white' : 'bg-card border border-darkGray text-gray-400'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold">
            <Download size={18} />
            Exporter
          </button>
        </div>
      </div>

      {/* 🟦 KPIs PRINCIPAUX - NIVEAU EXÉCUTIF */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Volume Total"
          value={realtimeKPIs.volumeTotal.value}
          change={realtimeKPIs.volumeTotal.change}
          trend={realtimeKPIs.volumeTotal.trend}
          target={realtimeKPIs.volumeTotal.target}
          icon={Activity}
          unit=" BIF"
          format="currency"
        />
        <KPICard
          title="Transactions"
          value={realtimeKPIs.transactionsCount.value}
          change={realtimeKPIs.transactionsCount.change}
          trend={realtimeKPIs.transactionsCount.trend}
          target={realtimeKPIs.transactionsCount.target}
          icon={Zap}
          format="number"
        />
        <KPICard
          title="Commissions"
          value={realtimeKPIs.commissionsTotal.value}
          change={realtimeKPIs.commissionsTotal.change}
          trend={realtimeKPIs.commissionsTotal.trend}
          target={realtimeKPIs.commissionsTotal.target}
          icon={DollarSign}
          unit=" BIF"
          format="currency"
        />
        <KPICard
          title="Taux de Réussite"
          value={realtimeKPIs.tauxReussite.value}
          change={realtimeKPIs.tauxReussite.change}
          trend={realtimeKPIs.tauxReussite.trend}
          target={realtimeKPIs.tauxReussite.target}
          icon={Target}
          unit="%"
          format="decimal"
        />
      </div>

      {/* 🟦 MÉTRIQUES DE PERFORMANCE SYSTÈME */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          Performance Système Temps Réel
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Uptime</div>
            <div className="text-2xl font-bold text-green-500">{performanceMetrics.uptime}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Disponibilité</div>
            <div className="text-2xl font-bold text-green-500">{performanceMetrics.availability}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Latence</div>
            <div className="text-2xl font-bold text-text">{performanceMetrics.latency}ms</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Débit</div>
            <div className="text-2xl font-bold text-primary">{performanceMetrics.throughput}/min</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Erreurs</div>
            <div className="text-2xl font-bold text-secondary">{performanceMetrics.errorRate}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase mb-2">Saturation</div>
            <div className="text-2xl font-bold text-text">{performanceMetrics.saturation}%</div>
          </div>
        </div>
      </div>

      {/* 🟦 GRAPHIQUE MULTI-AXES AVANCÉ */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6">Analyse Temporelle Multi-Dimensionnelle</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={advancedTimeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
            <XAxis dataKey="heure" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181F27',
                border: '1px solid #343A40',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="volume"
              fill="rgba(0, 123, 255, 0.2)"
              stroke="#007BFF"
              strokeWidth={2}
              name="Volume (BIF)"
            />
            <Bar yAxisId="right" dataKey="transactions" fill="#F58424" name="Transactions" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tauxReussite"
              stroke="#28A745"
              strokeWidth={3}
              dot={{ fill: '#28A745', r: 4 }}
              name="Taux Réussite (%)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 🟦 ANALYSE DE COHORTE & RADAR PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analyse de Cohorte */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6">Analyse de Rétention</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cohorteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="periode" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181F27',
                  border: '1px solid #343A40',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="nouveaux" fill="#007BFF" name="Nouveaux" />
              <Bar dataKey="actifs" fill="#28A745" name="Actifs" />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#F58424"
                strokeWidth={3}
                name="Rétention (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Performance Multi-Dimensionnelle */}
        <div className="border border-darkGray bg-card rounded-lg p-6">
          <h2 className="text-xl font-anton uppercase text-text mb-6">Performance Globale</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#343A40" />
              <PolarAngleAxis dataKey="metric" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="#007BFF"
                fill="#007BFF"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181F27',
                  border: '1px solid #343A40',
                  borderRadius: '8px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🟦 DISTRIBUTION GÉOGRAPHIQUE AVANCÉE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Analyse Géographique & Pénétration de Marché
        </h2>
        <div className="space-y-4">
          {geoDistribution.map((region, idx) => (
            <div key={idx} className="border border-darkGray bg-background rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-text text-lg">{region.region}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-400">{region.agents} agents</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-secondary font-semibold">+{region.growth}% croissance</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {(region.volume / 1000000000).toFixed(2)}B
                  </div>
                  <div className="text-xs text-gray-400">BIF</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Pénétration Marché</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${region.penetration}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-green-500">{region.penetration}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Part du Volume Total</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(region.volume / 8945678900 * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-primary">
                      {(region.volume / 8945678900 * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟦 SEGMENTATION CLIENTS AVANCÉE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Segmentation & Analyse Clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientSegments.map((segment, idx) => (
            <div key={idx} className="border border-darkGray bg-background rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text">{segment.segment}</h3>
                <Award className={`w-5 h-5 ${
                  segment.segment === 'Premium' ? 'text-secondary' :
                  segment.segment === 'Standard' ? 'text-primary' :
                  segment.segment === 'Basic' ? 'text-gray-400' :
                  'text-green-500'
                }`} />
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Clients</div>
                  <div className="text-2xl font-bold text-text">{segment.count.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Volume Total</div>
                  <div className="text-lg font-bold text-primary">
                    {(segment.volume / 1000000000).toFixed(2)}B BIF
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Trx Moy</div>
                    <div className="text-sm font-bold text-text">
                      {(segment.avgTransaction / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Fréquence</div>
                    <div className="text-sm font-bold text-secondary">{segment.frequency}/mois</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🟦 MATRICE DE RISQUE */}
      <div className="border border-darkGray bg-card rounded-lg p-6">
        <h2 className="text-xl font-anton uppercase text-text mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-danger" />
          Matrice de Risque & Conformité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {riskMatrix.map((risk, idx) => {
            const getRiskColor = (niveau) => {
              switch(niveau) {
                case 'Élevé': return 'border-danger/50 bg-danger/10';
                case 'Moyen': return 'border-secondary/50 bg-secondary/10';
                case 'Faible': return 'border-green-500/50 bg-green-500/10';
                default: return 'border-gray-500/50 bg-gray-500/10';
              }
            };

            return (
              <div key={idx} className={`border rounded-lg p-4 ${getRiskColor(risk.niveau)}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-text">{risk.categorie}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    risk.niveau === 'Élevé' ? 'bg-danger text-white' :
                    risk.niveau === 'Moyen' ? 'bg-secondary text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {risk.niveau}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Incidents:</span>
                    <span className="font-bold text-text">{risk.incidents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Impact:</span>
                    <span className="font-bold text-danger">{risk.impact}M BIF</span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Probabilité</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-darkGray rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            risk.probabilite > 30 ? 'bg-danger' :
                            risk.probabilite > 15 ? 'bg-secondary' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${risk.probabilite}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-text">{risk.probabilite}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🟦 INSIGHTS & RECOMMANDATIONS STRATÉGIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border border-green-500/30 bg-green-500/10 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text mb-1">Performance Exceptionnelle</h3>
              <p className="text-sm text-gray-400">
                Le taux de réussite de 98.7% dépasse l'objectif. Maintenir les optimisations actuelles.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-green-500">
            <TrendingUp className="w-4 h-4" />
            <span>+0.3% vs période précédente</span>
          </div>
        </div>

        <div className="border border-secondary/30 bg-secondary/10 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text mb-1">Opportunité de Croissance</h3>
              <p className="text-sm text-gray-400">
                La région Gitega montre une croissance de 18.5%. Augmenter les ressources dans cette zone.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Target className="w-4 h-4" />
            <span>Potentiel: +2.5M BIF/mois</span>
          </div>
        </div>

        <div className="border border-primary/30 bg-primary/10 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text mb-1">Optimisation Segment Premium</h3>
              <p className="text-sm text-gray-400">
                Les clients Premium génèrent 50% du volume avec seulement 5% de la base. Focus sur ce segment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary">
            <Award className="w-4 h-4" />
            <span>ROI: 3.2x sur investissement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPro;

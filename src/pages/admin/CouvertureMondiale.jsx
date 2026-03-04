import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, MapPin, TrendingUp, Users, Building2, Target,
  Calendar, Award, Zap, BarChart3, ArrowUpRight, CheckCircle
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Card, Modal, Button } from '../../components/common';

const CouvertureMondiale = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Données des pays utilisant le système
  const paysActifs = [
    { 
      id: 1, 
      nom: 'Burundi', 
      code: 'BI', 
      flag: '🇧🇮',
      agents: 1234, 
      clients: 45678, 
      villes: 18,
      volume: 2500000000,
      croissance: 25.5,
      statut: 'actif',
      dateActivation: '2024-01-15'
    },
    { 
      id: 2, 
      nom: 'Rwanda', 
      code: 'RW', 
      flag: '🇷🇼',
      agents: 856, 
      clients: 32450, 
      villes: 12,
      volume: 1800000000,
      croissance: 18.3,
      statut: 'actif',
      dateActivation: '2024-03-20'
    },
    { 
      id: 3, 
      nom: 'RD Congo', 
      code: 'CD', 
      flag: '🇨🇩',
      agents: 2145, 
      clients: 78900, 
      villes: 25,
      volume: 3200000000,
      croissance: 32.1,
      statut: 'actif',
      dateActivation: '2024-02-10'
    },
    { 
      id: 4, 
      nom: 'Kenya', 
      code: 'KE', 
      flag: '🇰🇪',
      agents: 450, 
      clients: 15600, 
      villes: 8,
      volume: 950000000,
      croissance: 15.7,
      statut: 'pilote',
      dateActivation: '2025-11-05'
    },
  ];

  // Villes les plus couvertes
  const villesCouvertes = [
    { ville: 'Bujumbura', pays: 'Burundi', agents: 456, clients: 18900, volume: 850000000 },
    { ville: 'Kinshasa', pays: 'RD Congo', agents: 678, clients: 25600, volume: 1200000000 },
    { ville: 'Kigali', pays: 'Rwanda', agents: 345, clients: 12300, volume: 650000000 },
    { ville: 'Gitega', pays: 'Burundi', agents: 234, clients: 8900, volume: 420000000 },
    { ville: 'Lubumbashi', pays: 'RD Congo', agents: 456, clients: 15600, volume: 780000000 },
  ];

  // Vision 5 ans - Expansion prévue
  const vision5Ans = [
    { annee: '2026', pays: 4, agents: 5000, clients: 180000, volume: 8500 },
    { annee: '2027', pays: 8, agents: 12000, clients: 450000, volume: 22000 },
    { annee: '2028', pays: 15, pays: 25000, clients: 980000, volume: 48000 },
    { annee: '2029', pays: 25, agents: 45000, clients: 1800000, volume: 95000 },
    { annee: '2030', pays: 40, agents: 85000, clients: 3500000, volume: 180000 },
  ];

  // Progression par pays (derniers 6 mois)
  const progressionBurundi = [
    { mois: 'Sep', agents: 980, clients: 38000, volume: 1800 },
    { mois: 'Oct', agents: 1050, clients: 40500, volume: 2100 },
    { mois: 'Nov', agents: 1120, clients: 42800, volume: 2300 },
    { mois: 'Déc', agents: 1180, clients: 44200, volume: 2400 },
    { mois: 'Jan', agents: 1210, clients: 45100, volume: 2450 },
    { mois: 'Fév', agents: 1234, clients: 45678, volume: 2500 },
  ];

  const progressionRwanda = [
    { mois: 'Sep', agents: 720, clients: 28000, volume: 1400 },
    { mois: 'Oct', agents: 760, clients: 29500, volume: 1550 },
    { mois: 'Nov', agents: 790, clients: 30200, volume: 1650 },
    { mois: 'Déc', agents: 810, clients: 31000, volume: 1700 },
    { mois: 'Jan', agents: 835, clients: 31800, volume: 1750 },
    { mois: 'Fév', agents: 856, clients: 32450, volume: 1800 },
  ];

  const progressionCongo = [
    { mois: 'Sep', agents: 1800, clients: 65000, volume: 2400 },
    { mois: 'Oct', agents: 1900, clients: 69000, volume: 2650 },
    { mois: 'Nov', agents: 1980, clients: 72500, volume: 2850 },
    { mois: 'Déc', agents: 2050, clients: 75200, volume: 3000 },
    { mois: 'Jan', agents: 2100, clients: 77000, volume: 3100 },
    { mois: 'Fév', agents: 2145, clients: 78900, volume: 3200 },
  ];

  // Statistiques globales
  const statsGlobales = {
    totalPays: paysActifs.length,
    totalAgents: paysActifs.reduce((sum, p) => sum + p.agents, 0),
    totalClients: paysActifs.reduce((sum, p) => sum + p.clients, 0),
    totalVilles: paysActifs.reduce((sum, p) => sum + p.villes, 0),
    volumeTotal: paysActifs.reduce((sum, p) => sum + p.volume, 0),
  };

  // Vision 2030 avec progression actuelle
  const vision2030 = [
    { 
      objectif: 'Pays Couverts', 
      actuel: statsGlobales.totalPays, 
      cible: 40, 
      icon: Globe,
      color: 'primary',
      unite: 'pays'
    },
    { 
      objectif: 'Agents Actifs', 
      actuel: statsGlobales.totalAgents, 
      cible: 85000, 
      icon: Users,
      color: 'secondary',
      unite: 'agents'
    },
    { 
      objectif: 'Clients', 
      actuel: statsGlobales.totalClients, 
      cible: 3500000, 
      icon: Users,
      color: 'green',
      unite: 'clients'
    },
    { 
      objectif: 'Volume Transactionnel', 
      actuel: statsGlobales.volumeTotal, 
      cible: 180000000000, 
      icon: BarChart3,
      color: 'primary',
      unite: 'BIF'
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text mb-2 flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary" />
              Couverture Mondiale
            </h1>
            <p className="text-gray-400 font-sans">Expansion globale et vision stratégique uFaranga</p>
          </div>
          <Button 
            onClick={() => navigate('/admin/gestion-pays')}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Gérer les Pays
          </Button>
        </div>
      </div>

      {/* Section 1: Vue d'ensemble - 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Colonne gauche: Stats + Vision 2030 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistiques Globales */}
          <Card className="p-6">
            <h2 className="text-lg font-heading font-bold text-text mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Vue d'Ensemble Globale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pays Actifs */}
              <div className="p-5 bg-background rounded-lg border border-darkGray hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                    <span className="text-xs font-bold text-primary">100%</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{statsGlobales.totalPays}</p>
                <p className="text-sm text-gray-400 font-sans mb-3">Pays Actifs</p>
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Target className="w-3 h-3" />
                  <span>Objectif: 40 pays</span>
                </div>
              </div>

              {/* Agents Actifs */}
              <div className="p-5 bg-background rounded-lg border border-darkGray hover:border-secondary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-bold text-green-400">+24%</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{statsGlobales.totalAgents.toLocaleString()}</p>
                <p className="text-sm text-gray-400 font-sans mb-3">Agents Actifs</p>
                <p className="text-xs text-secondary">Réseau en expansion</p>
              </div>

              {/* Clients Actifs */}
              <div className="p-5 bg-background rounded-lg border border-darkGray hover:border-green-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                    <TrendingUp className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-bold text-green-400">+18%</span>
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{(statsGlobales.totalClients / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-400 font-sans mb-3">Clients Actifs</p>
                <p className="text-xs text-green-400">Base croissante</p>
              </div>

              {/* Villes Couvertes */}
              <div className="p-5 bg-background rounded-lg border border-darkGray hover:border-primary transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-text mb-2">{statsGlobales.totalVilles}</p>
                <p className="text-sm text-gray-400 font-sans mb-3">Villes Couvertes</p>
                <p className="text-xs text-primary">Couverture urbaine</p>
              </div>
            </div>
          </Card>

          {/* Vision 2030 avec Barres de Progression */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-bold text-text flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Vision 2030 - Progression
              </h2>
              <span className="text-xs text-gray-400 font-sans">Objectifs à 5 ans</span>
            </div>
            <div className="space-y-5">
              {vision2030.map((item, index) => {
                const Icon = item.icon;
                const progression = (item.actuel / item.cible) * 100;
                const colorClasses = {
                  primary: 'bg-primary',
                  secondary: 'bg-secondary',
                  green: 'bg-green-500'
                };
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 text-${item.color}`} />
                        <span className="text-sm font-medium text-text font-sans">{item.objectif}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-text">
                          {item.unite === 'BIF' 
                            ? `${(item.actuel / 1000000000).toFixed(1)}B` 
                            : item.actuel.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 mx-1">/</span>
                        <span className="text-xs text-gray-400">
                          {item.unite === 'BIF' 
                            ? `${(item.cible / 1000000000).toFixed(0)}B` 
                            : item.cible.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="relative h-3 bg-darkGray rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${colorClasses[item.color]} transition-all duration-500 rounded-full`}
                        style={{ width: `${Math.min(progression, 100)}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 font-sans">
                        {progression.toFixed(1)}% atteint
                      </span>
                      <span className="text-xs text-gray-500 font-sans">
                        {(100 - progression).toFixed(1)}% restant
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Colonne droite: Top Villes */}
        <div>
          <Card className="p-6">
            <h2 className="text-lg font-heading font-bold text-text mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Top 5 Villes
            </h2>
            <div className="space-y-3">
              {villesCouvertes.map((ville, index) => (
                <div
                  key={index}
                  className="p-3 bg-background border border-darkGray rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-text font-sans truncate">{ville.ville}</h3>
                      <p className="text-xs text-gray-400 font-sans">{ville.pays}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-xs font-bold text-text">{ville.agents}</p>
                      <p className="text-xs text-gray-400">Agents</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text">{(ville.clients / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-400">Clients</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{(ville.volume / 1000000).toFixed(0)}M</p>
                      <p className="text-xs text-gray-400">Volume</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Section 2: Pays Actifs */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-heading font-bold text-text mb-6 flex items-center gap-2">
          <Globe className="w-6 h-6 text-primary" />
          Pays Utilisant le Système
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paysActifs.map((pays) => (
            <div
              key={pays.id}
              onClick={() => setSelectedCountry(pays)}
              className="p-5 bg-background border border-darkGray rounded-lg hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{pays.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-text font-sans">{pays.nom}</h3>
                    <p className="text-xs text-gray-400 font-mono">{pays.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium font-sans ${
                  pays.statut === 'actif' 
                    ? 'bg-green-400/20 text-green-400' 
                    : 'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {pays.statut === 'actif' ? 'Actif' : 'Pilote'}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-sans">Agents</span>
                  <span className="font-bold text-text">{pays.agents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-sans">Clients</span>
                  <span className="font-bold text-text">{(pays.clients / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-sans">Villes</span>
                  <span className="font-bold text-text">{pays.villes}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-darkGray flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-sans">Volume</p>
                  <p className="text-sm font-bold text-primary">{(pays.volume / 1000000000).toFixed(2)}B</p>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span className="text-xs font-bold">+{pays.croissance}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Vision 5 Ans */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-heading font-bold text-text mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-secondary" />
          Vision Stratégique 2026-2030
        </h2>
        <p className="text-gray-400 font-sans mb-6">
          Notre objectif est d'atteindre une couverture totale de 40 pays africains d'ici 2030, 
          avec 85 000 agents et 3,5 millions de clients actifs.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Graphique Expansion Pays */}
          <div>
            <h3 className="text-base font-bold text-text mb-4 font-sans">Expansion Géographique</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={vision5Ans}>
                <defs>
                  <linearGradient id="colorPays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007BFF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#007BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="annee" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9F9F9' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="pays" 
                  stroke="#007BFF" 
                  fillOpacity={1} 
                  fill="url(#colorPays)"
                  name="Pays"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique Croissance Agents */}
          <div>
            <h3 className="text-base font-bold text-text mb-4 font-sans">Croissance du Réseau d'Agents</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vision5Ans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="annee" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9F9F9' }}
                />
                <Bar dataKey="agents" fill="#F58424" name="Agents" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique Clients */}
          <div>
            <h3 className="text-base font-bold text-text mb-4 font-sans">Base Clients (en milliers)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vision5Ans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="annee" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9F9F9' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="#007BFF" 
                  strokeWidth={3}
                  dot={{ fill: '#007BFF', r: 5 }}
                  name="Clients (K)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique Volume */}
          <div>
            <h3 className="text-base font-bold text-text mb-4 font-sans">Volume Transactionnel (Milliards BIF)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={vision5Ans}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F58424" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F58424" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
                <XAxis dataKey="annee" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px' }}
                  labelStyle={{ color: '#F9F9F9' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#F58424" 
                  fillOpacity={1} 
                  fill="url(#colorVolume)"
                  name="Volume (B)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objectifs Clés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <Award className="w-8 h-8 text-primary mb-2" />
            <p className="text-2xl font-bold text-text mb-1">40</p>
            <p className="text-sm text-gray-400 font-sans">Pays Couverts</p>
          </div>
          <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
            <Users className="w-8 h-8 text-secondary mb-2" />
            <p className="text-2xl font-bold text-text mb-1">85K</p>
            <p className="text-sm text-gray-400 font-sans">Agents Actifs</p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Users className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold text-text mb-1">3.5M</p>
            <p className="text-sm text-gray-400 font-sans">Clients</p>
          </div>
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <Zap className="w-8 h-8 text-primary mb-2" />
            <p className="text-2xl font-bold text-text mb-1">180B</p>
            <p className="text-sm text-gray-400 font-sans">Volume BIF</p>
          </div>
        </div>
      </Card>

      {/* Progression par Pays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Burundi */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇧🇮</span>
            <div>
              <h3 className="text-lg font-bold text-text font-sans">Burundi</h3>
              <p className="text-xs text-gray-400 font-sans">Progression 6 derniers mois</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressionBurundi}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="agents" stroke="#007BFF" strokeWidth={2} name="Agents" />
              <Line type="monotone" dataKey="volume" stroke="#F58424" strokeWidth={2} name="Volume (M)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Rwanda */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇷🇼</span>
            <div>
              <h3 className="text-lg font-bold text-text font-sans">Rwanda</h3>
              <p className="text-xs text-gray-400 font-sans">Progression 6 derniers mois</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressionRwanda}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="agents" stroke="#007BFF" strokeWidth={2} name="Agents" />
              <Line type="monotone" dataKey="volume" stroke="#F58424" strokeWidth={2} name="Volume (M)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* RD Congo */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🇨🇩</span>
            <div>
              <h3 className="text-lg font-bold text-text font-sans">RD Congo</h3>
              <p className="text-xs text-gray-400 font-sans">Progression 6 derniers mois</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressionCongo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181F27', border: '1px solid #343A40', borderRadius: '8px', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="agents" stroke="#007BFF" strokeWidth={2} name="Agents" />
              <Line type="monotone" dataKey="volume" stroke="#F58424" strokeWidth={2} name="Volume (M)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default CouvertureMondiale;

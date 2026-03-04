import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Globe, MapPin, ArrowLeft, Building2, Users, TrendingUp,
  Wallet, BarChart3, Calendar, CheckCircle, XCircle
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, Skeleton } from '../../components/common';
import api from '../../services/api';

const DetailsPays = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pays, setPays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPaysDetails();
  }, [id]);

  const fetchPaysDetails = async () => {
    try {
      setLoading(true);
      const response = await api.request(`/api/v1/localisation/pays/${id}/`);
      setPays(response);
      
      // Simuler des statistiques (à remplacer par de vraies données API)
      setStats({
        agents: 1234,
        clients: 45678,
        transactions: 8945,
        volume: 2500000000,
        croissance: 25.5,
        transactionsParMois: [
          { mois: 'Jan', transactions: 650, volume: 180 },
          { mois: 'Fév', transactions: 720, volume: 210 },
          { mois: 'Mar', transactions: 780, volume: 230 },
          { mois: 'Avr', transactions: 850, volume: 250 },
          { mois: 'Mai', transactions: 920, volume: 280 },
          { mois: 'Juin', transactions: 980, volume: 310 },
        ],
        repartitionAgents: [
          { nom: 'Actifs', valeur: 1100, couleur: '#10b981' },
          { nom: 'Inactifs', valeur: 134, couleur: '#ef4444' },
        ],
      });
    } catch (error) {
      console.error('Erreur chargement détails pays:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!pays) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Pays non trouvé</p>
          <button
            onClick={() => navigate('/admin/gestion-pays')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (!pays.est_actif) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <button
          onClick={() => navigate('/admin/gestion-pays')}
          className="flex items-center gap-2 text-gray-400 hover:text-text transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </button>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">{pays.nom}</h2>
            <p className="text-gray-400 mb-6">
              Ce pays est actuellement inactif. Activez-le pour voir les statistiques et les détails.
            </p>
            <button
              onClick={() => navigate('/admin/gestion-pays')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retour à la gestion
            </button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/gestion-pays')}
          className="flex items-center gap-2 text-gray-400 hover:text-text transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la liste</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-anton uppercase text-text">{pays.nom}</h1>
              <p className="text-sm text-gray-400 mt-1">
                {pays.nom_anglais} • {pays.code_iso_2} / {pays.code_iso_3}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {pays.autorise_systeme && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                Autorisé Système
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400">
              Actif
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-10 h-10 text-primary" />
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold">+{stats.croissance}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-text mb-1">{stats.agents.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Agents Actifs</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
          <div className="flex items-center justify-between mb-3">
            <Users className="w-10 h-10 text-secondary" />
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-text mb-1">{(stats.clients / 1000).toFixed(0)}K</p>
          <p className="text-sm text-gray-400">Clients</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-10 h-10 text-green-400" />
            <Calendar className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-text mb-1">{stats.transactions.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Transactions</p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30">
          <div className="flex items-center justify-between mb-3">
            <Wallet className="w-10 h-10 text-purple-400" />
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-text mb-1">{(stats.volume / 1000000000).toFixed(2)}B</p>
          <p className="text-sm text-gray-400">Volume (BIF)</p>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Transactions par mois */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-heading font-bold text-text mb-4">
            Évolution des Transactions (6 derniers mois)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.transactionsParMois}>
              <CartesianGrid strokeDasharray="3 3" stroke="#343A40" />
              <XAxis dataKey="mois" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181F27',
                  border: '1px solid #343A40',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#F9F9F9' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#007BFF"
                strokeWidth={3}
                dot={{ fill: '#007BFF', r: 5 }}
                name="Transactions"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="#F58424"
                strokeWidth={3}
                dot={{ fill: '#F58424', r: 5 }}
                name="Volume (M)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Répartition Agents */}
        <Card className="p-6">
          <h2 className="text-lg font-heading font-bold text-text mb-4">
            Répartition des Agents
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.repartitionAgents}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nom, valeur }) => `${nom}: ${valeur}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valeur"
              >
                {stats.repartitionAgents.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181F27',
                  border: '1px solid #343A40',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Provinces */}
      {pays.provinces && pays.provinces.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-heading font-bold text-text mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Provinces ({pays.provinces.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pays.provinces.map((province) => (
              <div
                key={province.id}
                className="p-4 bg-background border border-darkGray rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-text">{province.nom}</h3>
                  <span className="text-xs text-gray-400 font-mono px-2 py-1 bg-darkGray rounded">
                    {province.code}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Districts</span>
                    <span className="font-bold text-text">{province.districts?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Statut</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      province.est_actif 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {province.est_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DetailsPays;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowLeft, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, Skeleton } from '../../components/common';
import api from '../../services/api';

const CarteMondiale = () => {
  const navigate = useNavigate();
  const [pays, setPays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPays();
  }, []);

  const fetchPays = async () => {
    try {
      setLoading(true);
      const response = await api.request('/api/v1/localisation/pays/');
      setPays(response.results?.filter(p => p.est_actif) || []);
    } catch (error) {
      console.error('Erreur chargement pays:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96 w-full" />
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
          <span>Retour à la gestion</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-anton uppercase text-text flex items-center gap-3">
              <Globe className="w-8 h-8 text-primary" />
              Carte Mondiale - Couverture uFaranga
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Visualisation géographique des pays couverts par le système
            </p>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text">{pays.length}</p>
              <p className="text-sm text-gray-400">Pays Actifs</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text">
                {pays.filter(p => p.autorise_systeme).length}
              </p>
              <p className="text-sm text-gray-400">Autorisés</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-bold text-text">100%</p>
              <p className="text-sm text-gray-400">Couverture</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Zone de carte (placeholder) */}
      <Card className="p-6 mb-6">
        <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-2 border-dashed border-darkGray p-12">
          <div className="text-center">
            <Globe className="w-24 h-24 text-primary mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-text mb-3">Carte Interactive</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              La carte interactive mondiale sera intégrée ici pour visualiser en temps réel 
              la couverture géographique d'uFaranga avec des marqueurs pour chaque pays actif.
            </p>
            <div className="flex gap-3 justify-center">
              <div className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
                <span className="text-sm text-primary font-medium">🗺️ Mapbox</span>
              </div>
              <div className="px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-lg">
                <span className="text-sm text-secondary font-medium">📍 Leaflet</span>
              </div>
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <span className="text-sm text-green-400 font-medium">🌍 Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Liste des pays avec coordonnées */}
      <Card className="p-6">
        <h2 className="text-lg font-heading font-bold text-text mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Pays Couverts ({pays.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pays.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/admin/pays/${p.id}`)}
              className="p-4 bg-background border border-darkGray rounded-lg hover:border-primary transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-text group-hover:text-primary transition-colors">
                  {p.nom}
                </h3>
                <span className="text-xs text-gray-400 font-mono px-2 py-1 bg-darkGray rounded">
                  {p.code_iso_2}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Latitude</span>
                  <span className="font-mono text-text">{p.latitude_centre}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Longitude</span>
                  <span className="font-mono text-text">{p.longitude_centre}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-darkGray">
                  <span className="text-gray-400">Statut</span>
                  <div className="flex gap-2">
                    {p.autorise_systeme && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs">
                        Autorisé
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-green-400/20 text-green-400 text-xs">
                      Actif
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CarteMondiale;

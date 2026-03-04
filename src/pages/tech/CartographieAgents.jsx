import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  MAPBOX_TOKEN, 
  BURUNDI_CENTER,
  BURUNDI_BOUNDS,
  BURUNDI_PROVINCES,
  AGENTS_DATA,
  STATUS_COLORS
} from '../../config/mapbox';
import {
  MapPin, Users, Activity, Wallet, TrendingUp, Search,
  Download, Eye, EyeOff, X, Maximize2, RotateCw, Map as MapIcon,
  Layers, Home, Move
} from 'lucide-react';

mapboxgl.accessToken = MAPBOX_TOKEN;

function CartographieAgents() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProvinces, setShowProvinces] = useState(false);
  const [showAgents, setShowAgents] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [viewMode, setViewMode] = useState('3d');
  const markersRef = useRef([]);

  // Filtrer les agents
  const filteredAgents = AGENTS_DATA.filter(agent => {
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchesSearch = agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.province.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: AGENTS_DATA.length,
    actifs: AGENTS_DATA.filter(a => a.status === 'actif').length,
    inactifs: AGENTS_DATA.filter(a => a.status === 'inactif').length,
    floatTotal: AGENTS_DATA.reduce((sum, a) => sum + a.float, 0),
    transactionsTotal: AGENTS_DATA.reduce((sum, a) => sum + a.transactions, 0)
  };

  // Initialiser la carte
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [BURUNDI_CENTER.longitude, BURUNDI_CENTER.latitude],
      zoom: BURUNDI_CENTER.zoom,
      pitch: 45,
      bearing: 0,
      antialias: true,
      attributionControl: false // Enlever les attributions
    });

    // Pas de contrôles par défaut

    map.current.fitBounds([
      [BURUNDI_BOUNDS.minLng, BURUNDI_BOUNDS.minLat],
      [BURUNDI_BOUNDS.maxLng, BURUNDI_BOUNDS.maxLat]
    ], {
      padding: 50,
      pitch: 45,
      bearing: 0,
      duration: 0
    });

    map.current.on('load', () => {
      map.current.addSource('selected-province', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.current.addLayer({
        id: 'selected-province-fill',
        type: 'fill',
        source: 'selected-province',
        paint: {
          'fill-color': '#F58424',
          'fill-opacity': 0.25
        }
      });

      map.current.addLayer({
        id: 'selected-province-line',
        type: 'line',
        source: 'selected-province',
        paint: {
          'line-color': '#F58424',
          'line-width': 3,
          'line-opacity': 0.8
        }
      });

      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (showAgents) {
      filteredAgents.forEach(agent => {
        const el = document.createElement('div');
        el.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${STATUS_COLORS[agent.status]}" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transition: all 0.2s;">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
        `;
        el.style.cursor = 'pointer';

        el.addEventListener('mouseenter', () => {
          el.firstElementChild.style.transform = 'scale(1.3)';
        });
        el.addEventListener('mouseleave', () => {
          el.firstElementChild.style.transform = 'scale(1)';
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([agent.lng, agent.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 15 })
              .setHTML(`
                <div style="padding: 12px; min-width: 220px;">
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <h3 style="font-weight: bold; font-size: 16px; color: #00070F;">${agent.nom}</h3>
                    <span style="padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; ${
                      agent.status === 'actif'
                        ? 'background: #dcfce7; color: #16a34a;'
                        : 'background: #fee2e2; color: #dc2626;'
                    }">
                      ${agent.status}
                    </span>
                  </div>
                  <p style="font-size: 12px; color: #666; margin-bottom: 10px;">${agent.id} • ${agent.province}</p>
                  <div style="display: flex; flex-direction: column; gap: 6px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px;">
                      <span style="color: #666;">Float:</span>
                      <span style="font-weight: 600; color: #007BFF;">${agent.float.toLocaleString()} BIF</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px;">
                      <span style="color: #666;">Transactions:</span>
                      <span style="font-weight: 600; color: #F58424;">${agent.transactions}</span>
                    </div>
                  </div>
                </div>
              `)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, showAgents, filteredAgents]);

  const flyToAgent = (agent) => {
    if (map.current) {
      map.current.flyTo({
        center: [agent.lng, agent.lat],
        zoom: 13,
        pitch: 60,
        bearing: 30,
        duration: 2000
      });
      setSelectedAgent(agent);
      setSelectedAgentDetail(agent); // Ouvrir le modal détaillé
    }
  };

  const changeMapStyle = (style) => {
    if (map.current) {
      map.current.setStyle(style);
      setMapStyle(style);
    }
  };

  const toggleViewMode = () => {
    if (map.current) {
      if (viewMode === '2d') {
        map.current.easeTo({ pitch: 45, bearing: 0, duration: 1000 });
        setViewMode('3d');
      } else {
        map.current.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
        setViewMode('2d');
      }
    }
  };

  const resetView = () => {
    if (map.current) {
      map.current.fitBounds([
        [BURUNDI_BOUNDS.minLng, BURUNDI_BOUNDS.minLat],
        [BURUNDI_BOUNDS.maxLng, BURUNDI_BOUNDS.maxLat]
      ], {
        padding: 50,
        pitch: 45,
        bearing: 0,
        duration: 1500
      });
      setSelectedAgent(null);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-background" style={{ height: 'calc(100vh - 73px)' }}>
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-3 bg-card/95 backdrop-blur-sm border border-primary rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all"
            title="Ouvrir/Fermer le panneau"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={resetView}
            className="p-3 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg shadow-lg hover:border-primary hover:text-primary transition-all"
            title="Réinitialiser la vue"
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            onClick={toggleViewMode}
            className={`p-3 backdrop-blur-sm border rounded-lg shadow-lg transition-all ${
              viewMode === '3d'
                ? 'bg-primary text-white border-primary'
                : 'bg-card/95 border-darkGray hover:border-primary'
            }`}
            title={viewMode === '3d' ? 'Passer en 2D' : 'Passer en 3D'}
          >
            <Layers className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-1 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg p-2 shadow-lg">
            <button
              onClick={() => setShowAgents(!showAgents)}
              className={`p-2 rounded transition-all ${
                showAgents
                  ? 'bg-secondary text-white'
                  : 'hover:bg-darkGray text-gray-400'
              }`}
              title="Afficher/Masquer les agents"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg p-2 shadow-lg">
            <button
              onClick={() => changeMapStyle('mapbox://styles/mapbox/dark-v11')}
              className={`px-3 py-2 rounded transition-all text-xs font-semibold ${
                mapStyle === 'mapbox://styles/mapbox/dark-v11'
                  ? 'bg-primary text-white'
                  : 'hover:bg-darkGray text-gray-400'
              }`}
            >
              Sombre
            </button>
            <button
              onClick={() => changeMapStyle('mapbox://styles/mapbox/streets-v12')}
              className={`px-3 py-2 rounded transition-all text-xs font-semibold ${
                mapStyle === 'mapbox://styles/mapbox/streets-v12'
                  ? 'bg-primary text-white'
                  : 'hover:bg-darkGray text-gray-400'
              }`}
            >
              Rues
            </button>
            <button
              onClick={() => changeMapStyle('mapbox://styles/mapbox/satellite-streets-v12')}
              className={`px-3 py-2 rounded transition-all text-xs font-semibold ${
                mapStyle === 'mapbox://styles/mapbox/satellite-streets-v12'
                  ? 'bg-primary text-white'
                  : 'hover:bg-darkGray text-gray-400'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>

        {isPanelOpen && (
          <div 
            className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-sm border border-primary rounded-lg shadow-2xl"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div className="p-3 border-b border-darkGray flex items-center justify-between cursor-move bg-primary/10">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-text">Agents Burundi</h3>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-1 hover:bg-danger/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-danger" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-background border border-darkGray text-gray-400 hover:border-primary'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('actif')}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'actif'
                      ? 'bg-secondary text-white'
                      : 'bg-background border border-darkGray text-gray-400 hover:border-secondary'
                  }`}
                >
                  Actifs
                </button>
                <button
                  onClick={() => setFilterStatus('inactif')}
                  className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filterStatus === 'inactif'
                      ? 'bg-danger text-white'
                      : 'bg-background border border-darkGray text-gray-400 hover:border-danger'
                  }`}
                >
                  Inactifs
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border-t border-darkGray">
              <div className="p-2 space-y-1">
                <p className="text-xs text-gray-400 px-2 py-1">
                  {filteredAgents.length} agent(s) trouvé(s)
                </p>
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => flyToAgent(agent)}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      selectedAgent?.id === agent.id
                        ? 'bg-primary text-white'
                        : 'bg-background/50 hover:bg-background text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${
                            agent.status === 'actif' ? 'bg-secondary' : 'bg-danger'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs truncate">{agent.nom}</p>
                          <p className="text-xs opacity-70 truncate">{agent.province}</p>
                        </div>
                      </div>
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg p-3 shadow-2xl">
          <p className="text-xs font-semibold text-text mb-2">Légende</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ color: STATUS_COLORS.actif }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <span className="text-xs text-gray-400">Actif</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ color: STATUS_COLORS.inactif }}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <span className="text-xs text-gray-400">Inactif</span>
            </div>
          </div>
        </div>

        {/* Modal détails de l'agent */}
        {selectedAgentDetail && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedAgentDetail(null)}>
            <div className="bg-card border border-darkGray rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b border-darkGray bg-darkGray/30 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-anton uppercase text-secondary">{selectedAgentDetail.nom}</h2>
                    <p className="text-sm text-gray-400 mt-1">{selectedAgentDetail.id} • {selectedAgentDetail.province}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAgentDetail(null)}
                    className="p-2 hover:bg-danger/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400 hover:text-danger" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 space-y-6">
                {/* Stats principales */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Float disponible</div>
                    <div className="text-2xl font-bold text-primary">{(selectedAgentDetail.float / 1000000).toFixed(1)}M</div>
                    <div className="text-xs text-gray-500 mt-1">BIF</div>
                  </div>
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Transactions/jour</div>
                    <div className="text-2xl font-bold text-secondary">{selectedAgentDetail.transactions}</div>
                    <div className="text-xs text-gray-500 mt-1">en moyenne</div>
                  </div>
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Commissions</div>
                    <div className="text-2xl font-bold text-text">{(selectedAgentDetail.commissions / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-500 mt-1">BIF/mois</div>
                  </div>
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Statut</div>
                    <div className={`text-lg font-bold ${selectedAgentDetail.status === 'actif' ? 'text-secondary' : 'text-danger'}`}>
                      {selectedAgentDetail.status === 'actif' ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-background border border-darkGray rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-text mb-4">Performance mensuelle</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Volume traité</span>
                        <span className="text-sm font-bold text-primary">{(selectedAgentDetail.float * 3 / 1000000).toFixed(1)}M BIF</span>
                      </div>
                      <div className="h-2 bg-darkGray rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Taux de réussite</span>
                        <span className="text-sm font-bold text-secondary">96%</span>
                      </div>
                      <div className="h-2 bg-darkGray rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: '96%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-400">Satisfaction client</span>
                        <span className="text-sm font-bold text-text">4.8/5</span>
                      </div>
                      <div className="h-2 bg-darkGray rounded-full overflow-hidden">
                        <div className="h-full bg-text" style={{ width: '96%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services offerts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-text mb-3">Services disponibles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-gray-300">Dépôt d'argent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                        <span className="text-gray-300">Retrait d'argent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-text"></div>
                        <span className="text-gray-300">Transfert</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-gray-300">Paiement factures</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background border border-darkGray rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-text mb-3">Informations</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Téléphone:</span>
                        <span className="text-text">+257 79 XXX XXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Horaires:</span>
                        <span className="text-text">7h - 20h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Depuis:</span>
                        <span className="text-text">Jan 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartographieAgents;

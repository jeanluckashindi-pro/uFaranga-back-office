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
  const [showProvinces, setShowProvinces] = useState(false); // Désactivé par défaut
  const [showAgents, setShowAgents] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Contrôle ouverture panneau
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [viewMode, setViewMode] = useState('3d'); // '2d' ou '3d'
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
      pitch: 45, // Vue oblique 3D
      bearing: 0, // Rotation
      antialias: true // Meilleure qualité 3D
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Ajuster la vue sur les limites du Burundi
    map.current.fitBounds([
      [BURUNDI_BOUNDS.minLng, BURUNDI_BOUNDS.minLat], // Sud-Ouest
      [BURUNDI_BOUNDS.maxLng, BURUNDI_BOUNDS.maxLat]  // Nord-Est
    ], {
      padding: 50,
      pitch: 45,
      bearing: 0,
      duration: 0
    });

    // Ajouter la frontière du Burundi après le chargement
    map.current.on('load', () => {
      // Ajouter une source vide pour les provinces sélectionnées
      map.current.addSource('selected-province', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Couche de remplissage pour la province sélectionnée
      map.current.addLayer({
        id: 'selected-province-fill',
        type: 'fill',
        source: 'selected-province',
        paint: {
          'fill-color': '#F58424',
          'fill-opacity': 0.25
        }
      });

      // Bordure de la province sélectionnée
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

      // Marquer la carte comme chargée
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

    // Supprimer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Ajouter seulement les marqueurs des agents (pas de cercles de provinces)
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

        // Hover effect
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
                  <button onclick="window.location.href='/admin/agents?id=${agent.id}'" style="width: 100%; margin-top: 10px; padding: 6px 12px; background: #007BFF; color: white; border-radius: 6px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s;">
                    Voir Détails
                  </button>
                </div>
              `)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, showAgents, filteredAgents, selectedProvince]);

  // Voler vers un agent
  const flyToAgent = (agent) => {
    if (map.current) {
      map.current.flyTo({
        center: [agent.lng, agent.lat],
        zoom: 13,
        pitch: 60, // Vue plus oblique
        bearing: 30, // Légère rotation
        duration: 2000
      });
      setSelectedAgent(agent);
    }
  };

  // Sélectionner une province
  const selectProvince = (province) => {
    if (map.current && mapLoaded) {
      // Mettre à jour la source avec le polygone de la province
      map.current.getSource('selected-province').setData({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [province.bounds]
        }
      });

      // Voler vers la province
      map.current.flyTo({
        center: [province.lng, province.lat],
        zoom: 10,
        pitch: 45,
        bearing: 0,
        duration: 1500
      });

      setSelectedProvince(province);
    }
  };

  // Désélectionner la province
  const clearProvinceSelection = () => {
    if (map.current && mapLoaded) {
      map.current.getSource('selected-province').setData({
        type: 'FeatureCollection',
        features: []
      });
      setSelectedProvince(null);
    }
  };

  // Changer le style de la carte
  const changeMapStyle = (style) => {
    if (map.current) {
      map.current.setStyle(style);
      setMapStyle(style);
    }
  };

  // Basculer entre 2D et 3D
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

  // Réinitialiser la vue
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
      clearProvinceSelection();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Carte - Plein écran */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Contrôles de la carte - Flottants à gauche */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {/* Bouton toggle panneau */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-3 bg-card/95 backdrop-blur-sm border border-primary rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all"
            title="Ouvrir/Fermer le panneau"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Bouton réinitialiser vue */}
          <button
            onClick={resetView}
            className="p-3 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg shadow-lg hover:border-primary hover:text-primary transition-all"
            title="Réinitialiser la vue"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Bouton 2D/3D */}
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

          {/* Contrôles de couches */}
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

          {/* Styles de carte */}
          <div className="flex flex-col gap-1 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg p-2 shadow-lg">
            <button
              onClick={() => changeMapStyle('mapbox://styles/mapbox/dark-v11')}
              className={`px-3 py-2 rounded transition-all text-xs font-semibold ${
                mapStyle === 'mapbox://styles/mapbox/dark-v11'
                  ? 'bg-primary text-white'
                  : 'hover:bg-darkGray text-gray-400'
              }`}
              title="Mode Sombre"
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
              title="Mode Rues"
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
              title="Mode Satellite"
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Badge province sélectionnée - En haut au centre */}
        {selectedProvince && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/95 backdrop-blur-sm border border-secondary rounded-lg shadow-lg">
              <MapIcon className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-semibold text-sm">{selectedProvince.name}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{selectedProvince.agents} agents</span>
              <button
                onClick={clearProvinceSelection}
                className="ml-1 hover:bg-secondary/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 text-secondary" />
              </button>
            </div>
          </div>
        )}

        {/* Panneau de recherche flottant - Déplaçable et refermable */}
        {isPanelOpen && (
          <div 
            className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-sm border border-primary rounded-lg shadow-2xl"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {/* Header du panneau - Déplaçable */}
            <div className="p-3 border-b border-darkGray flex items-center justify-between cursor-move bg-primary/10">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-text">Recherche & Agents</h3>
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="p-1 hover:bg-danger/20 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-danger" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {/* Recherche */}
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

              {/* Filtres */}
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

            {/* Liste des agents - Scrollable */}
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

        {/* Légende flottante - Minimaliste */}
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
      </div>
    </div>
  );
}

export default CartographieAgents;

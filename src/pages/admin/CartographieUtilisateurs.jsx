import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN, BURUNDI_CENTER, BURUNDI_BOUNDS } from '../../config/mapbox';
import {
  MapPin, Users, Search, Filter, X, Home, Layers, Map as MapIcon,
  User, Phone, Mail, Calendar, Shield, TrendingUp, Activity
} from 'lucide-react';

mapboxgl.accessToken = MAPBOX_TOKEN;

// Données de test des utilisateurs
const USERS_DATA = [
  { id: 'U001', nom: 'Jean Nkurunziza', type: 'CLIENT', status: 'actif', province: 'Bujumbura Mairie', lat: -3.3761, lng: 29.3600, telephone: '+25768123456', email: 'jean@example.com', kyc: 2, transactions: 45 },
  { id: 'U002', nom: 'Marie Ndayisenga', type: 'AGENT', status: 'actif', province: 'Gitega', lat: -3.4271, lng: 29.9246, telephone: '+25768234567', email: 'marie@example.com', kyc: 3, transactions: 234 },
  { id: 'U003', nom: 'Pierre Habimana', type: 'CLIENT', status: 'actif', province: 'Ngozi', lat: -2.9077, lng: 29.8306, telephone: '+25768345678', email: 'pierre@example.com', kyc: 1, transactions: 12 },
  { id: 'U004', nom: 'Alice Uwimana', type: 'MARCHAND', status: 'actif', province: 'Bururi', lat: -3.9489, lng: 29.6244, telephone: '+25768456789', email: 'alice@example.com', kyc: 3, transactions: 156 },
  { id: 'U005', nom: 'David Bizimana', type: 'CLIENT', status: 'suspendu', province: 'Muyinga', lat: -2.8451, lng: 30.3414, telephone: '+25768567890', email: 'david@example.com', kyc: 0, transactions: 3 },
  { id: 'U006', nom: 'Sophie Irakoze', type: 'AGENT', status: 'actif', province: 'Cibitoke', lat: -2.8867, lng: 29.1244, telephone: '+25768678901', email: 'sophie@example.com', kyc: 3, transactions: 189 },
  { id: 'U007', nom: 'Emmanuel Niyonzima', type: 'CLIENT', status: 'actif', province: 'Kayanza', lat: -2.9222, lng: 29.6289, telephone: '+25768789012', email: 'emmanuel@example.com', kyc: 2, transactions: 67 },
  { id: 'U008', nom: 'Grace Mukeshimana', type: 'MARCHAND', status: 'actif', province: 'Makamba', lat: -4.1348, lng: 29.8040, telephone: '+25768890123', email: 'grace@example.com', kyc: 3, transactions: 201 },
];

const TYPE_COLORS = {
  CLIENT: '#007BFF',
  AGENT: '#28a745',
  MARCHAND: '#F58424',
  ADMIN: '#dc3545'
};

const STATUS_COLORS = {
  actif: '#28a745',
  suspendu: '#ffc107',
  bloque: '#dc3545'
};

function CartographieUtilisateurs() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [viewMode, setViewMode] = useState('3d');
  const [showFilters, setShowFilters] = useState(false);
  const markersRef = useRef([]);

  // Filtrer les utilisateurs
  const filteredUsers = USERS_DATA.filter(user => {
    const matchesType = filterType === 'all' || user.type === filterType;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.province.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: USERS_DATA.length,
    clients: USERS_DATA.filter(u => u.type === 'CLIENT').length,
    agents: USERS_DATA.filter(u => u.type === 'AGENT').length,
    marchands: USERS_DATA.filter(u => u.type === 'MARCHAND').length,
    actifs: USERS_DATA.filter(u => u.status === 'actif').length,
  };

  // Initialiser la carte
  useEffect(() => {
    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [BURUNDI_CENTER.longitude, BURUNDI_CENTER.latitude],
        zoom: BURUNDI_CENTER.zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

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
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Erreur Mapbox:', e);
      });
    } catch (error) {
      console.error('Erreur lors de la création de la carte:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      return;
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (showUsers) {
      filteredUsers.forEach(user => {
        const el = document.createElement('div');
        el.innerHTML = `
          <svg width="28" height="28" viewBox="0 0 24 24" fill="${TYPE_COLORS[user.type]}" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); transition: all 0.2s;">
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
          .setLngLat([user.lng, user.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 15 })
              .setHTML(`
                <div style="padding: 14px; min-width: 260px; font-family: system-ui;">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: ${TYPE_COLORS[user.type]}20; display: flex; align-items: center; justify-center;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${TYPE_COLORS[user.type]}" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div style="flex: 1;">
                      <h3 style="font-weight: 700; font-size: 15px; color: #00070F; margin: 0;">${user.nom}</h3>
                      <p style="font-size: 11px; color: #666; margin: 2px 0 0 0;">${user.id} • ${user.province}</p>
                    </div>
                  </div>
                  
                  <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                    <span style="padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; background: ${TYPE_COLORS[user.type]}20; color: ${TYPE_COLORS[user.type]};">
                      ${user.type}
                    </span>
                    <span style="padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; ${
                      user.status === 'actif'
                        ? 'background: #dcfce7; color: #16a34a;'
                        : 'background: #fee2e2; color: #dc2626;'
                    }">
                      ${user.status}
                    </span>
                    <span style="padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 700; background: #f3f4f6; color: #374151;">
                      KYC ${user.kyc}
                    </span>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                    <div style="background: #f9fafb; padding: 8px; border-radius: 8px;">
                      <div style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">Transactions</div>
                      <div style="font-size: 16px; font-weight: 700; color: #F58424;">${user.transactions}</div>
                    </div>
                    <div style="background: #f9fafb; padding: 8px; border-radius: 8px;">
                      <div style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">Niveau KYC</div>
                      <div style="font-size: 16px; font-weight: 700; color: #007BFF;">${user.kyc}/3</div>
                    </div>
                  </div>

                  <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; padding: 10px; background: #f9fafb; border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span style="color: #374151;">${user.telephone}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 12px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                      <span style="color: #374151;">${user.email}</span>
                    </div>
                  </div>

                  <button onclick="window.location.href='/admin/users?id=${user.id}'" style="width: 100%; padding: 10px; background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%); color: white; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 700; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,123,255,0.3);">
                    Voir le profil complet
                  </button>
                </div>
              `)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      });
    }
  }, [mapLoaded, showUsers, filteredUsers]);

  const flyToUser = (user) => {
    if (map.current) {
      map.current.flyTo({
        center: [user.lng, user.lat],
        zoom: 13,
        pitch: 60,
        bearing: 30,
        duration: 2000
      });
      setSelectedUser(user);
    }
  };

  const changeMapStyle = (style) => {
    if (map.current) {
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();
      const currentPitch = map.current.getPitch();
      const currentBearing = map.current.getBearing();
      
      map.current.setStyle(style);
      setMapStyle(style);
      
      // Attendre que le style soit chargé avant de restaurer la vue
      map.current.once('style.load', () => {
        map.current.jumpTo({
          center: currentCenter,
          zoom: currentZoom,
          pitch: currentPitch,
          bearing: currentBearing
        });
        setMapLoaded(true);
      });
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
      setSelectedUser(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header simple */}
      <div className="bg-card border-b border-darkGray px-6 py-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-anton uppercase text-text">Cartographie des Utilisateurs</h1>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-text font-semibold">{stats.total}</span>
              <span className="text-gray-400">Total</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-lg">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-text font-semibold">{stats.clients}</span>
              <span className="text-gray-400">Clients</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-lg">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-text font-semibold">{stats.agents}</span>
              <span className="text-gray-400">Agents</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-lg">
              <Activity className="w-4 h-4 text-orange-500" />
              <span className="text-text font-semibold">{stats.marchands}</span>
              <span className="text-gray-400">Marchands</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors text-sm font-semibold"
        >
          <X className="w-4 h-4" />
          <span>Retour</span>
        </button>
      </div>

      {/* Carte */}
      <div className="flex-1 relative" style={{ minHeight: 0 }}>
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* Contrôles gauche */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="p-3 bg-card/95 backdrop-blur-sm border border-primary rounded-lg shadow-lg hover:bg-primary hover:text-white transition-all"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={resetView}
            className="p-3 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg shadow-lg hover:border-primary hover:text-primary transition-all"
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
          >
            <Layers className="w-5 h-5" />
          </button>

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

        {/* Panneau de recherche */}
        {isPanelOpen && (
          <div className="absolute top-4 right-4 w-96 bg-card/95 backdrop-blur-sm border border-primary rounded-xl shadow-2xl max-h-[calc(100vh-180px)] flex flex-col">
            <div className="p-4 border-b border-darkGray">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-text">Recherche & Filtres</h3>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-1 hover:bg-danger/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-danger" />
                </button>
              </div>

              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text text-sm placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-3 py-2 bg-background border border-darkGray rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-text">Filtres avancés</span>
                </div>
                <span className={`text-xs text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {showFilters && (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Type d'utilisateur</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterType === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-primary'
                        }`}
                      >
                        Tous
                      </button>
                      <button
                        onClick={() => setFilterType('CLIENT')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterType === 'CLIENT'
                            ? 'bg-blue-500 text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-blue-500'
                        }`}
                      >
                        Clients
                      </button>
                      <button
                        onClick={() => setFilterType('AGENT')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterType === 'AGENT'
                            ? 'bg-secondary text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-secondary'
                        }`}
                      >
                        Agents
                      </button>
                      <button
                        onClick={() => setFilterType('MARCHAND')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterType === 'MARCHAND'
                            ? 'bg-orange-500 text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-orange-500'
                        }`}
                      >
                        Marchands
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Statut</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterStatus === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-primary'
                        }`}
                      >
                        Tous
                      </button>
                      <button
                        onClick={() => setFilterStatus('actif')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterStatus === 'actif'
                            ? 'bg-green-500 text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-green-500'
                        }`}
                      >
                        Actifs
                      </button>
                      <button
                        onClick={() => setFilterStatus('suspendu')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          filterStatus === 'suspendu'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-background border border-darkGray text-gray-400 hover:border-yellow-500'
                        }`}
                      >
                        Suspendus
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-gray-400 mb-2 px-1">
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </p>
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => flyToUser(user)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedUser?.id === user.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-background/50 hover:bg-background text-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${TYPE_COLORS[user.type]}20` }}
                      >
                        <User className="w-5 h-5" style={{ color: TYPE_COLORS[user.type] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm truncate">{user.nom}</p>
                          <span
                            className={`h-2 w-2 rounded-full flex-shrink-0 ${
                              user.status === 'actif' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}
                          />
                        </div>
                        <p className="text-xs opacity-70 truncate mb-1">{user.province}</p>
                        <div className="flex gap-1">
                          <span 
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ 
                              background: selectedUser?.id === user.id ? 'rgba(255,255,255,0.2)' : `${TYPE_COLORS[user.type]}20`,
                              color: selectedUser?.id === user.id ? 'white' : TYPE_COLORS[user.type]
                            }}
                          >
                            {user.type}
                          </span>
                          <span 
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              selectedUser?.id === user.id 
                                ? 'bg-white/20 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            KYC {user.kyc}
                          </span>
                        </div>
                      </div>
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg p-3 shadow-2xl">
          <p className="text-xs font-semibold text-text mb-2">Types d'utilisateurs</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: TYPE_COLORS.CLIENT }}></div>
              <span className="text-xs text-gray-400">Client</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: TYPE_COLORS.AGENT }}></div>
              <span className="text-xs text-gray-400">Agent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: TYPE_COLORS.MARCHAND }}></div>
              <span className="text-xs text-gray-400">Marchand</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartographieUtilisateurs;

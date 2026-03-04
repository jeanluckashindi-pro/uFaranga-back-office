export const MAPBOX_TOKEN = "pk.eyJ1Ijoid2FiZW5nYSIsImEiOiJjbHYyZDZycWMwODZzMmtudWVvdXFxY2xyIn0.cysmLEbhoPU_7w9YZP7b6w";

// Centre du Burundi avec un zoom plus large pour voir tout le pays
export const BURUNDI_CENTER = {
  longitude: 29.9189,
  latitude: -3.3731,
  zoom: 8  // Zoom optimal pour voir tout le pays sans saturation
};

// Limites du Burundi (bounding box)
export const BURUNDI_BOUNDS = {
  minLng: 28.9933,
  minLat: -4.4693,
  maxLng: 30.8498,
  maxLat: -2.3096
};

// Provinces du Burundi avec coordonnées et polygones approximatifs
export const BURUNDI_PROVINCES = [
  { 
    name: 'Bujumbura Mairie', 
    lat: -3.3614, 
    lng: 29.3599, 
    agents: 456,
    bounds: [
      [29.32, -3.40],
      [29.40, -3.40],
      [29.40, -3.32],
      [29.32, -3.32],
      [29.32, -3.40]
    ]
  },
  { 
    name: 'Bujumbura Rural', 
    lat: -3.5500, 
    lng: 29.4500, 
    agents: 123,
    bounds: [
      [29.35, -3.65],
      [29.55, -3.65],
      [29.55, -3.45],
      [29.35, -3.45],
      [29.35, -3.65]
    ]
  },
  { 
    name: 'Bubanza', 
    lat: -3.0833, 
    lng: 29.3833, 
    agents: 89,
    bounds: [
      [29.28, -3.18],
      [29.48, -3.18],
      [29.48, -2.98],
      [29.28, -2.98],
      [29.28, -3.18]
    ]
  },
  { 
    name: 'Bururi', 
    lat: -3.9500, 
    lng: 29.6167, 
    agents: 67,
    bounds: [
      [29.50, -4.05],
      [29.73, -4.05],
      [29.73, -3.85],
      [29.50, -3.85],
      [29.50, -4.05]
    ]
  },
  { 
    name: 'Cankuzo', 
    lat: -3.2167, 
    lng: 30.6000, 
    agents: 45,
    bounds: [
      [30.45, -3.32],
      [30.75, -3.32],
      [30.75, -3.12],
      [30.45, -3.12],
      [30.45, -3.32]
    ]
  },
  { 
    name: 'Cibitoke', 
    lat: -2.8833, 
    lng: 29.1167, 
    agents: 78,
    bounds: [
      [29.00, -2.98],
      [29.23, -2.98],
      [29.23, -2.78],
      [29.00, -2.78],
      [29.00, -2.98]
    ]
  },
  { 
    name: 'Gitega', 
    lat: -3.4271, 
    lng: 29.9246, 
    agents: 234,
    bounds: [
      [29.80, -3.53],
      [30.05, -3.53],
      [30.05, -3.32],
      [29.80, -3.32],
      [29.80, -3.53]
    ]
  },
  { 
    name: 'Karuzi', 
    lat: -3.1000, 
    lng: 30.1667, 
    agents: 56,
    bounds: [
      [30.05, -3.20],
      [30.28, -3.20],
      [30.28, -3.00],
      [30.05, -3.00],
      [30.05, -3.20]
    ]
  },
  { 
    name: 'Kayanza', 
    lat: -2.9167, 
    lng: 29.6333, 
    agents: 98,
    bounds: [
      [29.52, -3.02],
      [29.75, -3.02],
      [29.75, -2.82],
      [29.52, -2.82],
      [29.52, -3.02]
    ]
  },
  { 
    name: 'Kirundo', 
    lat: -2.5833, 
    lng: 30.1000, 
    agents: 87,
    bounds: [
      [29.95, -2.68],
      [30.25, -2.68],
      [30.25, -2.48],
      [29.95, -2.48],
      [29.95, -2.68]
    ]
  },
  { 
    name: 'Makamba', 
    lat: -4.1333, 
    lng: 29.8000, 
    agents: 54,
    bounds: [
      [29.65, -4.23],
      [29.95, -4.23],
      [29.95, -4.03],
      [29.65, -4.03],
      [29.65, -4.23]
    ]
  },
  { 
    name: 'Muramvya', 
    lat: -3.2667, 
    lng: 29.6167, 
    agents: 43,
    bounds: [
      [29.50, -3.37],
      [29.73, -3.37],
      [29.73, -3.17],
      [29.50, -3.17],
      [29.50, -3.37]
    ]
  },
  { 
    name: 'Muyinga', 
    lat: -2.8500, 
    lng: 30.3333, 
    agents: 156,
    bounds: [
      [30.20, -2.95],
      [30.47, -2.95],
      [30.47, -2.75],
      [30.20, -2.75],
      [30.20, -2.95]
    ]
  },
  { 
    name: 'Mwaro', 
    lat: -3.5167, 
    lng: 29.7000, 
    agents: 38,
    bounds: [
      [29.58, -3.62],
      [29.82, -3.62],
      [29.82, -3.42],
      [29.58, -3.42],
      [29.58, -3.62]
    ]
  },
  { 
    name: 'Ngozi', 
    lat: -2.9083, 
    lng: 29.8306, 
    agents: 189,
    bounds: [
      [29.70, -3.00],
      [29.96, -3.00],
      [29.96, -2.80],
      [29.70, -2.80],
      [29.70, -3.00]
    ]
  },
  { 
    name: 'Rumonge', 
    lat: -3.9733, 
    lng: 29.4386, 
    agents: 72,
    bounds: [
      [29.30, -4.08],
      [29.58, -4.08],
      [29.58, -3.88],
      [29.30, -3.88],
      [29.30, -4.08]
    ]
  },
  { 
    name: 'Rutana', 
    lat: -3.9333, 
    lng: 30.0167, 
    agents: 51,
    bounds: [
      [29.88, -4.03],
      [30.15, -4.03],
      [30.15, -3.83],
      [29.88, -3.83],
      [29.88, -4.03]
    ]
  },
  { 
    name: 'Ruyigi', 
    lat: -3.4833, 
    lng: 30.2500, 
    agents: 64,
    bounds: [
      [30.10, -3.58],
      [30.40, -3.58],
      [30.40, -3.38],
      [30.10, -3.38],
      [30.10, -3.58]
    ]
  }
];

// Données d'agents fictifs avec géolocalisation - Distribution optimisée
export const AGENTS_DATA = [
  // Bujumbura Mairie - 3 agents bien espacés
  { id: 'AG001', nom: 'Jean Mukiza', lat: -3.3614, lng: 29.3599, province: 'Bujumbura Mairie', status: 'actif', float: 2500000, transactions: 1234 },
  { id: 'AG002', nom: 'Marie Ndayisenga', lat: -3.3800, lng: 29.3800, province: 'Bujumbura Mairie', status: 'actif', float: 1800000, transactions: 987 },
  { id: 'AG003', nom: 'Pierre Nkurunziza', lat: -3.3450, lng: 29.3450, province: 'Bujumbura Mairie', status: 'inactif', float: 3200000, transactions: 1456 },
  
  // Gitega - 2 agents
  { id: 'AG004', nom: 'Grace Irakoze', lat: -3.4271, lng: 29.9246, province: 'Gitega', status: 'actif', float: 1500000, transactions: 876 },
  { id: 'AG005', nom: 'David Niyonzima', lat: -3.4500, lng: 29.9500, province: 'Gitega', status: 'actif', float: 2100000, transactions: 1023 },
  
  // Ngozi - 2 agents
  { id: 'AG006', nom: 'Sarah Nshimirimana', lat: -2.9083, lng: 29.8306, province: 'Ngozi', status: 'actif', float: 1900000, transactions: 945 },
  { id: 'AG007', nom: 'Emmanuel Ndikumana', lat: -2.9300, lng: 29.8500, province: 'Ngozi', status: 'actif', float: 500000, transactions: 234 },
  
  // Muyinga - 1 agent
  { id: 'AG008', nom: 'Claudine Bizimana', lat: -2.8500, lng: 30.3333, province: 'Muyinga', status: 'actif', float: 1700000, transactions: 789 },
  
  // Kayanza - 1 agent
  { id: 'AG009', nom: 'Beatrice Niyonkuru', lat: -2.9167, lng: 29.6333, province: 'Kayanza', status: 'actif', float: 1600000, transactions: 678 },
  
  // Bururi - 1 agent
  { id: 'AG010', nom: 'Patrick Nzeyimana', lat: -3.9500, lng: 29.6167, province: 'Bururi', status: 'actif', float: 1400000, transactions: 567 }
];

// Style de la carte (dark mode)
export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

// Couleurs pour les statuts
export const STATUS_COLORS = {
  actif: '#42b72a',
  inactif: '#8B1538',
  alerte: '#F58424'
};

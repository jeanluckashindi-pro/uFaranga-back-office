import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../../config/mapbox';
import {
  MapPin, Search, Home, Layers, X, Users, Globe as GlobeIcon,
  ChevronRight, Building2, MapPinned, GripVertical, ChevronDown, ChevronUp
} from 'lucide-react';
import apiService from '../../services/api';
import { RadialSpinner } from '../../components/common/Spinner';

mapboxgl.accessToken = MAPBOX_TOKEN;

const GEO_PAYS_SOURCE_ID = 'geo-pays';
const COUNTRY_SOURCE_ID = 'country-boundaries';
const SOUSREGION_LAYER_PREFIX = 'country-border-sousregion-';

const COULEUR_NON_OCCUPE = '#007BFF';   // blue (legacy)
const COULEUR_OCCUPE = '#F58424';       // secondary (pays/zone occupés)
const COULEUR_GRIS = '#6B7280';
/** Pays du système : bleu transparent (tous les pays de la base) */
const COULEUR_PAYS_SYSTEME = '#007BFF'; // blue, opacity via paint
const COULEUR_PROVINCE_NON_OCCUPE = '#4B5563'; // gray-600
const COULEUR_PROVINCE = COULEUR_PROVINCE_NON_OCCUPE;  // provinces non occupées = gris
const COULEUR_DISTRICT_NON_OCCUPE = '#4B5563'; // gray-600
const COULEUR_DISTRICT = '#F58424';     // districts occupés = secondary
const COULEUR_QUARTIER = '#10b981';     // emerald
/** Contour des cercles (provinces/districts/quartiers) : couleur distincte du pays */
const COULEUR_ENCERCLEMENT = '#E5E7EB';
const ZONE_SOURCE_ID = 'zones-selected-country';

/** Palette pro par sous-région (vision géographique cohérente, couleurs distinctes) */
const SOUS_REGION_PALETTE = {
  'afrique-australe': '#0EA5E9',      // sky-500
  'afrique-de-lest': '#8B5CF6',      // violet-500
  'afrique-centrale': '#059669',      // emerald-600
  'afrique-de-louest': '#D97706',     // amber-600
  'afrique-du-nord': '#DC2626',       // red-600
  'afrique-orientale': '#8B5CF6',
  'afrique-occidentale': '#D97706',
  'southern-africa': '#0EA5E9',
  'eastern-africa': '#8B5CF6',
  'western-africa': '#D97706',
  'middle-africa': '#059669',
  'northern-africa': '#DC2626',
};
const SOUS_REGION_FALLBACK = '#64748B'; // slate-500

function slugSousRegion(s) {
  if (!s || typeof s !== 'string') return 'autre';
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/'/g, '')
    .replace(/\s+/g, '-')
    .replace(/l-est/g, 'lest')
    .replace(/l-ouest/g, 'louest')
    .replace(/[^a-z0-9-]/g, '')
    .trim() || 'autre';
}

function getCouleurSousRegion(sousRegion) {
  const slug = slugSousRegion(sousRegion);
  return SOUS_REGION_PALETTE[slug] ?? SOUS_REGION_FALLBACK;
}

function isActifAutorise(item) {
  return item && (item.est_actif === true && (item.autorise_systeme === true || item.autorise_systeme === undefined));
}

function parseCoord(v) {
  if (v == null) return NaN;
  const s = String(v).trim().replace(',', '.');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

/** Extrait la géométrie pour Mapbox : API peut renvoyer une Feature → utiliser .geometry */
function getGeometryForMap(item) {
  const g = item?.geometry;
  if (!g) return null;
  if (g.type === 'Feature' && g.geometry) return g.geometry;
  if (g.type === 'Polygon' || g.type === 'MultiPolygon' || g.type === 'Point') return g;
  return null;
}

/** Bounding box depuis l'item (bbox_ouest, bbox_sud, bbox_est, bbox_nord) → [[lngMin, latMin], [lngMax, latMax]] pour Mapbox fitBounds */
function getBoundsFromItem(item) {
  const west = parseCoord(item?.bbox_ouest);
  const south = parseCoord(item?.bbox_sud);
  const east = parseCoord(item?.bbox_est);
  const north = parseCoord(item?.bbox_nord);
  if (!Number.isFinite(west) || !Number.isFinite(south) || !Number.isFinite(east) || !Number.isFinite(north)) return null;
  return [[west, south], [east, north]];
}

/** Centre dérivé de la bbox en priorité (pas du point centre API), sinon fallback centre_latitude/centre_longitude */
function getCentreLngLat(item) {
  const b = getBoundsFromItem(item);
  if (b) {
    const lng = (b[0][0] + b[1][0]) / 2;
    const lat = (b[0][1] + b[1][1]) / 2;
    return [lng, lat];
  }
  const lat = parseCoord(item?.centre_latitude ?? item?.latitude_centre ?? item?.latitude);
  const lng = parseCoord(item?.centre_longitude ?? item?.longitude_centre ?? item?.longitude);
  return (Number.isFinite(lat) && Number.isFinite(lng)) ? [lng, lat] : null;
}

/** Construit un GeoJSON FeatureCollection des pays pour la carte (endpoint geo/pays/) */
function buildPaysGeoJSON(countries) {
  if (!Array.isArray(countries) || countries.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }
  const features = [];
  countries.forEach((c) => {
    const geom = getGeometryForMap(c);
    const centre = getCentreLngLat(c);
    let geometry = null;
    if (geom && (geom.type === 'Polygon' || geom.type === 'MultiPolygon')) {
      geometry = geom;
    } else if (geom && geom.type === 'Point' && Array.isArray(geom.coordinates)) {
      geometry = geom;
    } else if (centre) {
      geometry = { type: 'Point', coordinates: centre };
    }
    if (!geometry) return;
    features.push({
      type: 'Feature',
      geometry,
      properties: {
        id: String(c.id),
        iso_3166_1: c.code_iso_2 || '',
        nom: c.nom || '',
        est_actif: c.est_actif ? 1 : 0,
      },
    });
  });
  return { type: 'FeatureCollection', features };
}

function CartographieReseau() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null); // { type: 'pays'|'province'|'district', data }
  const [expandedProvinces, setExpandedProvinces] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/dark-v11');
  const [viewMode, setViewMode] = useState('2d');
  const [statsExpanded, setStatsExpanded] = useState(false);
  const [statsPosition, setStatsPosition] = useState(null);
  const [panelPosition, setPanelPosition] = useState(null);
  const [draggingCard, setDraggingCard] = useState(null);
  const [hierarchyLoading, setHierarchyLoading] = useState(false);
  const [hierarchyError, setHierarchyError] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const mapWrapperRef = useRef(null);
  const statsCardRef = useRef(null);
  const panelRef = useRef(null);
  const zonesSourceId = ZONE_SOURCE_ID;
  const selectedCountryRef = useRef(null);
  selectedCountryRef.current = selectedCountry;
  const countriesDataRef = useRef([]);
  countriesDataRef.current = countriesData;

  const fetchGeoPays = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiService.getGeoPays();
      const list = Array.isArray(data) ? data : (data?.results ?? []);
      setCountriesData(list);
    } catch (err) {
      console.error('Erreur chargement pays (geo):', err);
      setCountriesData([]);
      setFetchError(err?.message || 'Impossible de charger les données.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeoPays();
  }, [fetchGeoPays]);

  // Au clic sur un pays : charger les provinces via API geo
  useEffect(() => {
    const paysId = selectedCountry?.id;
    if (!paysId) {
      setHierarchyError(null);
      return;
    }
    let cancelled = false;
    setHierarchyError(null);
    setHierarchyLoading(true);
    apiService
      .getGeoProvinces(paysId)
      .then((list) => {
        if (cancelled) return;
        setSelectedCountry((prev) => {
          if (!prev || String(prev.id) !== String(paysId)) return prev;
          return { ...prev, provinces: Array.isArray(list) ? list : [] };
        });
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Erreur chargement provinces (geo):', err);
          setHierarchyError(err?.message || 'Impossible de charger les provinces.');
          setSelectedCountry((prev) => prev && String(prev.id) === String(paysId) ? { ...prev, provinces: [] } : prev);
        }
      })
      .finally(() => {
        if (!cancelled) setHierarchyLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedCountry?.id]);

  // Charger les districts quand on sélectionne une province (si pas encore chargés)
  useEffect(() => {
    const prov = selectedRegion?.type === 'province' ? selectedRegion?.data : null;
    if (!prov?.id || (prov.districts && Array.isArray(prov.districts))) return;
    let cancelled = false;
    apiService.getGeoDistricts(prov.id).then((list) => {
      if (cancelled) return;
      setSelectedCountry((prev) => {
        if (!prev?.provinces) return prev;
        return {
          ...prev,
          provinces: prev.provinces.map((p) =>
            String(p.id) === String(prov.id) ? { ...p, districts: list } : p
          ),
        };
      });
      setSelectedRegion((prev) =>
        prev?.type === 'province' && String(prev?.data?.id) === String(prov.id)
          ? { ...prev, data: { ...prev.data, districts: list } }
          : prev
      );
    });
    return () => { cancelled = true; };
  }, [selectedRegion?.type, selectedRegion?.data?.id]);

  // Charger les quartiers quand on sélectionne un district (si pas encore chargés)
  useEffect(() => {
    const dist = selectedRegion?.type === 'district' ? selectedRegion?.data : null;
    if (!dist?.id || (dist.quartiers && Array.isArray(dist.quartiers))) return;
    let cancelled = false;
    apiService.getGeoQuartiers(dist.id).then((list) => {
      if (cancelled) return;
      setSelectedCountry((prev) => {
        if (!prev?.provinces) return prev;
        return {
          ...prev,
          provinces: prev.provinces.map((p) => ({
            ...p,
            districts: (p.districts || []).map((d) =>
              String(d.id) === String(dist.id) ? { ...d, quartiers: list } : d
            ),
          })),
        };
      });
      setSelectedRegion((prev) =>
        prev?.type === 'district' && String(prev?.data?.id) === String(dist.id)
          ? { ...prev, data: { ...prev.data, quartiers: list } }
          : prev
      );
    });
    return () => { cancelled = true; };
  }, [selectedRegion?.type, selectedRegion?.data?.id]);

  const allCountryCodes = countriesData.map((p) => p.code_iso_2).filter(Boolean);
  const activeCountryCodes = countriesData
    .filter((p) => isActifAutorise(p))
    .map((p) => p.code_iso_2)
    .filter(Boolean);

  const paysGeoJSON = useMemo(() => buildPaysGeoJSON(countriesData), [countriesData]);

  const filteredCountries = countriesData.filter(
    (c) =>
      (c.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.code_iso_2 || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** Pays filtrés groupés par sous-région pour l’affichage panneau (ordre stable, libellés propres) */
  const filteredCountriesBySousRegion = useMemo(() => {
    const groups = {};
    filteredCountries.forEach((c) => {
      const sr = c.sous_region || 'Autre';
      if (!groups[sr]) groups[sr] = [];
      groups[sr].push(c);
    });
    return Object.entries(groups).sort((a, b) => (a[0] || '').localeCompare(b[0] || ''));
  }, [filteredCountries]);

  // Grouper les pays par sous-région pour la carte et la légende
  const sousRegionToCodes = useMemo(() => {
    const m = {};
    countriesData.forEach((p) => {
      const sr = p.sous_region || 'Autre';
      if (!m[sr]) m[sr] = [];
      if (p.code_iso_2) m[sr].push(p.code_iso_2);
    });
    return m;
  }, [countriesData]);

  const displayStats = selectedCountry
    ? {
        countries: 1,
        agents: selectedCountry.nombre_agents ?? 0,
        users: selectedCountry.nombre_utilisateurs ?? 0,
        provinces: selectedCountry.provinces?.length ?? 0,
        districts: (selectedCountry.provinces || []).reduce(
          (acc, p) => acc + (p.districts?.length ?? 0),
          0
        ),
      }
    : {
        countries: countriesData.length,
        agents: countriesData.reduce((s, c) => s + (c.nombre_agents ?? 0), 0),
        users: countriesData.reduce((s, c) => s + (c.nombre_utilisateurs ?? 0), 0),
        provinces: countriesData.reduce((s, c) => s + (c.provinces?.length ?? 0), 0),
        districts: countriesData.reduce(
          (s, c) => s + (c.provinces || []).reduce((a, p) => a + (p.districts?.length ?? 0), 0),
          0
        ),
      };

  const handleDragStart = useCallback((card, e) => {
    if (e.button !== 0 || !mapWrapperRef.current) return;
    const el = card === 'stats' ? statsCardRef.current : panelRef.current;
    if (!el) return;
    const wr = mapWrapperRef.current.getBoundingClientRect();
    const cr = el.getBoundingClientRect();
    const left = cr.left - wr.left;
    const top = cr.top - wr.top;
    setStatsPosition((prev) => (card === 'stats' ? (prev ?? { x: left, y: top }) : prev));
    setPanelPosition((prev) => (card === 'panel' ? (prev ?? { x: left, y: top }) : prev));
    setDraggingCard(card);
    dragStartRef.current = { x: e.clientX, y: e.clientY, left, top };
  }, []);

  useEffect(() => {
    if (!draggingCard) return;
    const onMove = (e) => {
      const { x, y, left, top } = dragStartRef.current;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      if (draggingCard === 'stats') {
        setStatsPosition({ x: left + dx, y: top + dy });
      } else {
        setPanelPosition({ x: left + dx, y: top + dy });
      }
    };
    const onUp = () => setDraggingCard(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [draggingCard]);

  // Initialiser la carte et les couches
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [25, -2],
      zoom: 4,
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
    });

    map.current.on('load', () => {
      if (!map.current.getSource(GEO_PAYS_SOURCE_ID)) {
        map.current.addSource(GEO_PAYS_SOURCE_ID, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] },
        });
      }

      map.current.addLayer({
        id: 'geo-pays-fill',
        type: 'fill',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: {
          'fill-color': ['case', ['==', ['get', 'est_actif'], 1], COULEUR_OCCUPE, COULEUR_PAYS_SYSTEME],
          'fill-opacity': 0.45,
        },
      });
      map.current.addLayer({
        id: 'geo-pays-line',
        type: 'line',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: { 'line-color': COULEUR_ENCERCLEMENT, 'line-width': 1.5 },
      });
      map.current.addLayer({
        id: 'geo-pays-circles',
        type: 'circle',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': ['case', ['==', ['get', 'est_actif'], 1], COULEUR_OCCUPE, COULEUR_PAYS_SYSTEME],
          'circle-opacity': 0.6,
          'circle-stroke-width': 2,
          'circle-stroke-color': COULEUR_ENCERCLEMENT,
        },
      });

      const handlePaysClick = (e) => {
        const feat = e.features?.[0];
        const id = feat?.properties?.id;
        if (!id) return;
        const country = (countriesDataRef.current || []).find((c) => String(c.id) === id);
        if (country) {
          setSelectedCountry(country);
          setSelectedRegion({ type: 'pays', data: country });
          if (map.current) {
            const bounds = getBoundsFromItem(country);
            if (bounds) {
              map.current.fitBounds(bounds, { padding: 60, duration: 1500, maxZoom: 12 });
            } else {
              const centre = getCentreLngLat(country);
              if (centre) map.current.flyTo({ center: centre, zoom: 6, duration: 1500 });
            }
          }
        }
      };

      ['geo-pays-fill', 'geo-pays-line', 'geo-pays-circles'].forEach((layerId) => {
        map.current.on('click', layerId, handlePaysClick);
        map.current.on('mouseenter', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
        map.current.on('mouseleave', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = ''; });
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

  // Mettre à jour la source geo-pays quand les données pays changent
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const src = map.current.getSource(GEO_PAYS_SOURCE_ID);
    if (src) src.setData(paysGeoJSON);
  }, [mapLoaded, paysGeoJSON]);

  // Découpage par niveau : pays → provinces (polygones ou cercles), puis province → districts, puis district → quartiers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const removeZones = () => {
      if (!map.current) return;
      ['zones-quartiers', 'zones-districts', 'zones-provinces', 'zones-fill', 'zones-line', 'zones-circles',
        'zones-quartiers-stroke', 'zones-districts-stroke', 'zones-provinces-stroke'].forEach((id) => {
        if (map.current.getLayer(id)) map.current.removeLayer(id);
      });
      if (map.current.getSource(zonesSourceId)) map.current.removeSource(zonesSourceId);
    };

    if (!selectedCountry?.provinces?.length) {
      removeZones();
      return;
    }

    const defaultMapCentre = [25, -2];
    const countryCentre = getCentreLngLat(selectedCountry) || defaultMapCentre;

    const sizeFromSuperficie = (km2, level) => {
      const s = Number(km2);
      if (!Number.isFinite(s) || s <= 0) return level === 'province' ? 40 : level === 'district' ? 15 : 6;
      const sqrt = Math.sqrt(s);
      return level === 'province' ? Math.max(20, Math.min(120, sqrt * 1.2)) : level === 'district' ? Math.max(8, Math.min(50, sqrt * 0.5)) : Math.max(5, Math.min(25, sqrt * 0.2));
    };

    // Un seul niveau affiché à la fois : provinces, ou districts de la province sélectionnée, ou quartiers du district sélectionné
    const selType = selectedRegion?.type;
    const features = [];

    if (selType === 'district' && selectedRegion?.data) {
      const dist = selectedRegion.data;
      (dist.quartiers || []).forEach((q) => {
        const geom = getGeometryForMap(q);
        const pos = getCentreLngLat(q) || countryCentre;
        if (geom && (geom.type === 'Polygon' || geom.type === 'MultiPolygon') && Array.isArray(geom.coordinates)) {
          features.push({
            type: 'Feature',
            geometry: geom,
            properties: { id: String(q.id), nom: q.nom || '', level: 'quartier', occupé: isActifAutorise(q) ? 1 : 0, size: sizeFromSuperficie(q.superficie_km2 ?? q.metadonnees?.superficie_km2, 'quartier') },
          });
        } else if (pos) {
          features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: pos },
            properties: { id: String(q.id), nom: q.nom || '', level: 'quartier', occupé: isActifAutorise(q) ? 1 : 0, size: sizeFromSuperficie(q.superficie_km2 ?? q.metadonnees?.superficie_km2, 'quartier') },
          });
        }
      });
    } else if (selType === 'province' && selectedRegion?.data) {
      const prov = selectedRegion.data;
      (prov.districts || []).forEach((dist) => {
        const geom = getGeometryForMap(dist);
        const pos = getCentreLngLat(dist) || countryCentre;
        if (geom && (geom.type === 'Polygon' || geom.type === 'MultiPolygon') && Array.isArray(geom.coordinates)) {
          features.push({
            type: 'Feature',
            geometry: geom,
            properties: { id: String(dist.id), nom: dist.nom || '', level: 'district', occupé: isActifAutorise(dist) ? 1 : 0, province_id: String(prov.id), size: sizeFromSuperficie(dist.superficie_km2 ?? dist.metadonnees?.superficie_km2, 'district') },
          });
        } else if (pos) {
          features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: pos },
            properties: { id: String(dist.id), nom: dist.nom || '', level: 'district', occupé: isActifAutorise(dist) ? 1 : 0, province_id: String(prov.id), size: sizeFromSuperficie(dist.superficie_km2 ?? dist.metadonnees?.superficie_km2, 'district') },
          });
        }
      });
    } else {
      (selectedCountry.provinces || []).forEach((prov) => {
        const geom = getGeometryForMap(prov);
        const pos = getCentreLngLat(prov) || countryCentre;
        if (geom && (geom.type === 'Polygon' || geom.type === 'MultiPolygon') && Array.isArray(geom.coordinates)) {
          features.push({
            type: 'Feature',
            geometry: geom,
            properties: { id: String(prov.id), nom: prov.nom || '', level: 'province', occupé: isActifAutorise(prov) ? 1 : 0, size: sizeFromSuperficie(prov.superficie_km2 ?? prov.metadonnees?.superficie_km2, 'province') },
          });
        } else if (pos) {
          features.push({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: pos },
            properties: { id: String(prov.id), nom: prov.nom || '', level: 'province', occupé: isActifAutorise(prov) ? 1 : 0, size: sizeFromSuperficie(prov.superficie_km2 ?? prov.metadonnees?.superficie_km2, 'province') },
          });
        }
      });
    }

    removeZones();
    if (features.length === 0) return;
    const geo = { type: 'FeatureCollection', features };

    map.current.addSource(zonesSourceId, { type: 'geojson', data: geo });

    const findRegion = (id, level) => {
      const c = selectedCountryRef.current;
      if (!c) return null;
      if (level === 'province') return c.provinces?.find((p) => String(p.id) === id) || null;
      for (const p of c.provinces || []) {
        if (level === 'district') { const d = p.districts?.find((dd) => String(dd.id) === id); if (d) return d; }
        for (const d of p.districts || []) {
          if (level === 'quartier') { const q = d.quartiers?.find((qq) => String(qq.id) === id); if (q) return q; }
        }
      }
      return null;
    };

    const handleZoneClick = (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const { id, level } = f.properties;
      const type = level === 'province' ? 'province' : level === 'district' ? 'district' : 'quartier';
      const data = findRegion(id, level);
      if (data) {
        setSelectedRegion({ type, data });
        if (type === 'province') setExpandedProvinces((prev) => new Set(prev).add(id));
        const bounds = getBoundsFromItem(data);
        if (bounds && map.current) {
          map.current.fitBounds(bounds, { padding: 80, duration: 800, maxZoom: 14 });
        }
      }
    };

    // Polygones (découpage comme les pays) : fill + line
    map.current.addLayer({
      id: 'zones-fill',
      type: 'fill',
      source: zonesSourceId,
      filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
      paint: {
        'fill-color': ['case', ['==', ['get', 'occupé'], 1], COULEUR_OCCUPE, COULEUR_PROVINCE],
        'fill-opacity': 0.4,
      },
    });
    map.current.addLayer({
      id: 'zones-line',
      type: 'line',
      source: zonesSourceId,
      filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
      paint: {
        'line-color': COULEUR_ENCERCLEMENT,
        'line-width': 2,
      },
    });

    const circleRadiusExpr = ['interpolate', ['linear'], ['zoom'], 5, ['*', ['get', 'size'], 0.18], 8, ['*', ['get', 'size'], 0.45], 12, ['*', ['get', 'size'], 0.9]];
    map.current.addLayer({
      id: 'zones-circles',
      type: 'circle',
      source: zonesSourceId,
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': circleRadiusExpr,
        'circle-color': ['case', ['==', ['get', 'occupé'], 1], COULEUR_OCCUPE, COULEUR_PROVINCE],
        'circle-opacity': 0.5,
        'circle-stroke-width': 2.5,
        'circle-stroke-color': COULEUR_ENCERCLEMENT,
      },
    });

    const zoneLayerIds = ['zones-fill', 'zones-line', 'zones-circles'];
    zoneLayerIds.forEach((layerId) => {
      map.current.on('click', layerId, handleZoneClick);
      map.current.on('mouseenter', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
      map.current.on('mouseleave', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = ''; });
    });

    return () => {
      if (map.current) {
        removeZones();
        zoneLayerIds.forEach((layerId) => {
          map.current.off('click', layerId);
          map.current.off('mouseenter', layerId);
          map.current.off('mouseleave', layerId);
        });
      }
    };
  }, [mapLoaded, selectedCountry, selectedRegion]);


  const flyToCountry = (country) => {
    if (!map.current || !country) return;
    const bounds = getBoundsFromItem(country);
    if (bounds) {
      map.current.fitBounds(bounds, { padding: 60, duration: 1500, maxZoom: 12 });
    } else {
      const centre = getCentreLngLat(country);
      if (centre) map.current.flyTo({ center: centre, zoom: 6, duration: 1500 });
    }
    setSelectedCountry(country);
    setSelectedRegion({ type: 'pays', data: country });
  };

  const changeMapStyle = (style) => {
    if (!map.current) return;
    const center = map.current.getCenter();
    const zoom = map.current.getZoom();
    const pitch = map.current.getPitch();
    const bearing = map.current.getBearing();

    map.current.setStyle(style);
    setMapStyle(style);

    map.current.once('style.load', () => {
      map.current.jumpTo({ center, zoom, pitch, bearing });
      if (!map.current.getSource(GEO_PAYS_SOURCE_ID)) {
        map.current.addSource(GEO_PAYS_SOURCE_ID, {
          type: 'geojson',
          data: paysGeoJSON,
        });
      }
      map.current.addLayer({
        id: 'geo-pays-fill',
        type: 'fill',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: {
          'fill-color': ['case', ['==', ['get', 'est_actif'], 1], COULEUR_OCCUPE, COULEUR_PAYS_SYSTEME],
          'fill-opacity': 0.45,
        },
      });
      map.current.addLayer({
        id: 'geo-pays-line',
        type: 'line',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
        paint: { 'line-color': COULEUR_ENCERCLEMENT, 'line-width': 1.5 },
      });
      map.current.addLayer({
        id: 'geo-pays-circles',
        type: 'circle',
        source: GEO_PAYS_SOURCE_ID,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 8,
          'circle-color': ['case', ['==', ['get', 'est_actif'], 1], COULEUR_OCCUPE, COULEUR_PAYS_SYSTEME],
          'circle-opacity': 0.6,
          'circle-stroke-width': 2,
          'circle-stroke-color': COULEUR_ENCERCLEMENT,
        },
      });
      const handlePaysClick = (e) => {
        const feat = e.features?.[0];
        const id = feat?.properties?.id;
        if (!id) return;
        const country = (countriesDataRef.current || []).find((c) => String(c.id) === id);
        if (country) {
          setSelectedCountry(country);
          setSelectedRegion({ type: 'pays', data: country });
          if (map.current) {
            const bounds = getBoundsFromItem(country);
            if (bounds) map.current.fitBounds(bounds, { padding: 60, duration: 1500, maxZoom: 12 });
            else {
              const centre = getCentreLngLat(country);
              if (centre) map.current.flyTo({ center: centre, zoom: 6, duration: 1500 });
            }
          }
        }
      };
      ['geo-pays-fill', 'geo-pays-line', 'geo-pays-circles'].forEach((layerId) => {
        map.current.on('click', layerId, handlePaysClick);
        map.current.on('mouseenter', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = 'pointer'; });
        map.current.on('mouseleave', layerId, () => { if (map.current) map.current.getCanvas().style.cursor = ''; });
      });
    });
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
      map.current.flyTo({
        center: [25, -2],
        zoom: 4,
        pitch: 0,
        bearing: 0,
        duration: 1500,
      });
    }
    setSelectedCountry(null);
    setSelectedRegion(null);
    setExpandedProvinces(new Set());
  };

  const toggleProvince = (provinceId) => {
    setExpandedProvinces((prev) => {
      const next = new Set(prev);
      if (next.has(provinceId)) next.delete(provinceId);
      else next.add(provinceId);
      return next;
    });
  };

  return (
    <div
      className="w-full h-screen flex flex-col bg-background"
      style={{ height: 'calc(100vh - 73px)' }}
    >
      <div ref={mapWrapperRef} className="flex-1 relative">
        <div ref={mapContainer} className="w-full h-full" />

        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
              <div className="flex flex-col items-center gap-5">
                <RadialSpinner size="medium" color="primary" />
                <span className="text-sm font-medium text-primary animate-pulse">Chargement de la carte...</span>
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl rounded-xl overflow-hidden bg-card/90 border border-darkGray p-5 shadow-xl">
              <div className="skeleton-shimmer-dark h-4 rounded w-1/4 mb-4" />
              <div className="flex gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex-1 flex flex-col gap-2">
                    <div className="skeleton-shimmer-dark h-3 rounded w-full" />
                    <div className="skeleton-shimmer-dark h-8 rounded w-14" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
            title={viewMode === '2d' ? 'Passer en 3D' : 'Passer en 2D'}
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

        {/* Carte statistiques : réductible par défaut, déplaçable */}
        <div
          ref={statsCardRef}
          className={`absolute z-10 ${statsPosition == null ? 'top-4 left-1/2 -translate-x-1/2' : ''}`}
          style={statsPosition != null ? { left: statsPosition.x, top: statsPosition.y } : undefined}
        >
          <div
            className="bg-card/95 backdrop-blur-sm border border-darkGray rounded-xl shadow-xl overflow-hidden min-w-0"
            onClick={() => !statsExpanded && setStatsExpanded(true)}
          >
            <div
              className={`flex items-center gap-2 px-3 py-1.5 border-b border-darkGray/50 bg-darkGray/20 cursor-grab active:cursor-grabbing select-none ${draggingCard === 'stats' ? 'opacity-90' : ''}`}
              onMouseDown={(e) => { e.stopPropagation(); handleDragStart('stats', e); }}
            >
              <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
              {selectedCountry && (
                <span className="text-xs text-secondary font-semibold truncate flex-1 min-w-0">
                  {selectedCountry.nom}
                </span>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setStatsExpanded((v) => !v); }}
                className="p-1 rounded hover:bg-darkGray/50 text-gray-400 hover:text-text ml-auto"
                title={statsExpanded ? 'Réduire' : 'Agrandir'}
              >
                {statsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {selectedCountry && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSelectedCountry(null); }}
                  className="p-1 hover:bg-danger/20 rounded text-gray-400 hover:text-danger"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            {statsExpanded ? (
              <div className="px-4 py-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center min-w-[3rem]">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Pays</div>
                    <div className="text-lg font-bold text-primary">{displayStats.countries}</div>
                  </div>
                  <div className="h-8 w-px bg-darkGray" />
                  <div className="text-center min-w-[3rem]">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Agents</div>
                    <div className="text-lg font-bold text-secondary">{(displayStats.agents / 1000).toFixed(1)}K</div>
                  </div>
                  <div className="h-8 w-px bg-darkGray" />
                  <div className="text-center min-w-[3rem]">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Utilisateurs</div>
                    <div className="text-lg font-bold text-text">{(displayStats.users / 1000000).toFixed(2)}M</div>
                  </div>
                  <div className="h-8 w-px bg-darkGray" />
                  <div className="text-center min-w-[3rem]">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Provinces</div>
                    <div className="text-lg font-bold text-text">{displayStats.provinces}</div>
                  </div>
                  <div className="h-8 w-px bg-darkGray" />
                  <div className="text-center min-w-[3rem]">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Districts</div>
                    <div className="text-lg font-bold text-text">{displayStats.districts}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 px-4 py-2">
                <div className="flex items-center gap-1.5" title="Pays">
                  <GlobeIcon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">{displayStats.countries}</span>
                </div>
                <div className="w-px h-5 bg-darkGray" />
                <div className="flex items-center gap-1.5" title="Agents">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-bold text-secondary">{(displayStats.agents / 1000).toFixed(1)}K</span>
                </div>
                <div className="w-px h-5 bg-darkGray" />
                <div className="flex items-center gap-1.5" title="Utilisateurs">
                  <Users className="w-4 h-4 text-text" />
                  <span className="text-sm font-bold text-text">{(displayStats.users / 1000000).toFixed(2)}M</span>
                </div>
                <div className="w-px h-5 bg-darkGray" />
                <div className="flex items-center gap-1.5" title="Provinces">
                  <Building2 className="w-4 h-4 text-text" />
                  <span className="text-sm font-bold text-text">{displayStats.provinces}</span>
                </div>
                <div className="w-px h-5 bg-darkGray" />
                <div className="flex items-center gap-1.5" title="Districts">
                  <MapPinned className="w-4 h-4 text-text" />
                  <span className="text-sm font-bold text-text">{displayStats.districts}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedCountry && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card/95 backdrop-blur-sm border border-darkGray rounded-lg shadow-lg">
              <GlobeIcon className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-semibold text-sm">{selectedCountry.nom}</span>
              <button
                onClick={() => setSelectedCountry(null)}
                className="ml-1 hover:bg-secondary/30 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3 text-secondary" />
              </button>
            </div>
          </div>
        )}

        {isPanelOpen && (
          <div
            ref={panelRef}
            className={`absolute z-10 w-96 bg-card/95 backdrop-blur-sm border border-darkGray rounded-xl shadow-2xl overflow-hidden flex flex-col ${panelPosition == null ? 'top-4 right-4' : ''}`}
            style={{
              maxHeight: 'calc(100vh - 100px)',
              ...(panelPosition != null ? { left: panelPosition.x, top: panelPosition.y } : {}),
            }}
          >
            <div
              className="p-3 border-b border-darkGray flex items-center justify-between bg-darkGray/30 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => { if (e.target.closest('button') == null) handleDragStart('panel', e); }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <GlobeIcon className="w-4 h-4 text-primary flex-shrink-0" />
                <h3 className="text-sm font-semibold text-text truncate">Cartographie</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="p-1 hover:bg-danger/20 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-danger" />
              </button>
            </div>
            <div className="p-3 border-b border-darkGray">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un pays..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-darkGray rounded-lg text-text text-sm placeholder-gray-500 focus:outline-none focus:border-darkGray"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {fetchError && (
                <div className="p-3 mb-2 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 space-y-2">
                  <p>{fetchError}</p>
                  <p className="text-xs opacity-90">Vérifiez que le backend est démarré et que <code className="bg-red-500/20 px-1 rounded">VITE_API_URL</code> pointe vers l’API (ex. http://127.0.0.1:8000).</p>
                  <button
                    type="button"
                    onClick={() => fetchGeoPays()}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Réessayer
                  </button>
                </div>
              )}
              {loading ? (
                <div className="space-y-2 p-2" aria-label="Chargement">
                  <div className="skeleton-shimmer-dark h-4 w-36 rounded" />
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="p-3 rounded-lg border border-darkGray/40 flex items-center gap-3">
                      <div className="skeleton-shimmer-dark h-2.5 w-2.5 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton-shimmer-dark h-4 rounded w-32" />
                        <div className="skeleton-shimmer-dark h-3 rounded w-44" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !selectedCountry ? (
                <>
                  <p className="text-xs text-gray-400 px-2 py-1 mb-2">
                    {filteredCountries.length === 0
                      ? `Aucun pays chargé. Vérifiez `
                      : `${filteredCountries.length} pays — cliquez sur la carte ou sur un pays`}
                  </p>
                  {filteredCountries.length === 0 && !fetchError && (
                    <button
                      type="button"
                      onClick={() => fetchGeoPays()}
                      className="text-xs font-medium text-primary hover:underline mb-2"
                    >
                      Réessayer le chargement
                    </button>
                  )}
                  {/* Liste type Google Maps — deux couleurs bg du projet : fond par défaut + fond au survol/sélection */}
                  <div className="divide-y divide-darkGray/50">
                    {filteredCountriesBySousRegion.map(([sousRegionLabel, countries]) => (
                      <div key={sousRegionLabel || 'autre'}>
                        <div className="px-2 py-1.5">
                          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                            {sousRegionLabel || 'Autre'}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                        {countries.map((country) => {
                          const isSelected = selectedCountry?.id === country.id;
                          return (
                            <button
                              key={country.id}
                              type="button"
                              onClick={() => flyToCountry(country)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left cursor-pointer transition-colors min-w-0 bg-background rounded-lg border ${
                                isSelected ? 'bg-darkGray/50 border-darkGray' : 'border-darkGray/50 hover:bg-darkGray/30'
                              }`}
                            >
                              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate text-text">{country.nom}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {country.nombre_agents ?? 0} agents · {(country.nombre_utilisateurs ?? 0).toLocaleString()} utilisateurs
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-500" />
                            </button>
                          );
                        })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs text-gray-400">
                      Provinces / Districts
                      {hierarchyLoading && (
                        <span className="ml-2 text-primary animate-pulse">Chargement…</span>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCountry(null);
                        setSelectedRegion(null);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Retour aux pays
                    </button>
                  </div>
                  {hierarchyError && (
                    <div className="mb-2 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      {hierarchyError}
                    </div>
                  )}
                  {hierarchyLoading && (selectedCountry.provinces || []).length === 0 ? (
                    <div className="flex items-center justify-center py-6">
                      <RadialSpinner className="w-8 h-8 text-primary" />
                    </div>
                  ) : null}
                  {(selectedCountry.provinces || []).map((prov) => {
                    const actif = isActifAutorise(prov);
                    const expanded = expandedProvinces.has(prov.id);
                    return (
                      <div key={prov.id} className="mb-1">
                        <div
                          onClick={() => {
                            toggleProvince(prov.id);
                            setSelectedRegion({ type: 'province', data: prov });
                          }}
                          className={`p-2.5 rounded-lg cursor-pointer transition-all border flex items-center justify-between ${
                            actif
                              ? 'bg-secondary/20 border-secondary/60 border-l-4 border-l-secondary'
                              : 'bg-primary/10 border-primary/30 hover:bg-primary/20'
                          } ${selectedRegion?.type === 'province' && selectedRegion?.data?.id === prov.id ? 'ring-1 ring-secondary' : ''}`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <ChevronRight
                              className={`w-4 h-4 flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
                            />
                            <Building2 className="w-4 h-4 flex-shrink-0 text-gray-400" />
                            <span className="font-medium text-sm truncate">{prov.nom}</span>
                            {actif && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 text-secondary font-semibold">
                                Occupé
                              </span>
                            )}
                          </div>
                        </div>
                        {expanded && (prov.districts || []).length > 0 && (
                          <div className="ml-4 mt-1 space-y-1 border-l border-darkGray pl-2">
                            {(prov.districts || []).map((dist) => {
                              const distActif = isActifAutorise(dist);
                              return (
                                <div
                                  key={dist.id}
                                  onClick={() => setSelectedRegion({ type: 'district', data: dist })}
                                  className={`p-2 rounded cursor-pointer transition-all border ${
                                    distActif
                                      ? 'bg-secondary/15 border-secondary/40 border-l-2 border-l-secondary'
                                      : 'bg-primary/10 border-primary/20 hover:bg-primary/15'
                                  } ${selectedRegion?.type === 'district' && selectedRegion?.data?.id === dist.id ? 'ring-1 ring-secondary' : ''}`}
                                >
                                  <div className="flex items-center gap-2">
                                    <MapPinned className="w-3 h-3 flex-shrink-0 text-gray-400" />
                                    <span className="text-xs font-medium">{dist.nom}</span>
                                    {distActif && (
                                      <span className="text-[10px] px-1 rounded bg-secondary/30 text-secondary font-medium">
                                        Occupé
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {selectedRegion?.data && (
              <div className="border-t border-darkGray p-3 bg-background/80 max-h-64 overflow-y-auto">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Détails — {selectedRegion.type === 'pays' ? 'Pays' : selectedRegion.type === 'province' ? 'Province' : selectedRegion.type === 'district' ? 'District' : 'Quartier'}
                </h4>
                <DetailRegion region={selectedRegion.data} type={selectedRegion.type} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRegion({ region, type }) {
  if (!region) return null;
  const actif = isActifAutorise(region);
  const nom = region.nom || region.nom_anglais || '—';
  const stats = region.statistiques || {};
  const meta = region.metadonnees || {};

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-text font-semibold truncate">{nom}</span>
        <span
          className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${
            actif ? 'bg-secondary/25 text-secondary border border-secondary/50' : 'bg-primary/15 text-primary border border-primary/40'
          }`}
        >
          {actif ? 'Occupé' : 'Non occupé'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <div className="bg-card/50 rounded px-2 py-1.5">
          <span className="text-gray-400 block text-[10px] uppercase">Agents</span>
          <span className="font-semibold text-text">{(region.nombre_agents ?? 0).toLocaleString()}</span>
        </div>
        <div className="bg-card/50 rounded px-2 py-1.5">
          <span className="text-gray-400 block text-[10px] uppercase">Utilisateurs</span>
          <span className="font-semibold text-text">{(region.nombre_utilisateurs ?? 0).toLocaleString()}</span>
        </div>
        <div className="bg-card/50 rounded px-2 py-1.5">
          <span className="text-gray-400 block text-[10px] uppercase">Agents actifs</span>
          <span className="font-semibold text-secondary">{(region.nombre_agents_actifs ?? 0).toLocaleString()}</span>
        </div>
        <div className="bg-card/50 rounded px-2 py-1.5">
          <span className="text-gray-400 block text-[10px] uppercase">Users actifs</span>
          <span className="font-semibold text-secondary">{(region.nombre_utilisateurs_actifs ?? 0).toLocaleString()}</span>
        </div>
      </div>
      {Object.keys(stats).length > 0 && (
        <div className="pt-2 border-t border-darkGray">
          <div className="text-[10px] text-gray-400 uppercase font-semibold mb-1.5">Statistiques</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats).map(([k, v]) => (
              <span key={k} className="text-xs bg-darkGray/50 px-2 py-0.5 rounded">
                {k.replace(/_/g, ' ')}: {String(v)}
              </span>
            ))}
          </div>
        </div>
      )}
      {type === 'pays' && (meta.capitale || meta.population != null) && (
        <div className="text-xs text-gray-400 pt-1 border-t border-darkGray/50">
          {meta.capitale && <span>Capitale: <strong className="text-text">{meta.capitale}</strong></span>}
          {meta.population != null && (
            <span className={meta.capitale ? ' ml-2' : ''}>Pop. {Number(meta.population).toLocaleString()}</span>
          )}
        </div>
      )}
      {(type === 'province' || type === 'district') && meta.chef_lieu && (
        <div className="text-xs text-gray-400 pt-1 border-t border-darkGray/50">
          Chef-lieu: <strong className="text-text">{meta.chef_lieu}</strong>
        </div>
      )}
    </div>
  );
}

export default CartographieReseau;

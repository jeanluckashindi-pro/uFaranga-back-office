// Configuration de base pour les appels API
import { getErrorMessage } from '../config/errorMessages';
import secureStorage from '../utils/secureStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Méthode pour obtenir les headers avec le token d'authentification
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = secureStorage.getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Méthode générique pour les requêtes
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Essayer de parser la réponse JSON
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = {};
      }

      if (!response.ok) {
        // Si la réponse contient success: false, extraire les erreurs
        if (data.success === false && data.errors) {
          const errorCode = data.errors.code;
          const errorDetail = data.errors.detail;
          
          // Utiliser le message traduit depuis la configuration
          const errorMessage = getErrorMessage(errorCode, errorDetail);
          throw new Error(errorMessage);
        }
        
        // Extraire le message d'erreur de différentes structures possibles
        const errorMessage = 
          data.detail || 
          data.message || 
          data.error ||
          data.non_field_errors?.[0] ||
          (typeof data === 'string' ? data : null) ||
          getErrorMessage(response.status);
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Gérer les erreurs réseau spécifiques
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur est démarré et que votre connexion internet fonctionne.');
      }
      
      if (error.name === 'TypeError' && error.message.includes('NetworkError')) {
        throw new Error('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      }
      
      // Si c'est déjà une erreur avec un message, la relancer
      if (error.message && !error.message.includes('Failed to fetch')) {
        throw error;
      }
      
      // Sinon, créer une erreur générique
      console.error('Erreur API:', error);
      throw new Error('Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré sur http://127.0.0.1:8000');
    }
  }

  // Méthodes d'authentification
  async login(username, password, rememberMe = false) {
    return this.request('/api/v1/authentification/connexion/', {
      method: 'POST',
      body: JSON.stringify({ 
        username, 
        password,
        remember_me: rememberMe 
      }),
      includeAuth: false,
    });
  }

  async register(userData) {
    return this.request('/api/v1/authentification/inscription/', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  }

  async refreshToken(refreshToken) {
    return this.request('/api/v1/authentification/jeton/actualiser/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
      includeAuth: false,
    });
  }

  async logout(refreshToken) {
    return this.request('/api/v1/authentification/deconnexion/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async logoutAll() {
    return this.request('/api/v1/authentification/deconnexion-toutes/', {
      method: 'POST',
    });
  }

  async logoutOtherSessions() {
    const refreshToken = secureStorage.getRefreshToken();
    return this.request('/api/v1/authentification/deconnexion-autres/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    });
  }

  async getProfile() {
    return this.request('/api/v1/authentification/moi/');
  }

  async updateProfile(data) {
    return this.request('/api/v1/authentification/moi/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async changePassword(oldPassword, newPassword) {
    return this.request('/api/v1/authentification/modifier-mot-de-passe/', {
      method: 'POST',
      body: JSON.stringify({ 
        old_password: oldPassword, 
        new_password: newPassword 
      }),
    });
  }

  async forgotPassword(username) {
    return this.request('/api/v1/authentification/mot-de-passe-oublie/', {
      method: 'POST',
      body: JSON.stringify({ username }),
      includeAuth: false,
    });
  }

  async resetPassword(token, newPassword) {
    return this.request('/api/v1/authentification/reinitialiser-mot-de-passe/', {
      method: 'POST',
      body: JSON.stringify({ 
        token, 
        new_password: newPassword 
      }),
      includeAuth: false,
    });
  }

  // Méthodes pour les données métier
  async getDashboardData() {
    return this.request('/api/v1/dashboard/');
  }

  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/transactions/${queryString ? `?${queryString}` : ''}`);
  }

  async getAgents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/agents/${queryString ? `?${queryString}` : ''}`);
  }

  async getClients(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/clients/${queryString ? `?${queryString}` : ''}`);
  }

  // Méthode pour récupérer les utilisateurs avec filtres
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/identite/utilisateurs/${queryString ? `?${queryString}` : ''}`);
  }

  async deleteUser(userId) {
    return this.request(`/api/v1/identite/utilisateurs/${userId}/`, {
      method: 'DELETE'
    });
  }

  // Méthodes pour les profils/rôles
  async getProfils() {
    return this.getAllPages('/api/v1/identite/profils');
  }

  async createProfil(profilData) {
    return this.request('/api/v1/identite/profils/', {
      method: 'POST',
      body: JSON.stringify(profilData)
    });
  }

  async updateProfil(profilId, profilData) {
    return this.request(`/api/v1/identite/profils/${profilId}/`, {
      method: 'PATCH',
      body: JSON.stringify(profilData)
    });
  }

  async deleteProfil(profilId) {
    return this.request(`/api/v1/identite/profils/${profilId}/`, {
      method: 'DELETE'
    });
  }

  // Méthode pour récupérer toutes les pages d'un endpoint paginé
  async getAllPages(endpoint) {
    let allResults = [];
    let nextUrl = endpoint;

    while (nextUrl) {
      const data = await this.request(nextUrl.replace(this.baseURL, ''));
      
      // Si la réponse contient results (pagination Django REST)
      if (data.results) {
        allResults = [...allResults, ...data.results];
        nextUrl = data.next;
      } else {
        // Si pas de pagination, retourner directement les données
        return data;
      }
    }

    return allResults;
  }

  // Méthodes pour la gestion des utilisateurs
  async getTypesUtilisateurs() {
    return this.getAllPages('/api/v1/identite/types-utilisateurs');
  }

  async getNiveauxKYC() {
    return this.getAllPages('/api/v1/identite/niveaux-kyc');
  }

  async getStatutsUtilisateurs() {
    return this.getAllPages('/api/v1/identite/statuts-utilisateurs');
  }

  async createUser(userData) {
    return this.request('/api/v1/identite/admin/creer-utilisateur', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Méthodes pour la localisation
  async getPays() {
    return this.getAllPages('/api/v1/localisation/pays');
  }

  async getProvinces() {
    return this.getAllPages('/api/v1/localisation/provinces');
  }

  async getDistricts() {
    return this.getAllPages('/api/v1/localisation/districts');
  }

  async getQuartiers() {
    return this.getAllPages('/api/v1/localisation/quartiers');
  }

  // Méthodes génériques pour la localisation
  async getLocalisation(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/localisation/${endpoint}/${queryString ? `?${queryString}` : ''}`);
  }

  async createLocalisation(endpoint, data) {
    return this.request(`/api/v1/localisation/${endpoint}/`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateLocalisation(endpoint, id, data) {
    return this.request(`/api/v1/localisation/${endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async deleteLocalisation(endpoint, id) {
    return this.request(`/api/v1/localisation/${endpoint}/${id}/`, {
      method: 'DELETE'
    });
  }

  async getLocalisationComplete(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/api/v1/localisation/complete/${queryString ? `?${queryString}` : ''}`);
  }

  async getHierarchie(paysId) {
    if (!paysId) return null;
    return this.request(`/api/v1/localisation/hierarchie/?pays_id=${encodeURIComponent(paysId)}`);
  }

  // --- API Geo (découpage et affichage carte) ---
  /** GET /api/v1/localisation/hierarchie/statistiques/ — statistiques globales de toutes les entités */
  async getGeoStatistiques() {
    return this.request('/api/v1/localisation/hierarchie/statistiques/');
  }

  async getGeoPays() {
    return this.request('/api/v1/localisation/geo/pays/');
  }

  async getGeoPaysGeojson() {
    return this.request('/api/v1/localisation/geo/pays/geojson/');
  }

  async getGeoProvinces(paysId) {
    if (!paysId) return [];
    const data = await this.request(`/api/v1/localisation/geo/provinces/?pays_id=${encodeURIComponent(paysId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoProvincesGeojson(paysId) {
    if (!paysId) return null;
    return this.request(`/api/v1/localisation/geo/provinces/geojson/?pays_id=${encodeURIComponent(paysId)}`);
  }

  async getGeoDistricts(provinceId) {
    if (!provinceId) return [];
    const data = await this.request(`/api/v1/localisation/geo/districts/?province_id=${encodeURIComponent(provinceId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoDistrictsGeojson(provinceId) {
    if (!provinceId) return null;
    return this.request(`/api/v1/localisation/geo/districts/geojson/?province_id=${encodeURIComponent(provinceId)}`);
  }

  async getGeoQuartiers(districtId) {
    if (!districtId) return [];
    const data = await this.request(`/api/v1/localisation/geo/quartiers/?district_id=${encodeURIComponent(districtId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoQuartiersGeojson(districtId) {
    if (!districtId) return null;
    return this.request(`/api/v1/localisation/geo/quartiers/geojson/?district_id=${encodeURIComponent(districtId)}`);
  }

  async getGeoCommunes(districtId) {
    if (!districtId) return [];
    const data = await this.request(`/api/v1/localisation/geo/communes/?district_id=${encodeURIComponent(districtId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoCommunesGeojson(districtId) {
    if (!districtId) return null;
    return this.request(`/api/v1/localisation/geo/communes/geojson/?district_id=${encodeURIComponent(districtId)}`);
  }

  async getGeoSecteurs(communeId) {
    if (!communeId) return [];
    const data = await this.request(`/api/v1/localisation/geo/secteurs/?commune_id=${encodeURIComponent(communeId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoSecteursGeojson(communeId) {
    if (!communeId) return null;
    return this.request(`/api/v1/localisation/geo/secteurs/geojson/?commune_id=${encodeURIComponent(communeId)}`);
  }

  async getGeoZones(quartierId) {
    if (!quartierId) return [];
    const data = await this.request(`/api/v1/localisation/geo/zones/?quartier_id=${encodeURIComponent(quartierId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoZonesGeojson(quartierId) {
    if (!quartierId) return null;
    return this.request(`/api/v1/localisation/geo/zones/geojson/?quartier_id=${encodeURIComponent(quartierId)}`);
  }

  async getGeoCollines(zoneId) {
    if (!zoneId) return [];
    const data = await this.request(`/api/v1/localisation/geo/collines/?zone_id=${encodeURIComponent(zoneId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoCollinesGeojson(zoneId) {
    if (!zoneId) return null;
    return this.request(`/api/v1/localisation/geo/collines/geojson/?zone_id=${encodeURIComponent(zoneId)}`);
  }

  async getGeoPointsDeService(quartierId) {
    if (!quartierId) return [];
    const data = await this.request(`/api/v1/localisation/geo/points-de-service/?quartier_id=${encodeURIComponent(quartierId)}`);
    return Array.isArray(data) ? data : [];
  }

  async getGeoPointsDeServiceGeojson(quartierId) {
    if (!quartierId) return null;
    return this.request(`/api/v1/localisation/geo/points-de-service/geojson/?quartier_id=${encodeURIComponent(quartierId)}`);
  }
}

// Instance singleton
const apiService = new ApiService();
export default apiService;
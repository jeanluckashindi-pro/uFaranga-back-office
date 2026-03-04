/**
 * Service de tracking et surveillance des actions utilisateur
 * Enregistre la navigation, les interactions et les actions critiques
 */

import apiService from '../api';

class TrackingService {
  constructor() {
    this.sessionId = null;
    this.sessionActive = false;
    this.heartbeatInterval = null;
    this.navigationStartTime = Date.now();
    this.pageStartTime = Date.now();
    this.currentUrl = window.location.pathname;
    this.previousUrl = null;
    this.interactionStats = {
      clics: 0,
      scrolls: 0,
      touches: []
    };
  }

  /**
   * Initialise le tracking après connexion
   */
  async initialiserSession(empreinteAppareil, localisationIP = null) {
    try {
      const response = await apiService.request('/api/v1/securite/session/init/', {
        method: 'POST',
        body: JSON.stringify({
          empreinte_appareil: empreinteAppareil,
          localisation_ip: localisationIP
        })
      });

      if (response.success && response.autorise) {
        this.sessionId = response.session_id;
        this.sessionActive = true;
        
        // Démarrer le heartbeat
        this.demarrerHeartbeat();
        
        // Installer les listeners
        this.installerListeners();
        
        return response;
      } else {
        throw new Error('Session non autorisée');
      }
    } catch (error) {
      console.error('Erreur initialisation session sécurité:', error);
      throw error;
    }
  }

  /**
   * Démarre le heartbeat (toutes les 30 secondes)
   */
  demarrerHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(async () => {
      if (this.sessionActive) {
        try {
          await apiService.request('/api/v1/securite/heartbeat/', {
            method: 'POST',
            body: JSON.stringify({})
          });
        } catch (error) {
          console.error('Erreur heartbeat:', error);
        }
      }
    }, 30000); // 30 secondes
  }

  /**
   * Installe les listeners pour le tracking automatique
   */
  installerListeners() {
    // Navigation
    window.addEventListener('beforeunload', () => this.enregistrerNavigation());
    
    // Changement de route (pour SPA)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      this.enregistrerNavigation();
      originalPushState.apply(history, args);
      this.onRouteChange();
    };
    
    history.replaceState = (...args) => {
      this.enregistrerNavigation();
      originalReplaceState.apply(history, args);
      this.onRouteChange();
    };
    
    window.addEventListener('popstate', () => {
      this.enregistrerNavigation();
      this.onRouteChange();
    });

    // Interactions
    document.addEventListener('click', (e) => this.onClic(e));
    document.addEventListener('scroll', () => this.onScroll());
    document.addEventListener('keydown', (e) => this.onKeyPress(e));
  }

  /**
   * Gère le changement de route
   */
  onRouteChange() {
    this.previousUrl = this.currentUrl;
    this.currentUrl = window.location.pathname;
    this.pageStartTime = Date.now();
    this.interactionStats = { clics: 0, scrolls: 0, touches: [] };
  }

  /**
   * Enregistre la navigation
   */
  async enregistrerNavigation() {
    if (!this.sessionActive) return;

    const tempsSurPage = Date.now() - this.pageStartTime;
    const tempsChargement = this.pageStartTime - this.navigationStartTime;

    try {
      await apiService.request('/api/v1/securite/navigation/', {
        method: 'POST',
        body: JSON.stringify({
          url_visitee: this.currentUrl,
          page_precedente: this.previousUrl,
          temps_sur_page: tempsSurPage,
          temps_chargement: tempsChargement,
          nombre_clics: this.interactionStats.clics,
          nombre_scroll: this.interactionStats.scrolls,
          touches_pressees: this.interactionStats.touches,
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Erreur enregistrement navigation:', error);
    }
  }

  /**
   * Gère les clics
   */
  onClic(event) {
    this.interactionStats.clics++;
    
    // Enregistrer les clics sur éléments critiques
    const target = event.target;
    const isCritical = target.matches('button, a, input[type="submit"]');
    
    if (isCritical) {
      this.enregistrerInteraction('clic', target, event.clientX, event.clientY);
    }
  }

  /**
   * Gère les scrolls
   */
  onScroll() {
    this.interactionStats.scrolls++;
  }

  /**
   * Gère les touches pressées
   */
  onKeyPress(event) {
    if (['Enter', 'Tab', 'Escape'].includes(event.key)) {
      if (!this.interactionStats.touches.includes(event.key)) {
        this.interactionStats.touches.push(event.key);
      }
    }
  }

  /**
   * Enregistre une interaction spécifique
   */
  async enregistrerInteraction(type, element, x, y) {
    if (!this.sessionActive) return;

    try {
      const elementCible = this.getElementSelector(element);
      
      await apiService.request('/api/v1/securite/interaction/', {
        method: 'POST',
        body: JSON.stringify({
          url: this.currentUrl,
          type_interaction: type,
          element_cible: elementCible,
          position_x: x,
          position_y: y
        })
      });
    } catch (error) {
      console.error('Erreur enregistrement interaction:', error);
    }
  }

  /**
   * Enregistre une action critique
   */
  async enregistrerAction(typeAction, endpoint, parametres, resultat) {
    if (!this.sessionActive) return;

    try {
      await apiService.request('/api/v1/securite/action/', {
        method: 'POST',
        body: JSON.stringify({
          type_action: typeAction,
          endpoint: endpoint,
          parametres: parametres,
          resultat: resultat
        })
      });
    } catch (error) {
      console.error('Erreur enregistrement action:', error);
    }
  }

  /**
   * Obtient le sélecteur CSS d'un élément
   */
  getElementSelector(element) {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
    
    return element.tagName.toLowerCase();
  }

  /**
   * Termine la session
   */
  async terminerSession() {
    if (!this.sessionActive) return;

    try {
      // Enregistrer la dernière navigation
      await this.enregistrerNavigation();
      
      // Terminer la session
      await apiService.request('/api/v1/securite/session/terminer/', {
        method: 'POST',
        body: JSON.stringify({})
      });
      
      this.sessionActive = false;
      
      // Arrêter le heartbeat
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
    } catch (error) {
      console.error('Erreur terminaison session:', error);
    }
  }

  /**
   * Obtient la session actuelle
   */
  async obtenirSessionActuelle() {
    try {
      return await apiService.request('/api/v1/securite/session/actuelle/');
    } catch (error) {
      console.error('Erreur obtention session:', error);
      return null;
    }
  }

  /**
   * Obtient l'historique de navigation
   */
  async obtenirHistoriqueNavigation(limit = 50) {
    try {
      return await apiService.request(`/api/v1/securite/navigation/historique/?limit=${limit}`);
    } catch (error) {
      console.error('Erreur obtention historique:', error);
      return [];
    }
  }
}

export default new TrackingService();

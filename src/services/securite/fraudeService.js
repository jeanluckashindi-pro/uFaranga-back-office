/**
 * Service de détection de fraude
 * Analyse les comportements suspects et gère les alertes
 */

import apiService from '../api';

class FraudeService {
  /**
   * Analyse le comportement d'un utilisateur
   */
  async analyserComportementUtilisateur(utilisateurId) {
    try {
      const response = await apiService.request(
        `/api/v1/securite/analyse/utilisateur/${utilisateurId}/`
      );
      return response;
    } catch (error) {
      console.error('Erreur analyse comportement:', error);
      throw error;
    }
  }

  /**
   * Obtient les alertes de fraude
   */
  async obtenirAlertesFraude(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.request(
        `/api/v1/securite/alertes/${queryString ? `?${queryString}` : ''}`
      );
      return response;
    } catch (error) {
      console.error('Erreur obtention alertes:', error);
      return [];
    }
  }

  /**
   * Obtient les métriques comportementales
   */
  async obtenirMetriquesComportement(utilisateurId, periode = '7d') {
    try {
      const response = await apiService.request(
        `/api/v1/securite/metriques/${utilisateurId}/?periode=${periode}`
      );
      return response;
    } catch (error) {
      console.error('Erreur obtention métriques:', error);
      return null;
    }
  }

  /**
   * Obtient les comptes liés
   */
  async obtenirComptesLies(utilisateurId) {
    try {
      const response = await apiService.request(
        `/api/v1/securite/comptes-lies/${utilisateurId}/`
      );
      return response;
    } catch (error) {
      console.error('Erreur obtention comptes liés:', error);
      return [];
    }
  }

  /**
   * Obtient les actions répétitives détectées
   */
  async obtenirActionsRepetitives(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiService.request(
        `/api/v1/securite/actions-repetitives/${queryString ? `?${queryString}` : ''}`
      );
      return response;
    } catch (error) {
      console.error('Erreur obtention actions répétitives:', error);
      return [];
    }
  }

  /**
   * Marque une alerte comme traitée
   */
  async traiterAlerte(alerteId, action, commentaire = '') {
    try {
      const response = await apiService.request(
        `/api/v1/securite/alertes/${alerteId}/traiter/`,
        {
          method: 'POST',
          body: JSON.stringify({
            action: action,
            commentaire: commentaire
          })
        }
      );
      return response;
    } catch (error) {
      console.error('Erreur traitement alerte:', error);
      throw error;
    }
  }

  /**
   * Bloque un utilisateur
   */
  async bloquerUtilisateur(utilisateurId, raison, duree = 24) {
    try {
      const response = await apiService.request(
        `/api/v1/securite/bloquer-utilisateur/`,
        {
          method: 'POST',
          body: JSON.stringify({
            utilisateur_id: utilisateurId,
            raison: raison,
            duree_heures: duree
          })
        }
      );
      return response;
    } catch (error) {
      console.error('Erreur blocage utilisateur:', error);
      throw error;
    }
  }

  /**
   * Débloquer un utilisateur
   */
  async debloquerUtilisateur(utilisateurId) {
    try {
      const response = await apiService.request(
        `/api/v1/securite/debloquer-utilisateur/`,
        {
          method: 'POST',
          body: JSON.stringify({
            utilisateur_id: utilisateurId
          })
        }
      );
      return response;
    } catch (error) {
      console.error('Erreur déblocage utilisateur:', error);
      throw error;
    }
  }

  /**
   * Obtient les statistiques de sécurité
   */
  async obtenirStatistiquesSecurite(periode = '30d') {
    try {
      const response = await apiService.request(
        `/api/v1/securite/statistiques/?periode=${periode}`
      );
      return response;
    } catch (error) {
      console.error('Erreur obtention statistiques:', error);
      return null;
    }
  }

  /**
   * Calcule le niveau de risque d'une action
   */
  calculerNiveauRisque(score) {
    if (score >= 0.9) return { niveau: 'CRITICAL', couleur: 'red', label: 'Critique' };
    if (score >= 0.7) return { niveau: 'HIGH', couleur: 'orange', label: 'Élevé' };
    if (score >= 0.5) return { niveau: 'MEDIUM', couleur: 'yellow', label: 'Moyen' };
    return { niveau: 'LOW', couleur: 'green', label: 'Faible' };
  }

  /**
   * Formate les comportements suspects pour l'affichage
   */
  formaterComportementsSuspects(comportements) {
    const labels = {
      actions_repetitives: 'Actions répétitives détectées',
      sessions_multiples: 'Sessions multiples simultanées',
      changements_ip: 'Changements d\'IP fréquents',
      navigation_anormale: 'Navigation anormale',
      comptes_lies: 'Comptes liés détectés',
      voyage_impossible: 'Voyage impossible détecté',
      tentatives_connexion: 'Tentatives de connexion répétées'
    };

    return Object.entries(comportements)
      .filter(([_, value]) => value === true)
      .map(([key]) => labels[key] || key);
  }
}

export default new FraudeService();

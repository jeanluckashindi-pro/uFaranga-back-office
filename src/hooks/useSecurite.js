/**
 * Hook React pour gérer la sécurité et le tracking
 */

import { useEffect, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackingService, deviceFingerprintService } from '../services/securite';

export const useSecurite = () => {
  const { isAuthenticated, user } = useAuth();
  const [sessionSecurite, setSessionSecurite] = useState(null);
  const [niveauRisque, setNiveauRisque] = useState('LOW');
  const [restrictions, setRestrictions] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Initialise la session de sécurité
   */
  const initialiserSecurite = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      // Collecter l'empreinte de l'appareil
      const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();
      const localisation = await deviceFingerprintService.collecterLocalisationIP();

      // Initialiser la session
      const response = await trackingService.initialiserSession(empreinte, localisation);
      
      setSessionSecurite(response);
      setNiveauRisque(response.niveau_risque);
      setRestrictions(response.restrictions || []);

      return response;
    } catch (error) {
      console.error('Erreur initialisation sécurité:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  /**
   * Enregistre une action critique
   */
  const enregistrerAction = useCallback(async (typeAction, endpoint, parametres, resultat) => {
    try {
      await trackingService.enregistrerAction(typeAction, endpoint, parametres, resultat);
    } catch (error) {
      console.error('Erreur enregistrement action:', error);
    }
  }, []);

  /**
   * Termine la session de sécurité
   */
  const terminerSecurite = useCallback(async () => {
    try {
      await trackingService.terminerSession();
      setSessionSecurite(null);
      setNiveauRisque('LOW');
      setRestrictions([]);
    } catch (error) {
      console.error('Erreur terminaison sécurité:', error);
    }
  }, []);

  /**
   * Vérifie si une action est autorisée
   */
  const verifierAutorisation = useCallback((action) => {
    if (restrictions.length === 0) return true;
    return !restrictions.includes(action);
  }, [restrictions]);

  // Initialiser automatiquement lors de la connexion
  useEffect(() => {
    if (isAuthenticated && user && !sessionSecurite) {
      initialiserSecurite();
    }
  }, [isAuthenticated, user, sessionSecurite, initialiserSecurite]);

  // Terminer automatiquement lors de la déconnexion
  useEffect(() => {
    if (!isAuthenticated && sessionSecurite) {
      terminerSecurite();
    }
  }, [isAuthenticated, sessionSecurite, terminerSecurite]);

  return {
    sessionSecurite,
    niveauRisque,
    restrictions,
    loading,
    initialiserSecurite,
    enregistrerAction,
    terminerSecurite,
    verifierAutorisation
  };
};

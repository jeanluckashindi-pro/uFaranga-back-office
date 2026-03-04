/**
 * Gestionnaire de stockage sécurisé pour les données sensibles
 * Utilise sessionStorage pour la persistance pendant la session
 * et localStorage uniquement pour rememberMe avec chiffrement AES-GCM
 */

class SecureStorage {
  constructor() {
    // Stockage en mémoire pour accès rapide
    this.memoryStorage = {
      accessToken: null,
      refreshToken: null,
      user: null,
      sessionId: null,
      rememberMe: false,
    };

    // Clé de chiffrement (générée ou récupérée)
    this.encryptionKey = null;
    this.isInitialized = false;
    
    // Générer un ID de session unique
    this.sessionId = this.generateSessionId();
    
    // Initialiser la clé de chiffrement et charger les données
    this.initialize();
  }

  /**
   * Initialiser le storage de manière asynchrone
   */
  async initialize() {
    await this.initEncryptionKey();
    
    // Charger rememberMe depuis localStorage si existe
    const savedRememberMe = localStorage.getItem('rememberMe');
    if (savedRememberMe === 'true') {
      this.memoryStorage.rememberMe = true;
    }

    // Charger les données depuis le storage
    await this.loadFromSessionStorage();
    
    this.isInitialized = true;
  }

  /**
   * Attendre que l'initialisation soit terminée
   */
  async waitForInit() {
    if (this.isInitialized) return;
    
    // Attendre maximum 2 secondes
    const maxWait = 2000;
    const startTime = Date.now();
    
    while (!this.isInitialized && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Initialiser ou récupérer la clé de chiffrement
   */
  async initEncryptionKey() {
    try {
      // Vérifier si une clé existe déjà
      const storedKey = localStorage.getItem('_ek');
      
      if (storedKey) {
        // Importer la clé existante
        const keyData = JSON.parse(atob(storedKey));
        this.encryptionKey = await crypto.subtle.importKey(
          'jwk',
          keyData,
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
      } else {
        // Générer une nouvelle clé
        this.encryptionKey = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        // Exporter et stocker la clé
        const exportedKey = await crypto.subtle.exportKey('jwk', this.encryptionKey);
        localStorage.setItem('_ek', btoa(JSON.stringify(exportedKey)));
      }
    } catch (e) {
      console.error('Erreur lors de l\'initialisation de la clé de chiffrement:', e);
      // Fallback: utiliser une clé dérivée du navigateur
      this.encryptionKey = null;
    }
  }

  /**
   * Chiffrer des données
   */
  async encrypt(data) {
    if (!this.encryptionKey) {
      // Fallback: encoder en base64 si pas de clé
      return btoa(JSON.stringify(data));
    }

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(JSON.stringify(data));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        encodedData
      );
      
      // Combiner IV et données chiffrées
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedData), iv.length);
      
      // Convertir en base64
      return btoa(String.fromCharCode(...combined));
    } catch (e) {
      console.error('Erreur de chiffrement:', e);
      return btoa(JSON.stringify(data));
    }
  }

  /**
   * Déchiffrer des données
   */
  async decrypt(encryptedData) {
    if (!encryptedData) return null;
    
    if (!this.encryptionKey) {
      // Fallback: décoder depuis base64
      try {
        return JSON.parse(atob(encryptedData));
      } catch (e) {
        return null;
      }
    }

    try {
      // Décoder depuis base64
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      
      // Extraire IV et données
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        data
      );
      
      const decodedData = new TextDecoder().decode(decryptedData);
      return JSON.parse(decodedData);
    } catch (e) {
      console.error('Erreur de déchiffrement:', e);
      // Essayer le fallback
      try {
        return JSON.parse(atob(encryptedData));
      } catch (e2) {
        return null;
      }
    }
  }

  /**
   * Charger les données depuis sessionStorage ou localStorage
   */
  async loadFromSessionStorage() {
    try {
      // Vérifier d'abord si rememberMe est activé
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      
      // Choisir le storage approprié
      const storage = rememberMe ? localStorage : sessionStorage;
      
      const encryptedAccessToken = storage.getItem('_at');
      const encryptedRefreshToken = storage.getItem('_rt');
      const encryptedUserData = storage.getItem('_ud');

      if (encryptedAccessToken) {
        this.memoryStorage.accessToken = await this.decrypt(encryptedAccessToken);
      }
      if (encryptedRefreshToken) {
        this.memoryStorage.refreshToken = await this.decrypt(encryptedRefreshToken);
      }
      if (encryptedUserData) {
        this.memoryStorage.user = await this.decrypt(encryptedUserData);
      }
      
      this.memoryStorage.rememberMe = rememberMe;
    } catch (e) {
      console.error('Erreur lors du chargement depuis le storage:', e);
    }
  }

  /**
   * Générer un ID de session unique
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Stocker le token d'accès
   */
  setAccessToken(token) {
    this.memoryStorage.accessToken = token;
    const storage = this.memoryStorage.rememberMe ? localStorage : sessionStorage;
    
    if (token) {
      this.encrypt(token).then(encrypted => {
        storage.setItem('_at', encrypted);
      });
    } else {
      storage.removeItem('_at');
    }
  }

  /**
   * Récupérer le token d'accès
   */
  getAccessToken() {
    if (this.memoryStorage.accessToken) {
      return this.memoryStorage.accessToken;
    }
    
    // Les tokens sont chargés de manière asynchrone au démarrage
    return null;
  }

  /**
   * Stocker le refresh token
   */
  setRefreshToken(token) {
    this.memoryStorage.refreshToken = token;
    const storage = this.memoryStorage.rememberMe ? localStorage : sessionStorage;
    
    if (token) {
      this.encrypt(token).then(encrypted => {
        storage.setItem('_rt', encrypted);
      });
    } else {
      storage.removeItem('_rt');
    }
  }

  /**
   * Récupérer le refresh token
   */
  getRefreshToken() {
    if (this.memoryStorage.refreshToken) {
      return this.memoryStorage.refreshToken;
    }
    
    return null;
  }

  /**
   * Stocker les données utilisateur
   */
  setUser(user) {
    this.memoryStorage.user = user;
    const storage = this.memoryStorage.rememberMe ? localStorage : sessionStorage;
    
    if (user) {
      this.encrypt(user).then(encrypted => {
        storage.setItem('_ud', encrypted);
      });
    } else {
      storage.removeItem('_ud');
    }
  }

  /**
   * Récupérer les données utilisateur
   */
  getUser() {
    if (this.memoryStorage.user) {
      return this.memoryStorage.user;
    }
    
    return null;
  }

  /**
   * Vérifier si une session est active
   */
  hasActiveSession() {
    return this.getAccessToken() !== null;
  }

  /**
   * Nettoyer toutes les données de session
   */
  clearSession() {
    const rememberMe = this.memoryStorage.rememberMe;
    
    // Nettoyer la mémoire
    this.memoryStorage = {
      accessToken: null,
      refreshToken: null,
      user: null,
      sessionId: null,
      rememberMe: false,
    };
    
    // Nettoyer les données chiffrées dans les deux storages
    sessionStorage.removeItem('_at');
    sessionStorage.removeItem('_rt');
    sessionStorage.removeItem('_ud');
    
    localStorage.removeItem('_at');
    localStorage.removeItem('_rt');
    localStorage.removeItem('_ud');
    
    // Nettoyer les anciennes clés non chiffrées (migration)
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    
    // Ne pas supprimer rememberMe et la clé de chiffrement
    if (!rememberMe) {
      localStorage.removeItem('rememberMe');
    }
    
    // Nettoyer les cookies si nécessaire
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  }

  /**
   * Obtenir l'ID de session
   */
  getSessionId() {
    return this.sessionId;
  }

  /**
   * Définir le mode "Se souvenir de moi"
   */
  setRememberMe(remember) {
    this.memoryStorage.rememberMe = remember;
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }

  /**
   * Vérifier si "Se souvenir de moi" est activé
   */
  getRememberMe() {
    return this.memoryStorage.rememberMe || localStorage.getItem('rememberMe') === 'true';
  }

  /**
   * Vérifier si le token est expiré
   */
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      // Décoder le JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= exp;
    } catch (e) {
      return true;
    }
  }

  /**
   * Obtenir le temps restant avant expiration (en secondes)
   */
  getTokenTimeRemaining(token) {
    if (!token) return 0;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const remaining = Math.max(0, exp - Date.now());
      return Math.floor(remaining / 1000);
    } catch (e) {
      return 0;
    }
  }
}

// Instance singleton
const secureStorage = new SecureStorage();

// Nettoyer la session quand l'onglet/fenêtre est fermé
window.addEventListener('beforeunload', () => {
  // Les données en mémoire seront automatiquement perdues
});

// Nettoyer la session en cas d'inactivité prolongée
let inactivityTimer;

const resetInactivityTimer = () => {
  // Ne pas déconnecter si "Se souvenir de moi" est activé
  if (secureStorage.getRememberMe()) {
    return;
  }
  
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    console.warn('Session expirée par inactivité');
    secureStorage.clearSession();
    window.location.href = '/login';
  }, INACTIVITY_TIMEOUT);
};

// Écouter les événements d'activité
['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
  document.addEventListener(event, resetInactivityTimer, true);
});

// Démarrer le timer
resetInactivityTimer();

export default secureStorage;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import secureStorage from '../../utils/secureStorage';
import { trackingService, deviceFingerprintService } from '../../services/securite';

// Thunks asynchrones
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password, rememberMe }, { rejectWithValue }) => {
    try {
      const loginResponse = await apiService.login(username, password, rememberMe);
      
      // Vérifier la structure de réponse
      if (!loginResponse.succes) {
        throw new Error(loginResponse.message || 'Erreur de connexion');
      }
      
      // IMPORTANT: Définir rememberMe AVANT de stocker les tokens
      secureStorage.setRememberMe(rememberMe);
      
      // Stocker les tokens (ils seront stockés dans le bon storage)
      secureStorage.setAccessToken(loginResponse.token);
      if (loginResponse.refresh_token) {
        secureStorage.setRefreshToken(loginResponse.refresh_token);
      }
      
      // Récupérer le profil complet
      const profileResponse = await apiService.getProfile();
      
      // Vérifier la structure de réponse du profil
      if (!profileResponse.succes) {
        throw new Error(profileResponse.message || 'Erreur lors de la récupération du profil');
      }
      
      const profile = profileResponse.data;
      
      // Mapper les données du profil avec la nouvelle structure
      const userData = {
        id: profile.utilisateur.id,
        numeroClient: profile.utilisateur.numero_client,
        firstName: profile.utilisateur.prenom,
        lastName: profile.utilisateur.nom_famille,
        fullName: profile.utilisateur.nom_complet,
        sexe: profile.utilisateur.sexe,
        dateOfBirth: profile.utilisateur.date_naissance,
        age: profile.utilisateur.age,
        
        // Contact
        phoneNumber: profile.contact.telephone_principal,
        isPhoneVerified: profile.contact.telephone_verifie,
        email: profile.contact.email_principal,
        isEmailVerified: profile.contact.email_verifie,
        
        // KYC
        kycLevel: profile.kyc.niveau,
        kycStatus: profile.kyc.statut,
        kycValidatedAt: profile.kyc.date_validation,
        riskScore: profile.kyc.score_risque,
        riskCategory: profile.kyc.categorie_risque,
        
        // Compte
        userType: profile.compte.type_utilisateur,
        status: profile.compte.statut,
        isActive: profile.compte.est_actif,
        createdAt: profile.compte.date_creation,
        lastLogin: profile.compte.derniere_connexion,
        
        // Sécurité
        twoFactorEnabled: profile.securite.double_auth_activee,
        twoFactorMethod: profile.securite.methode_2fa,
        loginAttempts: profile.securite.nombre_tentatives_connexion,
        forcePasswordChange: profile.securite.force_changement_mdp,
        
        // Préférences
        preferences: {
          language: profile.preferences.langue_preferee,
          timezone: profile.preferences.fuseau_horaire,
          preferredCurrency: profile.preferences.devise_preferee,
          emailNotifications: profile.preferences.notifications_email,
          smsNotifications: profile.preferences.notifications_sms,
          pushNotifications: profile.preferences.notifications_push,
        },
        
        // Localisation
        location: {
          countryId: profile.localisation.pays_id,
          provinceId: profile.localisation.province_id,
          addressLine1: profile.localisation.adresse_ligne1,
        },
        
        // Statistiques
        statistics: {
          loginAttempts: profile.statistiques.nombre_tentatives_connexion,
          lastPasswordChange: profile.statistiques.derniere_modification_mdp,
        },
      };
      
      secureStorage.setUser(userData);
      
      // Initialiser le tracking de sécurité
      try {
        const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();
        const localisation = await deviceFingerprintService.collecterLocalisationIP();
        await trackingService.initialiserSession(empreinte, localisation);
      } catch (securityError) {
        console.warn('Erreur initialisation sécurité:', securityError);
        // Ne pas bloquer la connexion si le tracking échoue
      }
      
      return {
        user: userData,
        activeSessions: null, // À adapter si l'API retourne des sessions actives
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      // Attendre que secureStorage soit initialisé
      await secureStorage.waitForInit();
      
      const token = secureStorage.getAccessToken();
      const userData = secureStorage.getUser();
      
      if (!token || !userData) {
        throw new Error('Pas de session active');
      }
      
      // Vérifier si le token n'est pas expiré
      if (secureStorage.isTokenExpired(token)) {
        // Essayer de rafraîchir le token
        const refreshToken = secureStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('Token expiré');
        }
        
        try {
          const data = await apiService.refreshToken(refreshToken);
          secureStorage.setAccessToken(data.access);
        } catch (refreshError) {
          // Si le refresh échoue, nettoyer la session
          secureStorage.clearSession();
          throw new Error('Session expirée');
        }
      }
      
      // Retourner les données utilisateur du storage
      // On essaie de récupérer le profil à jour en arrière-plan mais on ne bloque pas
      try {
        const profileResponse = await apiService.getProfile();
        
        // Vérifier la structure de réponse
        if (!profileResponse.succes) {
          throw new Error('Erreur lors de la récupération du profil');
        }
        
        const profile = profileResponse.data;
        
        // Mapper les données avec la nouvelle structure
        const updatedUserData = {
          id: profile.utilisateur.id,
          numeroClient: profile.utilisateur.numero_client,
          firstName: profile.utilisateur.prenom,
          lastName: profile.utilisateur.nom_famille,
          fullName: profile.utilisateur.nom_complet,
          sexe: profile.utilisateur.sexe,
          dateOfBirth: profile.utilisateur.date_naissance,
          age: profile.utilisateur.age,
          
          // Contact
          phoneNumber: profile.contact.telephone_principal,
          isPhoneVerified: profile.contact.telephone_verifie,
          email: profile.contact.email_principal,
          isEmailVerified: profile.contact.email_verifie,
          
          // KYC
          kycLevel: profile.kyc.niveau,
          kycStatus: profile.kyc.statut,
          kycValidatedAt: profile.kyc.date_validation,
          riskScore: profile.kyc.score_risque,
          riskCategory: profile.kyc.categorie_risque,
          
          // Compte
          userType: profile.compte.type_utilisateur,
          status: profile.compte.statut,
          isActive: profile.compte.est_actif,
          createdAt: profile.compte.date_creation,
          lastLogin: profile.compte.derniere_connexion,
          
          // Sécurité
          twoFactorEnabled: profile.securite.double_auth_activee,
          twoFactorMethod: profile.securite.methode_2fa,
          loginAttempts: profile.securite.nombre_tentatives_connexion,
          forcePasswordChange: profile.securite.force_changement_mdp,
          
          // Préférences
          preferences: {
            language: profile.preferences.langue_preferee,
            timezone: profile.preferences.fuseau_horaire,
            preferredCurrency: profile.preferences.devise_preferee,
            emailNotifications: profile.preferences.notifications_email,
            smsNotifications: profile.preferences.notifications_sms,
            pushNotifications: profile.preferences.notifications_push,
          },
          
          // Localisation
          location: {
            countryId: profile.localisation.pays_id,
            provinceId: profile.localisation.province_id,
            addressLine1: profile.localisation.adresse_ligne1,
          },
          
          // Statistiques
          statistics: {
            loginAttempts: profile.statistiques.nombre_tentatives_connexion,
            lastPasswordChange: profile.statistiques.derniere_modification_mdp,
          },
        };
        
        secureStorage.setUser(updatedUserData);
        
        return {
          user: updatedUserData,
          activeSessions: null,
        };
      } catch (profileError) {
        // Si l'API échoue, utiliser les données du storage
        console.warn('Impossible de récupérer le profil à jour, utilisation des données en cache');
        return {
          user: userData,
          activeSessions: null,
        };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Terminer la session de sécurité
      try {
        await trackingService.terminerSession();
      } catch (securityError) {
        console.warn('Erreur terminaison session sécurité:', securityError);
      }
      
      const refreshToken = secureStorage.getRefreshToken();
      if (refreshToken) {
        await apiService.logout(refreshToken);
      }
      secureStorage.clearSession();
      return null;
    } catch (error) {
      // Même en cas d'erreur, on nettoie la session locale
      secureStorage.clearSession();
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    activeSessions: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateActiveSessions: (state, action) => {
      state.activeSessions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.activeSessions = action.payload.activeSessions;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })
      // Load from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.activeSessions = action.payload.activeSessions;
        state.error = null;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.activeSessions = null;
        state.error = null;
      });
  },
});

export const { clearError, updateActiveSessions } = authSlice.actions;
export default authSlice.reducer;

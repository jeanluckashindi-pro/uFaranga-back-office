import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import secureStorage from '../../utils/secureStorage';
import { trackingService, deviceFingerprintService } from '../../services/securite';

// Thunks asynchrones
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password, rememberMe }, { rejectWithValue }) => {
    try {
      const data = await apiService.login(username, password, rememberMe);
      
      // IMPORTANT: Définir rememberMe AVANT de stocker les tokens
      secureStorage.setRememberMe(rememberMe);
      
      // Stocker les tokens (ils seront stockés dans le bon storage)
      secureStorage.setAccessToken(data.access);
      secureStorage.setRefreshToken(data.refresh);
      
      // Récupérer le profil complet
      const profile = await apiService.getProfile();
      
      // Mapper les données du profil
      const userData = {
        id: profile.id,
        email: profile.courriel,
        firstName: profile.prenom,
        lastName: profile.nom_famille,
        fullName: profile.nom_complet,
        phoneNumber: profile.numero_telephone,
        dateOfBirth: profile.date_naissance,
        placeOfBirth: profile.lieu_naissance,
        nationality: profile.nationalite,
        countryOfResidence: profile.pays_residence,
        province: profile.province,
        city: profile.ville,
        commune: profile.commune,
        quarter: profile.quartier,
        avenue: profile.avenue,
        houseNumber: profile.numero_maison,
        fullAddress: profile.adresse_complete,
        postalCode: profile.code_postal,
        isPhoneVerified: profile.telephone_verifie,
        phoneVerifiedAt: profile.telephone_verifie_le,
        isEmailVerified: profile.courriel_verifie,
        emailVerifiedAt: profile.courriel_verifie_le,
        kycLevel: profile.niveau_kyc,
        kycValidatedAt: profile.date_validation_kyc,
        kycValidatorId: profile.validateur_kyc_id,
        userType: profile.type_utilisateur,
        status: profile.statut,
        statusReason: profile.raison_statut,
        loginAttempts: profile.nombre_tentatives_connexion,
        blockedUntil: profile.bloque_jusqua,
        twoFactorEnabled: profile.double_auth_activee,
        isActive: profile.est_actif,
        isStaff: profile.is_staff,
        isSuperuser: profile.is_superuser,
        createdAt: profile.date_creation,
        updatedAt: profile.date_modification,
        lastLogin: profile.derniere_connexion,
        lastPasswordChange: profile.derniere_modification_mdp,
        profile: {
          id: profile.profil?.id,
          avatarUrl: profile.profil?.url_avatar,
          coverPhotoUrl: profile.profil?.url_photo_couverture,
          bio: profile.profil?.biographie,
          language: profile.profil?.langue,
          preferredCurrency: profile.profil?.devise_preferee,
          timezone: profile.profil?.fuseau_horaire,
          dateFormat: profile.profil?.format_date,
          timeFormat: profile.profil?.format_heure,
          emailNotifications: profile.profil?.notifications_courriel,
          smsNotifications: profile.profil?.notifications_sms,
          pushNotifications: profile.profil?.notifications_push,
          transactionNotifications: profile.profil?.notifications_transactions,
          marketingNotifications: profile.profil?.notifications_marketing,
          publicProfile: profile.profil?.profil_public,
          showPhone: profile.profil?.afficher_telephone,
          showEmail: profile.profil?.afficher_courriel,
          metadata: profile.profil?.metadonnees,
        },
        metadata: profile.metadonnees,
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
        activeSessions: profile.sessions_actives,
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
        const profile = await apiService.getProfile();
        
        // Mapper les données
        const updatedUserData = {
          id: profile.id,
          email: profile.courriel,
          firstName: profile.prenom,
          lastName: profile.nom_famille,
          fullName: profile.nom_complet,
          phoneNumber: profile.numero_telephone,
          dateOfBirth: profile.date_naissance,
          placeOfBirth: profile.lieu_naissance,
          nationality: profile.nationalite,
          countryOfResidence: profile.pays_residence,
          province: profile.province,
          city: profile.ville,
          commune: profile.commune,
          quarter: profile.quartier,
          avenue: profile.avenue,
          houseNumber: profile.numero_maison,
          fullAddress: profile.adresse_complete,
          postalCode: profile.code_postal,
          isPhoneVerified: profile.telephone_verifie,
          phoneVerifiedAt: profile.telephone_verifie_le,
          isEmailVerified: profile.courriel_verifie,
          emailVerifiedAt: profile.courriel_verifie_le,
          kycLevel: profile.niveau_kyc,
          kycValidatedAt: profile.date_validation_kyc,
          kycValidatorId: profile.validateur_kyc_id,
          userType: profile.type_utilisateur,
          status: profile.statut,
          statusReason: profile.raison_statut,
          loginAttempts: profile.nombre_tentatives_connexion,
          blockedUntil: profile.bloque_jusqua,
          twoFactorEnabled: profile.double_auth_activee,
          isActive: profile.est_actif,
          isStaff: profile.is_staff,
          isSuperuser: profile.is_superuser,
          createdAt: profile.date_creation,
          updatedAt: profile.date_modification,
          lastLogin: profile.derniere_connexion,
          lastPasswordChange: profile.derniere_modification_mdp,
          profile: {
            id: profile.profil?.id,
            avatarUrl: profile.profil?.url_avatar,
            coverPhotoUrl: profile.profil?.url_photo_couverture,
            bio: profile.profil?.biographie,
            language: profile.profil?.langue,
            preferredCurrency: profile.profil?.devise_preferee,
            timezone: profile.profil?.fuseau_horaire,
            dateFormat: profile.profil?.format_date,
            timeFormat: profile.profil?.format_heure,
            emailNotifications: profile.profil?.notifications_courriel,
            smsNotifications: profile.profil?.notifications_sms,
            pushNotifications: profile.profil?.notifications_push,
            transactionNotifications: profile.profil?.notifications_transactions,
            marketingNotifications: profile.profil?.notifications_marketing,
            publicProfile: profile.profil?.profil_public,
            showPhone: profile.profil?.afficher_telephone,
            showEmail: profile.profil?.afficher_courriel,
            metadata: profile.profil?.metadonnees,
          },
          metadata: profile.metadonnees,
        };
        
        secureStorage.setUser(updatedUserData);
        
        return {
          user: updatedUserData,
          activeSessions: profile.sessions_actives,
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

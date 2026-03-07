# Documentation API d'Authentification

## 🎯 Vue d'ensemble

Cette documentation décrit l'intégration de l'API d'authentification avec les nouveaux endpoints.

## 📍 Endpoints

### 1. Connexion

**Endpoint:** `POST /api/v1/identite/authentification/connexion/`

**Requête:**
```json
{
  "identifiant": "utilisateur@example.com",
  "mot_de_passe": "MotDePasse123!",
  "remember_me": false
}
```

**Réponse:**
```json
{
  "succes": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "utilisateur_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Connexion réussie"
}
```

### 2. Profil Utilisateur

**Endpoint:** `GET /api/v1/identite/utilisateurs/me/`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "succes": true,
  "data": {
    "utilisateur": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "numero_client": "CLI-2024-001",
      "prenom": "Jean",
      "nom_famille": "Dupont",
      "nom_complet": "Jean Dupont",
      "sexe": "M",
      "date_naissance": "1990-01-15",
      "age": 34
    },
    "contact": {
      "telephone_principal": "+25779123456",
      "telephone_verifie": true,
      "email_principal": "jean.dupont@example.com",
      "email_verifie": true
    },
    "kyc": {
      "niveau": 2,
      "statut": "valide",
      "date_validation": "2024-01-15T10:30:00Z",
      "score_risque": 25,
      "categorie_risque": "faible"
    },
    "compte": {
      "type_utilisateur": "client",
      "statut": "actif",
      "est_actif": true,
      "date_creation": "2024-01-01T08:00:00Z",
      "derniere_connexion": "2026-03-07T14:30:00Z"
    },
    "securite": {
      "double_auth_activee": true,
      "methode_2fa": "sms",
      "nombre_tentatives_connexion": 0,
      "force_changement_mdp": false
    },
    "preferences": {
      "langue_preferee": "fr",
      "fuseau_horaire": "Africa/Bujumbura",
      "devise_preferee": "BIF",
      "notifications_email": true,
      "notifications_sms": true,
      "notifications_push": true
    },
    "localisation": {
      "pays_id": "BI",
      "province_id": "BM",
      "adresse_ligne1": "Avenue de la Liberté, 123"
    },
    "statistiques": {
      "nombre_tentatives_connexion": 0,
      "derniere_modification_mdp": "2024-01-01T08:00:00Z"
    }
  },
  "statut": "profil_recupere"
}
```

## 💻 Utilisation dans le Frontend

### Service API

Le service API (`src/services/api.js`) gère automatiquement:
- La transformation des paramètres (`identifiant`, `mot_de_passe`)
- L'ajout du token dans les headers
- La gestion des erreurs

```javascript
// Connexion
const response = await apiService.login(username, password, rememberMe);

// Récupération du profil
const profile = await apiService.getProfile();
```

### Flux d'Authentification

1. **Connexion** → Stockage du token
2. **Récupération du profil** → Mapping des données
3. **Stockage dans Redux** → Disponible dans toute l'app

### Structure des Données Utilisateur

Les données sont mappées dans `authSlice.js` vers une structure cohérente:

```javascript
{
  id: string,
  numeroClient: string,
  firstName: string,
  lastName: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  kycLevel: number,
  kycStatus: string,
  riskCategory: string,
  userType: string,
  twoFactorEnabled: boolean,
  preferences: {
    language: string,
    timezone: string,
    preferredCurrency: string,
    // ...
  },
  // ...
}
```

## 🎨 Composants

### UserProfile

Le composant `UserProfile` affiche toutes les informations de l'utilisateur:
- Informations personnelles
- Contact (email, téléphone)
- Niveau KYC et statut
- Catégorie de risque
- Sécurité (2FA)
- Préférences
- Dernière connexion

## 🔐 Sécurité

- Les tokens sont stockés de manière sécurisée via `secureStorage`
- Le refresh token permet de renouveler la session
- La vérification du token expiré est automatique
- Le tracking de sécurité est initialisé à la connexion

## 📝 Notes

- L'endpoint utilise `identifiant` (peut être email ou téléphone)
- La réponse utilise `succes` (avec un seul 'c')
- Toutes les données sont en français
- Le mapping vers l'anglais est fait côté frontend pour la cohérence du code

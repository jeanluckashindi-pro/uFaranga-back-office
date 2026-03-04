# Services de Sécurité

Ce dossier contient tous les services liés à la sécurité et la détection de fraude.

## Services Disponibles

### 1. trackingService.js
Service principal de tracking des actions utilisateur.

**Fonctionnalités :**
- Initialisation de session de sécurité
- Enregistrement de navigation
- Tracking des interactions (clics, scrolls, touches)
- Heartbeat automatique (30s)
- Terminaison de session

**Utilisation :**
```javascript
import { trackingService } from './services/securite';

// Initialiser
await trackingService.initialiserSession(empreinte, localisation);

// Enregistrer une action
await trackingService.enregistrerAction('api_transaction', '/api/v1/transactions/', params, 'success');

// Terminer
await trackingService.terminerSession();
```

### 2. deviceFingerprint.js
Service de collecte d'empreinte d'appareil.

**Fonctionnalités :**
- Canvas fingerprinting
- WebGL fingerprinting
- Audio fingerprinting
- Détection des plugins
- Détection des polices
- Informations système

**Utilisation :**
```javascript
import { deviceFingerprintService } from './services/securite';

const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();
```

### 3. fraudeService.js
Service de détection et gestion de fraude.

**Fonctionnalités :**
- Analyse comportementale
- Gestion des alertes
- Blocage/déblocage utilisateurs
- Statistiques de sécurité
- Comptes liés

**Utilisation :**
```javascript
import { fraudeService } from './services/securite';

// Analyser un utilisateur
const analyse = await fraudeService.analyserComportementUtilisateur(userId);

// Obtenir les alertes
const alertes = await fraudeService.obtenirAlertesFraude();

// Bloquer un utilisateur
await fraudeService.bloquerUtilisateur(userId, 'Raison', 24);
```

## Intégration

Tous les services sont automatiquement intégrés via :
- Redux store (authSlice.js)
- Hook useSecurite
- Composants de pages admin

## Architecture

```
trackingService
    ↓
deviceFingerprintService → Backend API → fraudeService
    ↓
useSecurite Hook
    ↓
Composants React
```

## Sécurité

- Toutes les communications sont en HTTPS
- Les empreintes sont hashées côté backend
- Les données sont anonymisées après 90 jours
- Conformité RGPD

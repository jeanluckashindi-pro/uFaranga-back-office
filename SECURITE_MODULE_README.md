# Module de Sécurité et Détection de Fraude - Frontend

## 📋 Vue d'ensemble

Module React complet pour la sécurité et la détection de fraude, intégré avec le backend Django.

### Fonctionnalités

- ✅ **Device Fingerprinting** - Identification unique des appareils
- ✅ **Tracking Automatique** - Navigation, interactions, actions
- ✅ **Détection de Fraude** - Analyse comportementale en temps réel
- ✅ **Alertes & Notifications** - Système d'alertes automatiques
- ✅ **Dashboard Admin** - Interface de gestion complète
- ✅ **Intégration Redux** - Gestion d'état centralisée

## 🚀 Installation

Le module est déjà intégré dans votre application. Aucune installation supplémentaire n'est nécessaire.

## 📁 Structure des Fichiers

```
src/
├── services/securite/
│   ├── index.js                    # Point d'entrée
│   ├── trackingService.js          # Service de tracking
│   ├── deviceFingerprint.js        # Empreinte d'appareil
│   └── fraudeService.js            # Détection de fraude
├── hooks/
│   └── useSecurite.js              # Hook React pour la sécurité
├── pages/admin/
│   ├── Fraude.jsx                  # Page alertes de fraude
│   └── Securite.jsx                # Page analyse comportementale
└── components/
    └── SecuriteDocumentation.jsx   # Documentation intégrée
```

## 🔧 Utilisation

### 1. Hook useSecurite

Le hook principal pour gérer la sécurité dans vos composants :

```jsx
import { useSecurite } from '../hooks/useSecurite';

function MonComposant() {
  const { 
    sessionSecurite,      // Session de sécurité active
    niveauRisque,         // Niveau de risque (LOW, MEDIUM, HIGH, CRITICAL)
    restrictions,         // Liste des restrictions actives
    enregistrerAction,    // Fonction pour enregistrer une action
    verifierAutorisation  // Vérifier si une action est autorisée
  } = useSecurite();

  // Vérifier avant une action critique
  if (!verifierAutorisation('transaction')) {
    alert('Action non autorisée');
    return;
  }

  // Enregistrer une action
  await enregistrerAction(
    'api_transaction',
    '/api/v1/transactions/',
    { montant: 1000 },
    'success'
  );
}
```

### 2. Tracking Automatique

Le tracking est automatiquement initialisé lors de la connexion :

```javascript
// Dans authSlice.js - déjà intégré
import { trackingService, deviceFingerprintService } from '../../services/securite';

// Lors de la connexion
const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();
await trackingService.initialiserSession(empreinte);

// Lors de la déconnexion
await trackingService.terminerSession();
```

### 3. Services Disponibles

#### TrackingService

```javascript
import { trackingService } from '../services/securite';

// Initialiser la session
await trackingService.initialiserSession(empreinte, localisation);

// Enregistrer une action critique
await trackingService.enregistrerAction(
  'api_transaction',
  '/api/v1/transactions/',
  { montant: 1000 },
  'success'
);

// Obtenir la session actuelle
const session = await trackingService.obtenirSessionActuelle();

// Terminer la session
await trackingService.terminerSession();
```

#### DeviceFingerprintService

```javascript
import { deviceFingerprintService } from '../services/securite';

// Collecter l'empreinte complète
const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();

// Résultat :
{
  user_agent: "Mozilla/5.0...",
  platform: "Win32",
  langue: "fr-FR",
  timezone: "Africa/Bujumbura",
  largeur_ecran: 1920,
  hauteur_ecran: 1080,
  canvas_fingerprint: "data:image/png;base64,...",
  webgl_fingerprint: "NVIDIA Corporation~...",
  audio_fingerprint: "audio_...",
  plugins_installes: ["Chrome PDF Plugin", ...],
  polices_disponibles: ["Arial", "Verdana", ...]
}
```

#### FraudeService

```javascript
import { fraudeService } from '../services/securite';

// Analyser un utilisateur
const analyse = await fraudeService.analyserComportementUtilisateur(userId);

// Obtenir les alertes
const alertes = await fraudeService.obtenirAlertesFraude({ 
  niveau: 'HIGH',
  statut: 'pending' 
});

// Traiter une alerte
await fraudeService.traiterAlerte(alerteId, 'resolved', 'Faux positif');

// Bloquer un utilisateur
await fraudeService.bloquerUtilisateur(userId, 'Comportement suspect', 24);

// Débloquer un utilisateur
await fraudeService.debloquerUtilisateur(userId);

// Obtenir les statistiques
const stats = await fraudeService.obtenirStatistiquesSecurite('30d');
```

## 📊 Pages Admin

### Page Fraude (`/admin/fraude`)

Interface pour gérer les alertes de fraude :

- Vue d'ensemble des alertes actives
- Filtres par niveau de risque et statut
- Actions : investiguer, résoudre, bloquer
- Statistiques en temps réel
- Liste des actions répétitives détectées

### Page Sécurité (`/admin/securite`)

Analyse comportementale détaillée :

- Recherche et analyse d'utilisateurs
- Score de risque global
- Comportements suspects détectés
- Métriques comportementales (sessions, connexions, appareils)
- Comptes liés
- Actions de blocage/déblocage

## 🔐 Niveaux de Risque

| Niveau | Score | Actions Automatiques |
|--------|-------|---------------------|
| **CRITIQUE** | ≥0.9 | Blocage 24h, notification admins, terminaison sessions |
| **ÉLEVÉ** | ≥0.7 | 2FA obligatoire, limitation montants, notification utilisateur |
| **MOYEN** | ≥0.5 | Surveillance accrue 48h, vérification email |
| **FAIBLE** | <0.5 | Aucune action |

## 🎯 Détections Automatiques

Le système détecte automatiquement :

- ✅ Actions répétitives trop rapides (bots)
- ✅ Sessions multiples simultanées
- ✅ Changements d'IP fréquents
- ✅ Navigation anormale (pas d'interactions)
- ✅ Comptes liés (même empreinte)
- ✅ Voyages impossibles (géolocalisation)
- ✅ Tentatives de connexion répétées

## 🔌 Intégration avec Redux

Le module est intégré dans le Redux store via `authSlice.js` :

```javascript
// Lors de la connexion
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password, rememberMe }) => {
    // ... authentification ...
    
    // Initialiser le tracking
    const empreinte = await deviceFingerprintService.collecterEmpreinteAppareil();
    await trackingService.initialiserSession(empreinte);
    
    return userData;
  }
);

// Lors de la déconnexion
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    // Terminer la session de sécurité
    await trackingService.terminerSession();
    
    // ... déconnexion ...
  }
);
```

## 📡 Endpoints API Backend

Le module communique avec ces endpoints backend :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/securite/session/init/` | Initialiser session |
| POST | `/api/v1/securite/navigation/` | Enregistrer navigation |
| POST | `/api/v1/securite/interaction/` | Enregistrer interaction |
| POST | `/api/v1/securite/action/` | Enregistrer action |
| POST | `/api/v1/securite/heartbeat/` | Heartbeat (30s) |
| GET | `/api/v1/securite/session/actuelle/` | Session actuelle |
| GET | `/api/v1/securite/navigation/historique/` | Historique |
| POST | `/api/v1/securite/session/terminer/` | Terminer session |
| GET | `/api/v1/securite/alertes/` | Alertes de fraude |
| GET | `/api/v1/securite/analyse/utilisateur/:id/` | Analyser utilisateur |
| POST | `/api/v1/securite/bloquer-utilisateur/` | Bloquer utilisateur |
| POST | `/api/v1/securite/debloquer-utilisateur/` | Débloquer utilisateur |

## 🛡️ Sécurité & Conformité

- **Hashage** : Toutes les empreintes sont hashées (SHA-256)
- **RGPD** : Données anonymisées après 90 jours
- **Sessions** : Terminaison automatique après inactivité
- **Heartbeat** : Vérification toutes les 30 secondes
- **Encryption** : Communication HTTPS uniquement

## 📝 Exemple Complet

```jsx
import { useState } from 'react';
import { useSecurite } from '../hooks/useSecurite';
import { fraudeService } from '../services/securite';

function TransactionForm() {
  const [montant, setMontant] = useState('');
  const { 
    niveauRisque, 
    restrictions, 
    enregistrerAction,
    verifierAutorisation 
  } = useSecurite();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier autorisation
    if (!verifierAutorisation('transaction')) {
      alert('Transactions temporairement bloquées');
      return;
    }

    // Vérifier niveau de risque
    if (niveauRisque === 'CRITICAL') {
      alert('Compte suspendu pour raisons de sécurité');
      return;
    }

    try {
      // Effectuer la transaction
      const result = await api.createTransaction({ montant });

      // Enregistrer l'action
      await enregistrerAction(
        'api_transaction',
        '/api/v1/transactions/',
        { montant },
        result.success ? 'success' : 'error'
      );

      alert('Transaction réussie');
    } catch (error) {
      console.error('Erreur transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {niveauRisque !== 'LOW' && (
        <div className="alert alert-warning">
          Niveau de risque : {niveauRisque}
        </div>
      )}
      
      <input
        type="number"
        value={montant}
        onChange={(e) => setMontant(e.target.value)}
        placeholder="Montant"
      />
      
      <button type="submit">
        Envoyer
      </button>
    </form>
  );
}
```

## 🐛 Debugging

Pour activer les logs de debug :

```javascript
// Dans votre console navigateur
localStorage.setItem('DEBUG_SECURITE', 'true');

// Les services afficheront des logs détaillés
```

## 📞 Support

Pour toute question ou problème :

1. Consultez la documentation intégrée : `/admin/securite/documentation`
2. Vérifiez les logs dans la console navigateur
3. Contactez l'équipe de sécurité

## 🔄 Mises à Jour

Le module est automatiquement mis à jour avec l'application. Aucune action requise.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024

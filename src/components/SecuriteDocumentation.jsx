import { useState } from 'react';
import { Card } from './common';
import { 
  Shield, 
  Code, 
  Terminal, 
  BookOpen, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const SecuriteDocumentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BookOpen },
    { id: 'integration', label: 'Intégration', icon: Code },
    { id: 'api', label: 'API Endpoints', icon: Terminal },
    { id: 'security', label: 'Sécurité', icon: Shield }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Documentation - Module de Sécurité
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Guide complet d'utilisation du système de détection de fraude
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Fonctionnalités
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Device Fingerprinting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identification unique des appareils via Canvas, WebGL, Audio
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Détection Automatique</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Actions répétitives, sessions multiples, changements d'IP
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Analyse Comportementale</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Surveillance en temps réel des comportements suspects
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Actions Automatiques</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Blocage automatique selon le niveau de risque
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Niveaux de Risque
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-red-900 dark:text-red-300">CRITIQUE (≥0.9)</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Blocage temporaire 24h, notification admins, terminaison sessions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-900 dark:text-orange-300">ÉLEVÉ (≥0.7)</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-400">
                    Vérification 2FA obligatoire, limitation montants, notification utilisateur
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-300">MOYEN (≥0.5)</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Surveillance accrue 48h, demande vérification email
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'integration' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Intégration Frontend
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                1. Utiliser le Hook useSecurite
              </h3>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { useSecurite } from '../hooks/useSecurite';

function MonComposant() {
  const { 
    sessionSecurite, 
    niveauRisque, 
    restrictions,
    enregistrerAction,
    verifierAutorisation 
  } = useSecurite();

  const handleTransaction = async () => {
    // Vérifier si l'action est autorisée
    if (!verifierAutorisation('transaction')) {
      alert('Action non autorisée');
      return;
    }

    // Effectuer la transaction
    const result = await api.createTransaction(data);

    // Enregistrer l'action
    await enregistrerAction(
      'api_transaction',
      '/api/v1/transactions/',
      { montant: 1000 },
      result.success ? 'success' : 'error'
    );
  };

  return (
    <div>
      <p>Niveau de risque: {niveauRisque}</p>
      {restrictions.length > 0 && (
        <p>Restrictions: {restrictions.join(', ')}</p>
      )}
    </div>
  );
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                2. Tracking Automatique
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Le tracking est automatiquement initialisé lors de la connexion via le Redux store.
                Aucune configuration supplémentaire n'est nécessaire.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-300">
                    Le système enregistre automatiquement :
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>Navigation entre les pages</li>
                      <li>Clics sur les boutons critiques</li>
                      <li>Temps passé sur chaque page</li>
                      <li>Heartbeat toutes les 30 secondes</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Endpoints API
          </h2>
          
          <div className="space-y-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm">/api/v1/securite/session/init/</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Initialise la session de sécurité après connexion
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm">/api/v1/securite/navigation/</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enregistre une navigation entre pages
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">POST</span>
                <code className="text-sm">/api/v1/securite/action/</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enregistre une action critique (transaction, transfert, etc.)
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/v1/securite/alertes/</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Récupère les alertes de fraude
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">GET</span>
                <code className="text-sm">/api/v1/securite/analyse/utilisateur/:id/</code>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyse le comportement d'un utilisateur spécifique
              </p>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Considérations de Sécurité
          </h2>
          
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-300 mb-1">
                    Données Sécurisées
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Toutes les empreintes sont hashées (SHA-256) avant stockage
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-300 mb-1">
                    Conformité RGPD
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Données anonymisées automatiquement après 90 jours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-green-900 dark:text-green-300 mb-1">
                    Sessions Sécurisées
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Terminaison automatique après inactivité
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900 dark:text-yellow-300 mb-1">
                    Limitations
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Le fingerprinting peut être contourné par des utilisateurs avancés.
                    Utilisez-le en complément d'autres mesures de sécurité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SecuriteDocumentation;

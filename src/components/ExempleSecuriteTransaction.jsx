/**
 * Exemple d'utilisation du module de sécurité dans un formulaire de transaction
 * Ce composant montre comment intégrer le tracking et la vérification de sécurité
 */

import { useState } from 'react';
import { useSecurite } from '../hooks/useSecurite';
import { Card, Button, Input, Alert } from './common';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const ExempleSecuriteTransaction = () => {
  const [montant, setMontant] = useState('');
  const [destinataire, setDestinataire] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { 
    sessionSecurite,
    niveauRisque, 
    restrictions, 
    enregistrerAction,
    verifierAutorisation 
  } = useSecurite();

  const getNiveauRisqueStyle = () => {
    switch (niveauRisque) {
      case 'CRITICAL':
        return { color: 'red', icon: AlertTriangle, label: 'Critique' };
      case 'HIGH':
        return { color: 'orange', icon: AlertTriangle, label: 'Élevé' };
      case 'MEDIUM':
        return { color: 'yellow', icon: Shield, label: 'Moyen' };
      default:
        return { color: 'green', icon: CheckCircle, label: 'Faible' };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // 1. Vérifier si l'action est autorisée
    if (!verifierAutorisation('transaction')) {
      setMessage({
        type: 'error',
        text: 'Les transactions sont temporairement bloquées sur votre compte pour des raisons de sécurité.'
      });
      return;
    }

    // 2. Vérifier le niveau de risque
    if (niveauRisque === 'CRITICAL') {
      setMessage({
        type: 'error',
        text: 'Votre compte est suspendu. Veuillez contacter le support.'
      });
      return;
    }

    // 3. Avertissement pour risque élevé
    if (niveauRisque === 'HIGH') {
      const confirm = window.confirm(
        'Votre compte présente un niveau de risque élevé. Une vérification supplémentaire peut être requise. Continuer ?'
      );
      if (!confirm) return;
    }

    setLoading(true);

    try {
      // 4. Effectuer la transaction (simulation)
      // const result = await apiService.createTransaction({
      //   montant: parseFloat(montant),
      //   destinataire: destinataire
      // });

      // Simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = { success: true, id: 'TXN123456' };

      // 5. Enregistrer l'action dans le système de sécurité
      await enregistrerAction(
        'api_transaction',
        '/api/v1/transactions/',
        { 
          montant: parseFloat(montant),
          destinataire: destinataire 
        },
        result.success ? 'success' : 'error'
      );

      setMessage({
        type: 'success',
        text: `Transaction réussie ! ID: ${result.id}`
      });

      // Réinitialiser le formulaire
      setMontant('');
      setDestinataire('');

    } catch (error) {
      // Enregistrer l'échec
      await enregistrerAction(
        'api_transaction',
        '/api/v1/transactions/',
        { 
          montant: parseFloat(montant),
          destinataire: destinataire 
        },
        'error'
      );

      setMessage({
        type: 'error',
        text: error.message || 'Erreur lors de la transaction'
      });
    } finally {
      setLoading(false);
    }
  };

  const risqueStyle = getNiveauRisqueStyle();
  const RisqueIcon = risqueStyle.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Indicateur de sécurité */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              État de Sécurité
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Session ID: {sessionSecurite?.session_id || 'Non initialisée'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RisqueIcon className={`w-6 h-6 text-${risqueStyle.color}-600`} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${risqueStyle.color}-100 text-${risqueStyle.color}-800 border border-${risqueStyle.color}-300`}>
              Risque {risqueStyle.label}
            </span>
          </div>
        </div>

        {restrictions.length > 0 && (
          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-orange-900 dark:text-orange-300 font-medium mb-1">
              Restrictions actives :
            </p>
            <ul className="text-sm text-orange-700 dark:text-orange-400 list-disc ml-5">
              {restrictions.map((restriction, index) => (
                <li key={index}>{restriction}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Formulaire de transaction */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Nouvelle Transaction
        </h2>

        {message && (
          <Alert 
            type={message.type} 
            className="mb-4"
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Montant (BIF)
            </label>
            <Input
              type="number"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="1000"
              required
              min="1"
              disabled={loading || niveauRisque === 'CRITICAL'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Destinataire
            </label>
            <Input
              type="text"
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              placeholder="Numéro de téléphone ou ID"
              required
              disabled={loading || niveauRisque === 'CRITICAL'}
            />
          </div>

          {niveauRisque === 'HIGH' && (
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-orange-900 dark:text-orange-300">
                  Votre compte présente un niveau de risque élevé. Une vérification supplémentaire peut être requise.
                </p>
              </div>
            </div>
          )}

          {niveauRisque === 'CRITICAL' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900 dark:text-red-300">
                  Votre compte est temporairement suspendu. Veuillez contacter le support.
                </p>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || niveauRisque === 'CRITICAL' || !verifierAutorisation('transaction')}
            className="w-full"
          >
            {loading ? 'Traitement...' : 'Envoyer la Transaction'}
          </Button>
        </form>
      </Card>

      {/* Informations de sécurité */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
              Sécurité de vos transactions
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Toutes vos transactions sont surveillées en temps réel pour détecter toute activité suspecte.
              Votre sécurité est notre priorité.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExempleSecuriteTransaction;

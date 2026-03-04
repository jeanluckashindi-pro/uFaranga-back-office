import { useState, useEffect } from 'react';
import { Card } from '../../components/common';
import { fraudeService } from '../../services/securite';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const Fraude = () => {
  const [alertes, setAlertes] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [actionsRepetitives, setActionsRepetitives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtreNiveau, setFiltreNiveau] = useState('all');
  const [filtreStatut, setFiltreStatut] = useState('all');

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    setLoading(true);
    try {
      const [alertesData, statsData, actionsData] = await Promise.all([
        fraudeService.obtenirAlertesFraude(),
        fraudeService.obtenirStatistiquesSecurite('30d'),
        fraudeService.obtenirActionsRepetitives({ limit: 20 })
      ]);

      setAlertes(alertesData);
      setStatistiques(statsData);
      setActionsRepetitives(actionsData);
    } catch (error) {
      console.error('Erreur chargement données fraude:', error);
    } finally {
      setLoading(false);
    }
  };

  const traiterAlerte = async (alerteId, action) => {
    try {
      await fraudeService.traiterAlerte(alerteId, action);
      await chargerDonnees();
    } catch (error) {
      console.error('Erreur traitement alerte:', error);
    }
  };

  const bloquerUtilisateur = async (utilisateurId, raison) => {
    try {
      await fraudeService.bloquerUtilisateur(utilisateurId, raison, 24);
      await chargerDonnees();
    } catch (error) {
      console.error('Erreur blocage utilisateur:', error);
    }
  };

  const getNiveauRisqueStyle = (niveau) => {
    const styles = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-300',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      LOW: 'bg-green-100 text-green-800 border-green-300'
    };
    return styles[niveau] || styles.LOW;
  };

  const alertesFiltrees = alertes.filter(alerte => {
    if (filtreNiveau !== 'all' && alerte.niveau_risque !== filtreNiveau) return false;
    if (filtreStatut !== 'all' && alerte.statut !== filtreStatut) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Détection de Fraude
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Surveillance et analyse des comportements suspects
          </p>
        </div>
        <button
          onClick={chargerDonnees}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Actualiser
        </button>
      </div>

      {/* Statistiques */}
      {statistiques && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Alertes Actives</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistiques.alertes_actives || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comptes Bloqués</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistiques.comptes_bloques || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comptes Liés</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistiques.comptes_lies || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Score Moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {statistiques.score_risque_moyen?.toFixed(2) || '0.00'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Niveau de risque
            </label>
            <select
              value={filtreNiveau}
              onChange={(e) => setFiltreNiveau(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Tous</option>
              <option value="CRITICAL">Critique</option>
              <option value="HIGH">Élevé</option>
              <option value="MEDIUM">Moyen</option>
              <option value="LOW">Faible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="investigating">En investigation</option>
              <option value="resolved">Résolu</option>
              <option value="false_positive">Faux positif</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des alertes */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alertes de Fraude ({alertesFiltrees.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {alertesFiltrees.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune alerte trouvée
            </div>
          ) : (
            alertesFiltrees.map((alerte) => (
              <div key={alerte.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getNiveauRisqueStyle(alerte.niveau_risque)}`}>
                        {alerte.niveau_risque}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {alerte.type_alerte}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(alerte.date_creation).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 dark:text-white font-medium mb-2">
                      {alerte.description}
                    </p>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Utilisateur: {alerte.utilisateur_nom || alerte.utilisateur_id}</p>
                      {alerte.details && (
                        <p className="mt-1">Détails: {JSON.stringify(alerte.details)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => traiterAlerte(alerte.id, 'investigating')}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      title="Investiguer"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => traiterAlerte(alerte.id, 'resolved')}
                      className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
                      title="Résoudre"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => bloquerUtilisateur(alerte.utilisateur_id, alerte.description)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      title="Bloquer utilisateur"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Actions répétitives */}
      <Card>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Actions Répétitives Détectées
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {actionsRepetitives.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune action répétitive détectée
            </div>
          ) : (
            actionsRepetitives.map((action) => (
              <div key={action.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {action.type_action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.nombre_occurrences} occurrences en {action.intervalle_temps}s
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(action.premiere_occurrence).toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Fraude;

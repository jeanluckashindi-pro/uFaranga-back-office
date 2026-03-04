import { useState, useEffect } from 'react';
import { Card } from '../../components/common';
import { fraudeService } from '../../services/securite';
import { 
  Shield, 
  Users, 
  Activity,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Search
} from 'lucide-react';

const Securite = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState(null);
  const [analyse, setAnalyse] = useState(null);
  const [metriques, setMetriques] = useState(null);
  const [comptesLies, setComptesLies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const analyserUtilisateur = async (utilisateurId) => {
    setLoading(true);
    try {
      const [analyseData, metriquesData, comptesLiesData] = await Promise.all([
        fraudeService.analyserComportementUtilisateur(utilisateurId),
        fraudeService.obtenirMetriquesComportement(utilisateurId, '30d'),
        fraudeService.obtenirComptesLies(utilisateurId)
      ]);

      setAnalyse(analyseData);
      setMetriques(metriquesData);
      setComptesLies(comptesLiesData);
      setUtilisateurSelectionne(utilisateurId);
    } catch (error) {
      console.error('Erreur analyse utilisateur:', error);
    } finally {
      setLoading(false);
    }
  };

  const bloquerUtilisateur = async (utilisateurId, raison) => {
    try {
      await fraudeService.bloquerUtilisateur(utilisateurId, raison, 24);
      await analyserUtilisateur(utilisateurId);
    } catch (error) {
      console.error('Erreur blocage:', error);
    }
  };

  const debloquerUtilisateur = async (utilisateurId) => {
    try {
      await fraudeService.debloquerUtilisateur(utilisateurId);
      await analyserUtilisateur(utilisateurId);
    } catch (error) {
      console.error('Erreur déblocage:', error);
    }
  };

  const getNiveauRisqueStyle = (score) => {
    if (score >= 0.9) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 0.7) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getNiveauRisqueLabel = (score) => {
    if (score >= 0.9) return 'CRITIQUE';
    if (score >= 0.7) return 'ÉLEVÉ';
    if (score >= 0.5) return 'MOYEN';
    return 'FAIBLE';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sécurité et Analyse Comportementale
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyse détaillée des comportements utilisateurs
        </p>
      </div>

      {/* Recherche utilisateur */}
      <Card className="p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rechercher un utilisateur
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID utilisateur, nom, email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => searchTerm && analyserUtilisateur(searchTerm)}
              disabled={!searchTerm || loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyser
            </button>
          </div>
        </div>
      </Card>

      {/* Résultats de l'analyse */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && analyse && (
        <>
          {/* Score de risque global */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Score de Risque Global
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {(analyse.score_risque_global * 100).toFixed(1)}%
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getNiveauRisqueStyle(analyse.score_risque_global)}`}>
                    {getNiveauRisqueLabel(analyse.score_risque_global)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {analyse.compte_bloque ? (
                  <button
                    onClick={() => debloquerUtilisateur(utilisateurSelectionne)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Débloquer
                  </button>
                ) : (
                  <button
                    onClick={() => bloquerUtilisateur(utilisateurSelectionne, 'Comportement suspect')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Bloquer
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Comportements suspects */}
          {analyse.comportements_suspects && Object.keys(analyse.comportements_suspects).length > 0 && (
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Comportements Suspects Détectés
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analyse.comportements_suspects).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                        <span className="text-gray-900 dark:text-white">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Métriques comportementales */}
          {metriques && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sessions
                  </h3>
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.nombre_sessions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Durée moyenne</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(metriques.duree_moyenne_session / 60)}min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Simultanées</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.sessions_simultanees}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Connexions
                  </h3>
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Réussies</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.tentatives_connexion_reussies}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Échouées</span>
                    <span className="text-sm font-medium text-red-600">
                      {metriques.tentatives_connexion_echouees}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">IPs uniques</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.nombre_ip_uniques}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Appareils
                  </h3>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uniques</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.nombre_appareils_uniques}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Nouveaux</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.nouveaux_appareils}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Changements</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {metriques.changements_appareil}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Comptes liés */}
          {comptesLies && comptesLies.length > 0 && (
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Comptes Liés ({comptesLies.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {comptesLies.map((compte) => (
                  <div key={compte.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          Utilisateur #{compte.utilisateur_lie_id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Raison: {compte.raison_lien}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          Score de similarité: {(compte.score_similarite * 100).toFixed(1)}%
                        </p>
                      </div>
                      <button
                        onClick={() => analyserUtilisateur(compte.utilisateur_lie_id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actions automatiques */}
          {analyse.actions_automatiques && analyse.actions_automatiques.length > 0 && (
            <Card>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Actions Automatiques Appliquées
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-2">
                  {analyse.actions_automatiques.map((action, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Securite;

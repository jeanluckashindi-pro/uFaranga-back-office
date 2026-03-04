import { useState } from 'react';
import { Shield, X, LogOut, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const MultipleSessionsAlert = () => {
  const { activeSessions } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ne rien afficher si pas de sessions multiples ou si l'alerte a été fermée
  if (!activeSessions || 
      !activeSessions.connexion_multiple || 
      activeSessions.nombre_sessions_actives <= 1 ||
      dismissed) {
    return null;
  }

  const handleLogoutOtherSessions = async () => {
    setLoading(true);
    try {
      await apiService.logoutOtherSessions();
      setDismissed(true);
    } catch (error) {
      console.error('Erreur lors de la déconnexion des autres sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20 right-6 z-50 max-w-md animate-slide-in">
      <div className="bg-card border border-darkGray rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-text mb-1">Alerte de sécurité</h3>
                <p className="text-sm text-gray-400">
                  {activeSessions.nombre_sessions_actives} sessions actives détectées
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-gray-400 hover:text-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-300 mb-5 leading-relaxed">
            Votre compte est utilisé sur plusieurs appareils. Déconnectez les sessions non reconnues pour sécuriser votre compte.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleLogoutOtherSessions}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Déconnexion...' : 'Sécuriser'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-4 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all"
            >
              Ignorer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultipleSessionsAlert;

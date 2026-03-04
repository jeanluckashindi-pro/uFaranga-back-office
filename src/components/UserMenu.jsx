import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from './common';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getFullName, getInitials, getUserTypeLabel } = useUser();

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Avatar et info utilisateur */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 pl-4 border-l border-text/10 hover:bg-darkGray rounded-lg transition-colors p-2"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-text/25 flex items-center justify-center text-white font-bold">
            {getInitials()}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-semibold text-text">{getFullName()}</div>
            <div className="text-xs text-gray-400 capitalize">{getUserTypeLabel()}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-card border border-darkGray rounded-lg shadow-2xl z-50 overflow-hidden">
            {/* Header du menu */}
            <div className="px-4 py-3 border-b border-darkGray bg-background">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-text/25 flex items-center justify-center text-white font-bold text-lg">
                  {getInitials()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text truncate">{getFullName()}</div>
                  <div className="text-xs text-gray-400 capitalize">{getUserTypeLabel()}</div>
                </div>
              </div>
            </div>

            {/* Options du menu */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-background transition-colors text-left"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-text">Mon profil</span>
              </button>

              <button
                onClick={handleSettingsClick}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-background transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-text">Paramètres</span>
              </button>

              <div className="my-2 border-t border-darkGray"></div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutModal(true);
                }}
                className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Se déconnecter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <Modal
          isOpen={showLogoutModal}
          onClose={() => !isLoggingOut && setShowLogoutModal(false)}
          title="Confirmer la déconnexion"
          size="small"
        >
          <div className="space-y-6">
            {/* Icône et message */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-sm text-gray-400 font-sans leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter ?<br />
                Vous devrez vous reconnecter pour accéder à votre compte.
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium font-sans text-text bg-darkGray hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-sm font-medium font-sans bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Déconnexion...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default UserMenu;

import React from 'react';
import { useUser } from '../hooks/useUser';
import { Mail, Phone, Shield, CheckCircle, XCircle, User, Calendar, MapPin, Award } from 'lucide-react';

const UserProfile = () => {
  const { user, getFullName, getKycLevel, isEmailVerified, isPhoneVerified, getUserTypeLabel } = useUser();

  if (!user) {
    return null;
  }

  const kycLevelLabels = {
    0: 'Non vérifié',
    1: 'Niveau 1 - Basique',
    2: 'Niveau 2 - Intermédiaire',
    3: 'Niveau 3 - Complet'
  };

  const riskCategoryLabels = {
    'faible': 'Risque Faible',
    'moyen': 'Risque Moyen',
    'eleve': 'Risque Élevé'
  };

  const riskCategoryColors = {
    'faible': 'text-green-500',
    'moyen': 'text-yellow-500',
    'eleve': 'text-red-500'
  };

  return (
    <div className="bg-card border border-darkGray rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-text/25 flex items-center justify-center text-white font-bold text-2xl">
          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-heading font-bold text-text">{getFullName()}</h2>
          <p className="text-sm text-gray-400">{user.email}</p>
          {user.numeroClient && (
            <p className="text-xs text-gray-500 mt-1">N° Client: {user.numeroClient}</p>
          )}
          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
            <User className="w-3 h-3" />
            {getUserTypeLabel()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-text">{user.email}</span>
          </div>
          {isEmailVerified() ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
        </div>

        {/* Téléphone */}
        {user.phoneNumber && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-text">{user.phoneNumber}</span>
            </div>
            {isPhoneVerified() ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}

        {/* Date de naissance et âge */}
        {user.dateOfBirth && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-text">
              {new Date(user.dateOfBirth).toLocaleDateString('fr-FR')}
              {user.age && ` (${user.age} ans)`}
            </span>
          </div>
        )}

        {/* Localisation */}
        {user.location?.addressLine1 && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-text">{user.location.addressLine1}</span>
          </div>
        )}

        {/* Niveau KYC */}
        <div className="pt-4 border-t border-darkGray">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Niveau KYC</span>
            </div>
            <span className="text-sm font-medium text-text">
              {kycLevelLabels[getKycLevel()] || 'Non défini'}
            </span>
          </div>
          
          {/* Statut KYC */}
          {user.kycStatus && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Statut KYC</span>
              <span className={`text-sm font-medium ${user.kycStatus === 'valide' ? 'text-green-500' : 'text-yellow-500'}`}>
                {user.kycStatus === 'valide' ? 'Validé' : user.kycStatus}
              </span>
            </div>
          )}

          {/* Catégorie de risque */}
          {user.riskCategory && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Catégorie de risque</span>
              <span className={`text-sm font-medium ${riskCategoryColors[user.riskCategory] || 'text-gray-400'}`}>
                {riskCategoryLabels[user.riskCategory] || user.riskCategory}
              </span>
            </div>
          )}
        </div>

        {/* Sécurité */}
        {user.twoFactorEnabled && (
          <div className="pt-4 border-t border-darkGray">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-sm text-text">Authentification à deux facteurs activée</span>
              {user.twoFactorMethod && (
                <span className="text-xs text-gray-400">({user.twoFactorMethod.toUpperCase()})</span>
              )}
            </div>
          </div>
        )}

        {/* Préférences */}
        {user.preferences && (
          <div className="pt-4 border-t border-darkGray">
            <h3 className="text-sm font-medium text-text mb-2">Préférences</h3>
            <div className="space-y-1 text-xs text-gray-400">
              {user.preferences.language && (
                <div>Langue: {user.preferences.language.toUpperCase()}</div>
              )}
              {user.preferences.preferredCurrency && (
                <div>Devise: {user.preferences.preferredCurrency}</div>
              )}
              {user.preferences.timezone && (
                <div>Fuseau horaire: {user.preferences.timezone}</div>
              )}
            </div>
          </div>
        )}

        {/* ID Utilisateur */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">ID Utilisateur</span>
            <span className="text-xs font-mono text-gray-500">{user.id}</span>
          </div>
        </div>

        {/* Dernière connexion */}
        {user.lastLogin && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Dernière connexion</span>
            <span className="text-xs text-gray-500">
              {new Date(user.lastLogin).toLocaleString('fr-FR')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

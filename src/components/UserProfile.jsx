import React from 'react';
import { useUser } from '../hooks/useUser';
import { Mail, Phone, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserProfile = () => {
  const { user, getFullName, getKycLevel, isEmailVerified, isPhoneVerified, isStaff } = useUser();

  if (!user) {
    return null;
  }

  const kycLevelLabels = {
    0: 'Non vérifié',
    1: 'Niveau 1 - Basique',
    2: 'Niveau 2 - Intermédiaire',
    3: 'Niveau 3 - Complet'
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
          {isStaff() && (
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
              <Shield className="w-3 h-3" />
              Administrateur
            </span>
          )}
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

        {/* Niveau KYC */}
        <div className="pt-4 border-t border-darkGray">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Niveau KYC</span>
            <span className="text-sm font-medium text-text">
              {kycLevelLabels[getKycLevel()] || 'Non défini'}
            </span>
          </div>
        </div>

        {/* ID Utilisateur */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">ID Utilisateur</span>
            <span className="text-xs font-mono text-gray-500">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

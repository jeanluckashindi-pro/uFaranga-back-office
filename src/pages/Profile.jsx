import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, 
  AlertTriangle, Edit, Key, Bell, Globe, CreditCard, Activity
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { Card, Skeleton, SkeletonCard, SkeletonList } from '../components/common';
import EditProfileModal from '../components/EditProfileModal';
import apiService from '../services/api';

// Composant Skeleton pour la page Profile
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="w-full p-6 md:p-10">
      {/* Header Skeleton */}
      <SkeletonCard className="mb-8 overflow-hidden">
        {/* Cover photo skeleton */}
        <Skeleton className="h-48 w-full rounded-none -m-6 mb-0" />
        
        <div className="p-6 md:p-8 -mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar skeleton */}
            <Skeleton variant="avatar" className="border-4 border-card shadow-xl" />
            
            {/* Info skeleton */}
            <div className="flex-1 w-full">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-8 w-64" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton variant="button" />
              </div>
              
              {/* Stats skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card border border-darkGray rounded-lg p-3">
                    <Skeleton className="h-3 w-20 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SkeletonCard>

      {/* Tabs skeleton */}
      <SkeletonCard className="mb-6 p-0">
        <div className="flex gap-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </SkeletonCard>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2">
          <SkeletonCard>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-darkGray/50">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <SkeletonList items={6} />
          </SkeletonCard>
        </div>
        
        {/* Sidebar */}
        <div>
          <SkeletonCard>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-darkGray/50">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="text-center py-4 mb-4">
              <Skeleton className="h-20 w-20 rounded-full mx-auto mb-3" />
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-3 w-32 mx-auto" />
            </div>
            <SkeletonList items={3} />
          </SkeletonCard>
        </div>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user: contextUser, getFullName, getKycLevel, isEmailVerified, isPhoneVerified, getUserTypeLabel } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [disconnectingOthers, setDisconnectingOthers] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const data = await apiService.getProfile();
      setProfileData(data);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectOtherSessions = async () => {
    setDisconnectingOthers(true);
    try {
      await apiService.logoutOtherSessions();
      // Recharger les données du profil pour mettre à jour le nombre de sessions
      await loadProfileData();
    } catch (error) {
      console.error('Erreur lors de la déconnexion des autres sessions:', error);
    } finally {
      setDisconnectingOthers(false);
    }
  };

  const handleEditSuccess = () => {
    // Recharger les données du profil après modification
    loadProfileData();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-2">Erreur de chargement</h3>
          <p className="text-sm text-gray-400 mb-4">
            Impossible de charger les données du profil
          </p>
          <button 
            onClick={loadProfileData}
            className="px-4 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </Card>
      </div>
    );
  }

  const kycLevelLabels = {
    0: { label: 'Non vérifié', color: 'text-gray-400', bg: 'bg-gray-400/20' },
    1: { label: 'Niveau 1 - Basique', color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    2: { label: 'Niveau 2 - Intermédiaire', color: 'text-blue-400', bg: 'bg-blue-400/20' },
    3: { label: 'Niveau 3 - Complet', color: 'text-green-400', bg: 'bg-green-400/20' }
  };

  const statusLabels = {
    'ACTIF': { label: 'Actif', color: 'text-green-400', bg: 'bg-green-400/20' },
    'INACTIF': { label: 'Inactif', color: 'text-gray-400', bg: 'bg-gray-400/20' },
    'SUSPENDU': { label: 'Suspendu', color: 'text-red-400', bg: 'bg-red-400/20' },
    'BLOQUE': { label: 'Bloqué', color: 'text-red-600', bg: 'bg-red-600/20' }
  };

  const kycInfo = kycLevelLabels[profileData.niveau_kyc] || kycLevelLabels[0];
  const statusInfo = statusLabels[profileData.statut] || statusLabels['ACTIF'];

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full p-6 md:p-10">
        {/* Header avec avatar et infos principales */}
        <Card className="mb-8 overflow-hidden">
          {/* Photo de couverture */}
          {profileData.profil?.url_photo_couverture && (
            <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20">
              <img 
                src={profileData.profil.url_photo_couverture} 
                alt="Couverture" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!profileData.profil?.url_photo_couverture && (
            <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
          )}

          <div className="p-6 md:p-8 -mt-16">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                {profileData.profil?.url_avatar ? (
                  <img 
                    src={profileData.profil.url_avatar} 
                    alt="Avatar" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-card shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-4 border-card shadow-xl flex items-center justify-center text-white font-bold text-4xl">
                    {profileData.prenom?.charAt(0)}{profileData.nom_famille?.charAt(0)}
                  </div>
                )}
                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full ${statusInfo.bg} border-4 border-card flex items-center justify-center shadow-lg`}>
                  {profileData.est_actif ? (
                    <CheckCircle className={`w-3 h-3 ${statusInfo.color}`} />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-400" />
                  )}
                </div>
              </div>

              {/* Informations principales */}
              <div className="flex-1 w-full">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-heading font-bold text-text mb-3">
                      {profileData.nom_complet}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium font-sans ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-primary/20 text-primary">
                        {getUserTypeLabel()}
                      </span>
                      {profileData.is_staff && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium font-sans bg-secondary/20 text-secondary flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Staff
                        </span>
                      )}
                    </div>
                    
                    {/* ID Utilisateur */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                      <User className="w-3 h-3" />
                      <span>{profileData.id}</span>
                    </div>
                  </div>

                  <button className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 shadow-lg font-sans font-medium" onClick={() => setShowEditModal(true)}>
                    <Edit className="w-4 h-4" />
                    Modifier le profil
                  </button>
                </div>

                {/* Statistiques rapides - Design compact */}
                <div className="flex flex-wrap items-center gap-4 p-4 bg-background border border-darkGray rounded-lg">
                  {/* Niveau KYC */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Niveau KYC</div>
                      <div className={`text-sm font-bold font-sans ${kycInfo.color}`}>{kycInfo.label}</div>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="h-10 w-px bg-darkGray"></div>

                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Email</div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium font-sans ${profileData.courriel_verifie ? 'text-green-400' : 'text-red-400'}`}>
                          {profileData.courriel_verifie ? 'Vérifié' : 'Non vérifié'}
                        </span>
                        {profileData.courriel_verifie ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="h-10 w-px bg-darkGray"></div>

                  {/* Téléphone */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Téléphone</div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium font-sans ${profileData.telephone_verifie ? 'text-green-400' : 'text-red-400'}`}>
                          {profileData.telephone_verifie ? 'Vérifié' : 'Non vérifié'}
                        </span>
                        {profileData.telephone_verifie ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Séparateur */}
                  <div className="h-10 w-px bg-darkGray"></div>

                  {/* 2FA */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">2FA</div>
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium font-sans ${profileData.double_auth_activee ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.double_auth_activee ? 'Activée' : 'Désactivée'}
                        </span>
                        {profileData.double_auth_activee ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Onglets */}
        <div className="mb-6">
          <Card className="p-0 overflow-hidden">
            <div className="flex gap-0 overflow-x-auto">
              {[
                { id: 'personal', label: 'Informations personnelles', icon: User },
                { id: 'contact', label: 'Contact & Adresse', icon: MapPin },
                { id: 'security', label: 'Sécurité', icon: Shield },
                { id: 'preferences', label: 'Préférences', icon: Bell },
                { id: 'sessions', label: 'Sessions actives', icon: Activity }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-transparent text-gray-400 hover:text-text hover:bg-darkGray'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Informations personnelles */}
            <ProfileSection title="Informations personnelles" icon={User}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Prénom</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.prenom || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Nom de famille</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.nom_famille || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Nom complet</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.nom_complet || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Date de naissance</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.date_naissance || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Lieu de naissance</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.lieu_naissance || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Nationalité</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.nationalite || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Vérification KYC */}
            <ProfileSection title="Vérification KYC" icon={Shield}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Niveau KYC</div>
                      <div className={`text-sm font-bold font-sans ${kycInfo.color}`}>{kycInfo.label}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Type d'utilisateur</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.type_utilisateur}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Statut</div>
                      <div className={`text-sm font-medium font-sans ${statusInfo.color}`}>{statusInfo.label}</div>
                    </div>
                  </div>
                </div>

                {profileData.date_validation_kyc && (
                  <div className="p-4 bg-background border border-darkGray rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Validé le</div>
                        <div className="text-sm font-medium text-text font-sans">
                          {new Date(profileData.date_validation_kyc).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ProfileSection>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Coordonnées */}
            <ProfileSection title="Coordonnées" icon={Mail}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Adresse e-mail</div>
                        <div className="text-sm font-medium text-text font-sans">{profileData.courriel || 'Non renseigné'}</div>
                        {profileData.courriel_verifie_le && (
                          <div className="text-xs text-gray-500 mt-1 font-sans">
                            Vérifié le {new Date(profileData.courriel_verifie_le).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                    {profileData.courriel_verifie ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Numéro de téléphone</div>
                        <div className="text-sm font-medium text-text font-sans">{profileData.numero_telephone || 'Non renseigné'}</div>
                        {profileData.telephone_verifie_le && (
                          <div className="text-xs text-gray-500 mt-1 font-sans">
                            Vérifié le {new Date(profileData.telephone_verifie_le).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                    {profileData.telephone_verifie ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Adresse postale */}
            <ProfileSection title="Adresse postale" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Pays</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.pays_residence || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Province</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.province || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Ville</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.ville || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Commune</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.commune || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Quartier</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.quartier || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Avenue</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.avenue || 'Non renseignée'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">N° Maison</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.numero_maison || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Code postal</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.code_postal || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {profileData.adresse_complete && (
                <div className="mt-4 p-4 bg-background border border-darkGray rounded-lg">
                  <div className="text-xs text-gray-400 mb-2 font-sans">Adresse complète</div>
                  <div className="text-sm text-text leading-relaxed font-sans">{profileData.adresse_complete}</div>
                </div>
              )}
            </ProfileSection>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="grid grid-cols-1 gap-6">
            {/* Sécurité du compte */}
            <ProfileSection title="Sécurité du compte" icon={Key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Authentification 2FA</div>
                        <div className={`text-sm font-medium font-sans ${profileData.double_auth_activee ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.double_auth_activee ? 'Activée' : 'Désactivée'}
                        </div>
                      </div>
                    </div>
                    {profileData.double_auth_activee ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Tentatives de connexion</div>
                      <div className="text-sm font-medium text-text font-sans">
                        {profileData.nombre_tentatives_connexion || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {profileData.bloque_jusqua && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-xs text-red-400 font-sans">Bloqué jusqu'à</div>
                        <div className="text-sm font-medium text-red-400 font-sans">
                          {new Date(profileData.bloque_jusqua).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Dernière connexion</div>
                      <div className="text-sm font-medium text-text font-sans">
                        {profileData.derniere_connexion ? new Date(profileData.derniere_connexion).toLocaleString('fr-FR') : 'Jamais'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Changement mot de passe</div>
                      <div className="text-sm font-medium text-text font-sans">
                        {profileData.derniere_modification_mdp ? new Date(profileData.derniere_modification_mdp).toLocaleString('fr-FR') : 'Jamais'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg font-sans font-medium">
                  <Key className="w-4 h-4" />
                  Changer le mot de passe
                </button>
              </div>
            </ProfileSection>

            {/* Historique du compte */}
            <ProfileSection title="Historique du compte" icon={Calendar}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Compte créé le</div>
                      <div className="text-sm font-medium text-text font-sans">
                        {new Date(profileData.date_creation).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Dernière modification</div>
                      <div className="text-sm font-medium text-text font-sans">
                        {new Date(profileData.date_modification).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Compte actif</div>
                        <div className={`text-sm font-medium font-sans ${profileData.est_actif ? 'text-green-400' : 'text-red-400'}`}>
                          {profileData.est_actif ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.est_actif ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Staff</div>
                        <div className={`text-sm font-medium font-sans ${profileData.is_staff ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.is_staff ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.is_staff ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Superuser</div>
                        <div className={`text-sm font-medium font-sans ${profileData.is_superuser ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.is_superuser ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.is_superuser ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </ProfileSection>
          </div>
        )}

        {activeTab === 'preferences' && profileData.profil && (
          <div className="grid grid-cols-1 gap-6">
            {/* Préférences régionales */}
            <ProfileSection title="Préférences régionales" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Langue</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.profil.langue || 'Non définie'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Devise préférée</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.profil.devise_preferee || 'Non définie'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Fuseau horaire</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.profil.fuseau_horaire || 'Non défini'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Format de date</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.profil.format_date || 'Non défini'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-sans">Format d'heure</div>
                      <div className="text-sm font-medium text-text font-sans">{profileData.profil.format_heure || 'Non défini'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Notifications */}
            <ProfileSection title="Notifications" icon={Bell}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Email</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.notifications_courriel ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.notifications_courriel ? 'Activées' : 'Désactivées'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.notifications_courriel ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">SMS</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.notifications_sms ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.notifications_sms ? 'Activées' : 'Désactivées'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.notifications_sms ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Push</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.notifications_push ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.notifications_push ? 'Activées' : 'Désactivées'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.notifications_push ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Transactions</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.notifications_transactions ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.notifications_transactions ? 'Activées' : 'Désactivées'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.notifications_transactions ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Marketing</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.notifications_marketing ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.notifications_marketing ? 'Activées' : 'Désactivées'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.notifications_marketing ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </ProfileSection>

            {/* Confidentialité */}
            <ProfileSection title="Confidentialité" icon={Shield}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Profil public</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.profil_public ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.profil_public ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.profil_public ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Afficher téléphone</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.afficher_telephone ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.afficher_telephone ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.afficher_telephone ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="p-4 bg-background border border-darkGray rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sans">Afficher email</div>
                        <div className={`text-sm font-medium font-sans ${profileData.profil.afficher_courriel ? 'text-green-400' : 'text-gray-400'}`}>
                          {profileData.profil.afficher_courriel ? 'Oui' : 'Non'}
                        </div>
                      </div>
                    </div>
                    {profileData.profil.afficher_courriel ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {profileData.profil.biographie && (
                <div className="mt-4 p-4 bg-background border border-darkGray rounded-lg">
                  <div className="text-xs text-gray-400 mb-2 font-sans">Biographie</div>
                  <p className="text-sm text-text leading-relaxed font-sans">{profileData.profil.biographie}</p>
                </div>
              )}
            </ProfileSection>
          </div>
        )}

        {activeTab === 'sessions' && profileData.sessions_actives && (
          <Card className="p-6 bg-card border border-darkGray">
            <h3 className="text-lg font-heading font-bold text-text mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Sessions actives
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background border border-darkGray rounded-lg">
                <div>
                  <div className="text-sm font-medium text-text mb-1">
                    Nombre de sessions actives
                  </div>
                  <div className="text-xs text-gray-400">
                    {profileData.sessions_actives.message}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {profileData.sessions_actives.nombre_sessions_actives}
                </div>
              </div>

              {profileData.sessions_actives.connexion_multiple && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-yellow-500 mb-1">
                        Connexions multiples détectées
                      </div>
                      <div className="text-xs text-gray-400">
                        Votre compte est actuellement utilisé sur plusieurs appareils. Si ce n'est pas vous, déconnectez immédiatement les autres sessions.
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleDisconnectOtherSessions}
                    disabled={disconnectingOthers}
                    className="w-full px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {disconnectingOthers ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                        Déconnexion en cours...
                      </>
                    ) : (
                      'Déconnecter les autres sessions'
                    )}
                  </button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Modal de modification */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profileData={profileData}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

// Composant pour afficher une information avec icône et valeur
const InfoItem = ({ icon: Icon, label, value, verified, verifiedDate }) => (
  <div className="group">
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-darkGray/30 transition-all">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-400 mb-1 font-sans">{label}</div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-sm font-medium text-text break-words font-sans">{value || 'Non renseigné'}</div>
          {verified !== undefined && (
            verified ? (
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            )
          )}
        </div>
        {verifiedDate && (
          <div className="text-xs text-gray-500 mt-1 font-sans">
            Vérifié le {new Date(verifiedDate).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Composant pour les sections avec titre
const ProfileSection = ({ title, icon: Icon, children, actions }) => (
  <div className="bg-card border border-darkGray rounded-lg overflow-hidden">
    <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-darkGray flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-base font-heading font-bold text-text">{title}</h3>
      </div>
      {actions && <div>{actions}</div>}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// Composant pour les statistiques KYC
const KYCBadge = ({ level, label, color, bg }) => (
  <div className="text-center">
    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${bg} mb-4 relative`}>
      <Shield className={`w-12 h-12 ${color}`} />
      <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${bg} border-4 border-card flex items-center justify-center`}>
        <span className={`text-lg font-bold ${color}`}>{level}</span>
      </div>
    </div>
    <div className={`text-base font-bold ${color} mb-1`}>Niveau {level}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default Profile;




import { useState, useEffect } from 'react';
import { 
  X, Save, User, Mail, Phone, MapPin, Globe, Calendar, 
  Image, Bell, Shield, AlertCircle, CheckCircle, Lock
} from 'lucide-react';
import { Input, PasswordInput } from './common';
import apiService from '../services/api';

const EditProfileModal = ({ isOpen, onClose, profileData, onSuccess }) => {
  const [activeSection, setActiveSection] = useState('identity');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changedFields, setChangedFields] = useState(new Set());

  useEffect(() => {
    if (profileData) {
      setFormData({
        // Identité
        prenom: profileData.prenom || '',
        nom_famille: profileData.nom_famille || '',
        date_naissance: profileData.date_naissance || '',
        lieu_naissance: profileData.lieu_naissance || '',
        nationalite: profileData.nationalite || '',
        
        // Contact
        courriel: profileData.courriel || '',
        numero_telephone: profileData.numero_telephone || '',
        
        // Adresse
        pays_residence: profileData.pays_residence || '',
        province: profileData.province || '',
        ville: profileData.ville || '',
        commune: profileData.commune || '',
        quartier: profileData.quartier || '',
        avenue: profileData.avenue || '',
        numero_maison: profileData.numero_maison || '',
        code_postal: profileData.code_postal || '',
        adresse_complete: profileData.adresse_complete || '',
        
        // Profil
        profil: {
          url_avatar: profileData.profil?.url_avatar || '',
          url_photo_couverture: profileData.profil?.url_photo_couverture || '',
          biographie: profileData.profil?.biographie || '',
          langue: profileData.profil?.langue || 'fr',
          devise_preferee: profileData.profil?.devise_preferee || 'BIF',
          fuseau_horaire: profileData.profil?.fuseau_horaire || 'Africa/Bujumbura',
          format_date: profileData.profil?.format_date || 'DD/MM/YYYY',
          format_heure: profileData.profil?.format_heure || '24h',
          notifications_courriel: profileData.profil?.notifications_courriel ?? true,
          notifications_sms: profileData.profil?.notifications_sms ?? true,
          notifications_push: profileData.profil?.notifications_push ?? true,
          notifications_transactions: profileData.profil?.notifications_transactions ?? true,
          notifications_marketing: profileData.profil?.notifications_marketing ?? false,
          profil_public: profileData.profil?.profil_public ?? false,
          afficher_telephone: profileData.profil?.afficher_telephone ?? false,
          afficher_courriel: profileData.profil?.afficher_courriel ?? false,
        }
      });
    }
  }, [profileData]);

  const handleChange = (field, value, isProfileField = false) => {
    if (isProfileField) {
      setFormData(prev => ({
        ...prev,
        profil: {
          ...prev.profil,
          [field]: value
        }
      }));
      setChangedFields(prev => new Set(prev).add(`profil.${field}`));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      setChangedFields(prev => new Set(prev).add(field));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Utiliser PATCH pour mise à jour partielle
      await apiService.updateProfile(formData);
      
      setSuccess('Profil mis à jour avec succès');
      setChangedFields(new Set());
      
      // Appeler le callback de succès après 1 seconde
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const sections = [
    { id: 'identity', label: 'Identité', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'address', label: 'Adresse', icon: MapPin },
    { id: 'preferences', label: 'Préférences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-card border border-darkGray rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-darkGray bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-heading font-bold text-text">Modifier mon profil</h2>
                <p className="text-xs text-gray-400">Mettez à jour vos informations personnelles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mx-6 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-sm text-green-400">{success}</span>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-darkGray bg-background/50 p-4 overflow-y-auto">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-gray-400 hover:text-text hover:bg-darkGray/50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identité */}
                {activeSection === 'identity' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Prénom <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={formData.prenom}
                          onChange={(e) => handleChange('prenom', e.target.value)}
                          placeholder="Votre prénom"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Nom de famille <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={formData.nom_famille}
                          onChange={(e) => handleChange('nom_famille', e.target.value)}
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Date de naissance
                        </label>
                        <Input
                          type="date"
                          value={formData.date_naissance}
                          onChange={(e) => handleChange('date_naissance', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Lieu de naissance
                        </label>
                        <Input
                          value={formData.lieu_naissance}
                          onChange={(e) => handleChange('lieu_naissance', e.target.value)}
                          placeholder="Ville de naissance"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text mb-2">
                          Nationalité
                        </label>
                        <Input
                          value={formData.nationalite}
                          onChange={(e) => handleChange('nationalite', e.target.value)}
                          placeholder="Ex: BI, FR, CD..."
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {activeSection === 'contact' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-medium text-yellow-500 mb-1">Attention</p>
                        <p>La modification de votre email ou téléphone nécessitera une nouvelle vérification.</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Adresse e-mail <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.courriel}
                        onChange={(e) => handleChange('courriel', e.target.value)}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Numéro de téléphone <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="tel"
                        value={formData.numero_telephone}
                        onChange={(e) => handleChange('numero_telephone', e.target.value)}
                        placeholder="+257 79 000 000"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Format international requis (ex: +257...)</p>
                    </div>
                  </div>
                )}

                {/* Adresse */}
                {activeSection === 'address' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Pays de résidence
                        </label>
                        <Input
                          value={formData.pays_residence}
                          onChange={(e) => handleChange('pays_residence', e.target.value)}
                          placeholder="Ex: BI"
                          maxLength={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Province
                        </label>
                        <Input
                          value={formData.province}
                          onChange={(e) => handleChange('province', e.target.value)}
                          placeholder="Province"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Ville
                        </label>
                        <Input
                          value={formData.ville}
                          onChange={(e) => handleChange('ville', e.target.value)}
                          placeholder="Ville"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Commune
                        </label>
                        <Input
                          value={formData.commune}
                          onChange={(e) => handleChange('commune', e.target.value)}
                          placeholder="Commune"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Quartier
                        </label>
                        <Input
                          value={formData.quartier}
                          onChange={(e) => handleChange('quartier', e.target.value)}
                          placeholder="Quartier"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Avenue
                        </label>
                        <Input
                          value={formData.avenue}
                          onChange={(e) => handleChange('avenue', e.target.value)}
                          placeholder="Avenue"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Numéro de maison
                        </label>
                        <Input
                          value={formData.numero_maison}
                          onChange={(e) => handleChange('numero_maison', e.target.value)}
                          placeholder="N°"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Code postal
                        </label>
                        <Input
                          value={formData.code_postal}
                          onChange={(e) => handleChange('code_postal', e.target.value)}
                          placeholder="Code postal"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text mb-2">
                          Adresse complète
                        </label>
                        <textarea
                          value={formData.adresse_complete}
                          onChange={(e) => handleChange('adresse_complete', e.target.value)}
                          placeholder="Adresse complète..."
                          rows={3}
                          className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-lg text-text placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Préférences */}
                {activeSection === 'preferences' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Langue
                        </label>
                        <select
                          value={formData.profil?.langue}
                          onChange={(e) => handleChange('langue', e.target.value, true)}
                          className="w-full px-4 py-2 bg-card border border-gray-400 rounded-lg text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        >
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="rn">Kirundi</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Devise préférée
                        </label>
                        <select
                          value={formData.profil?.devise_preferee}
                          onChange={(e) => handleChange('devise_preferee', e.target.value, true)}
                          className="w-full px-4 py-2 bg-card border border-gray-400 rounded-lg text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        >
                          <option value="BIF">BIF - Franc burundais</option>
                          <option value="USD">USD - Dollar américain</option>
                          <option value="EUR">EUR - Euro</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Format de date
                        </label>
                        <select
                          value={formData.profil?.format_date}
                          onChange={(e) => handleChange('format_date', e.target.value, true)}
                          className="w-full px-4 py-2 bg-card border border-gray-400 rounded-lg text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text mb-2">
                          Format d'heure
                        </label>
                        <select
                          value={formData.profil?.format_heure}
                          onChange={(e) => handleChange('format_heure', e.target.value, true)}
                          className="w-full px-4 py-2 bg-card border border-gray-400 rounded-lg text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        >
                          <option value="24h">24 heures</option>
                          <option value="12h">12 heures (AM/PM)</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-text mb-2">
                          Biographie
                        </label>
                        <textarea
                          value={formData.profil?.biographie}
                          onChange={(e) => handleChange('biographie', e.target.value, true)}
                          placeholder="Parlez-nous de vous..."
                          rows={4}
                          maxLength={500}
                          className="w-full px-4 py-2 bg-transparent border border-gray-400 rounded-lg text-text placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {formData.profil?.biographie?.length || 0}/500 caractères
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === 'notifications' && (
                  <div className="space-y-4">
                    {[
                      { key: 'notifications_courriel', label: 'Notifications par e-mail', desc: 'Recevoir des notifications par e-mail' },
                      { key: 'notifications_sms', label: 'Notifications par SMS', desc: 'Recevoir des notifications par SMS' },
                      { key: 'notifications_push', label: 'Notifications push', desc: 'Recevoir des notifications push sur vos appareils' },
                      { key: 'notifications_transactions', label: 'Notifications de transactions', desc: 'Être notifié de toutes vos transactions' },
                      { key: 'notifications_marketing', label: 'Notifications marketing', desc: 'Recevoir des offres et promotions' },
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-start gap-4 p-4 bg-background border border-darkGray rounded-lg">
                        <input
                          type="checkbox"
                          checked={formData.profil?.[notif.key] ?? false}
                          onChange={(e) => handleChange(notif.key, e.target.checked, true)}
                          className="mt-1 w-4 h-4 text-primary bg-card border-gray-400 rounded focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text">{notif.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{notif.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Confidentialité */}
                {activeSection === 'privacy' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <p className="font-medium text-primary mb-1">Confidentialité et sécurité</p>
                        <p>Contrôlez la visibilité de vos informations personnelles.</p>
                      </div>
                    </div>
                    
                    {[
                      { key: 'profil_public', label: 'Profil public', desc: 'Rendre votre profil visible publiquement' },
                      { key: 'afficher_telephone', label: 'Afficher le téléphone', desc: 'Afficher votre numéro de téléphone sur votre profil public' },
                      { key: 'afficher_courriel', label: 'Afficher l\'e-mail', desc: 'Afficher votre adresse e-mail sur votre profil public' },
                    ].map((privacy) => (
                      <div key={privacy.key} className="flex items-start gap-4 p-4 bg-background border border-darkGray rounded-lg">
                        <input
                          type="checkbox"
                          checked={formData.profil?.[privacy.key] ?? false}
                          onChange={(e) => handleChange(privacy.key, e.target.checked, true)}
                          className="mt-1 w-4 h-4 text-primary bg-card border-gray-400 rounded focus:ring-primary"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text">{privacy.label}</div>
                          <div className="text-xs text-gray-400 mt-1">{privacy.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-darkGray bg-background/50">
            <div className="text-sm text-gray-400">
              {changedFields.size > 0 && (
                <span>{changedFields.size} modification(s) en attente</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-text transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || changedFields.size === 0}
                className="px-6 py-2 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Champs en lecture seule - Info */}
          <div className="px-6 py-3 bg-darkGray/30 border-t border-darkGray">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span>
                Champs en lecture seule : Type d'utilisateur, Statut, Niveau KYC, Vérifications
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

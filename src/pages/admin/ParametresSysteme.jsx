import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Settings, Palette, Layout, Menu, Shield, Globe, Bell, Lock,
  User, CreditCard, Database, Mail, Smartphone, Save, ChevronRight,
  Check, X, AlertCircle, Info
} from 'lucide-react';
import GestionProfils from './GestionProfils';
import ConfigurationGenerale from '../../components/ConfigurationGenerale';

const ParametresSysteme = () => {
  const location = useLocation();
  
  // Détecter la section active depuis l'URL
  const getSectionFromPath = () => {
    const path = location.pathname;
    if (path.includes('/apparence')) return 'apparence';
    if (path.includes('/profils')) return 'profils';
    if (path.includes('/securite')) return 'securite';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/localisation') || path.includes('/regionalisation')) return 'localisation';
    if (path.includes('/informations')) return 'general';
    if (path.includes('/contact')) return 'general';
    if (path.includes('/database')) return 'general';
    if (path.includes('/paiements')) return 'general';
    if (path.includes('/modules')) return 'general';
    if (path.includes('/navigation')) return 'general';
    return 'general';
  };

  const [activeSection, setActiveSection] = useState(getSectionFromPath());
  
  // Mettre à jour la section quand l'URL change
  useEffect(() => {
    setActiveSection(getSectionFromPath());
  }, [location.pathname]);
  const [config, setConfig] = useState({
    platformName: 'uFaranga',
    platformSlogan: 'Simply Money',
    primaryColor: '#007BFF',
    secondaryColor: '#F58424',
    backgroundColor: '#00070F',
    cardBackground: '#181F27',
    textColor: '#F9F9F9',
  });

  const sections = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'apparence', label: 'Apparence', icon: Palette },
    { id: 'profils', label: 'Profils & Utilisateurs', icon: Shield },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'localisation', label: 'Localisation', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header avec navigation horizontale moderne */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="mb-6">
          <h1 className="text-4xl font-anton uppercase text-text mb-2">Paramètres</h1>
          <p className="text-gray-400">Configurez votre plateforme uFaranga</p>
        </div>

        {/* Navigation Pills moderne */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-card border border-darkGray text-gray-400 hover:text-text hover:border-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu avec animations */}
      <div className="max-w-7xl mx-auto">
        {/* Section: Général */}
        {activeSection === 'general' && (
          <div className="animate-fadeIn">
            <ConfigurationGenerale />
          </div>
        )}

        {/* Section: Apparence */}
        {activeSection === 'apparence' && (
          <div className="animate-fadeIn space-y-6">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Personnalisation du thème</h2>
                  <p className="text-sm text-gray-400">Créez une identité visuelle unique</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ColorCard
                  label="Primaire"
                  description="Couleur principale"
                  value={config.primaryColor}
                  onChange={(color) => setConfig({ ...config, primaryColor: color })}
                />
                <ColorCard
                  label="Secondaire"
                  description="Couleur d'accent"
                  value={config.secondaryColor}
                  onChange={(color) => setConfig({ ...config, secondaryColor: color })}
                />
                <ColorCard
                  label="Arrière-plan"
                  description="Fond de page"
                  value={config.backgroundColor}
                  onChange={(color) => setConfig({ ...config, backgroundColor: color })}
                />
                <ColorCard
                  label="Cartes"
                  description="Fond des cartes"
                  value={config.cardBackground}
                  onChange={(color) => setConfig({ ...config, cardBackground: color })}
                />
                <ColorCard
                  label="Texte"
                  description="Couleur du texte"
                  value={config.textColor}
                  onChange={(color) => setConfig({ ...config, textColor: color })}
                />
              </div>

              <div className="mt-8 flex gap-3">
                <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/30">
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
                <button className="px-6 py-3 bg-card border border-darkGray hover:border-primary/50 text-text rounded-xl transition-all">
                  Réinitialiser
                </button>
              </div>
            </div>

            {/* Aperçu en temps réel */}
            <div className="bg-card border border-darkGray rounded-2xl p-8">
              <h3 className="text-xl font-bold text-text mb-4">Aperçu en temps réel</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg mb-3"></div>
                  <p className="text-sm text-gray-400">Carte primaire</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 rounded-xl">
                  <div className="w-10 h-10 bg-secondary/20 rounded-lg mb-3"></div>
                  <p className="text-sm text-gray-400">Carte secondaire</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl">
                  <div className="w-10 h-10 bg-success/20 rounded-lg mb-3"></div>
                  <p className="text-sm text-gray-400">Carte succès</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Profils & Utilisateurs */}
        {activeSection === 'profils' && (
          <div className="animate-fadeIn">
            <GestionProfils />
          </div>
        )}

        {/* Section: Sécurité */}
        {activeSection === 'securite' && (
          <div className="animate-fadeIn space-y-6">
            {/* Authentification */}
            <div className="bg-gradient-to-br from-danger/5 to-danger/5 border border-danger/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-danger/20 rounded-xl">
                  <Lock className="w-6 h-6 text-danger" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Authentification</h2>
                  <p className="text-sm text-gray-400">Sécurisez l'accès à votre plateforme</p>
                </div>
              </div>

              <div className="space-y-4">
                <SettingRow
                  icon={Shield}
                  title="Authentification à deux facteurs"
                  description="Sécurité renforcée avec code OTP"
                  type="toggle"
                  defaultChecked={false}
                />
                <SettingRow
                  icon={User}
                  title="Sessions multiples"
                  description="Autoriser plusieurs connexions simultanées"
                  type="toggle"
                  defaultChecked={true}
                />
                <SettingRow
                  icon={AlertCircle}
                  title="Expiration de session"
                  description="Durée avant déconnexion automatique"
                  type="select"
                  options={['15 minutes', '30 minutes', '1 heure', '4 heures', '24 heures']}
                />
              </div>
            </div>

            {/* Politique de mot de passe */}
            <div className="bg-card border border-darkGray rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Politique de mot de passe</h2>
                  <p className="text-sm text-gray-400">Définissez les règles de sécurité</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Longueur minimale</label>
                    <input
                      type="number"
                      defaultValue="8"
                      min="6"
                      max="32"
                      className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <span className="text-sm text-text">Caractères spéciaux requis</span>
                    <ToggleSwitch defaultChecked={true} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Expiration du mot de passe</label>
                    <select className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary">
                      <option>Jamais</option>
                      <option>30 jours</option>
                      <option>60 jours</option>
                      <option>90 jours</option>
                      <option>180 jours</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <span className="text-sm text-text">Majuscules requises</span>
                    <ToggleSwitch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Notifications */}
        {activeSection === 'notifications' && (
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-br from-warning/5 to-warning/5 border border-warning/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-warning/20 rounded-xl">
                  <Bell className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Notifications</h2>
                  <p className="text-sm text-gray-400">Gérez les canaux de communication</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NotificationCard
                  icon={Mail}
                  title="Email"
                  description="Notifications par email"
                  color="primary"
                  defaultChecked={true}
                />
                <NotificationCard
                  icon={Smartphone}
                  title="SMS"
                  description="Alertes par SMS"
                  color="secondary"
                  defaultChecked={false}
                />
                <NotificationCard
                  icon={Bell}
                  title="Push"
                  description="Notifications push"
                  color="warning"
                  defaultChecked={true}
                />
              </div>

              <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text mb-1">Configuration avancée</p>
                    <p className="text-xs text-gray-400">Les notifications peuvent être personnalisées par type d'événement dans les paramètres avancés.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Localisation */}
        {activeSection === 'localisation' && (
          <div className="animate-fadeIn">
            <div className="bg-gradient-to-br from-success/5 to-success/5 border border-success/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-success/20 rounded-xl">
                  <Globe className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text">Localisation</h2>
                  <p className="text-sm text-gray-400">Paramètres régionaux et linguistiques</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Langue par défaut</label>
                    <select className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary">
                      <option>🇫🇷 Français</option>
                      <option>🇬🇧 English</option>
                      <option>🇧🇮 Kirundi</option>
                      <option>🇹🇿 Swahili</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Fuseau horaire</label>
                    <select className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary">
                      <option>Africa/Bujumbura (GMT+2)</option>
                      <option>Africa/Nairobi (GMT+3)</option>
                      <option>Africa/Kigali (GMT+2)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Format de date</label>
                    <select className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-3">Devise par défaut</label>
                    <select className="w-full px-4 py-3 bg-background border border-darkGray rounded-xl text-text focus:outline-none focus:border-primary">
                      <option>BIF - Franc Burundais</option>
                      <option>USD - Dollar Américain</option>
                      <option>EUR - Euro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant ColorCard moderne
const ColorCard = ({ label, description, value, onChange }) => {
  return (
    <div className="bg-card border border-darkGray rounded-xl p-5 hover:border-primary/50 transition-all group">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-lg border-2 border-darkGray group-hover:border-primary/50 transition-all"
          style={{ backgroundColor: value }}
        ></div>
        <div>
          <p className="text-sm font-semibold text-text">{label}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-lg cursor-pointer border border-darkGray"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 px-3 py-2 bg-background border border-darkGray rounded-lg text-text text-xs font-mono focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
};

// Composant SettingRow
const SettingRow = ({ icon: Icon, title, description, type, defaultChecked, options }) => {
  return (
    <div className="flex items-center justify-between p-5 bg-card rounded-xl border border-darkGray hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      {type === 'toggle' && <ToggleSwitch defaultChecked={defaultChecked} />}
      {type === 'select' && (
        <select className="px-4 py-2 bg-background border border-darkGray rounded-lg text-text text-sm focus:outline-none focus:border-primary">
          {options.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
};

// Composant ToggleSwitch
const ToggleSwitch = ({ defaultChecked }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-darkGray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  );
};

// Composant NotificationCard
const NotificationCard = ({ icon: Icon, title, description, color, defaultChecked }) => {
  return (
    <div className={`bg-gradient-to-br from-${color}/10 to-${color}/5 border border-${color}/20 rounded-xl p-6 hover:shadow-lg transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}/20 rounded-xl`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <ToggleSwitch defaultChecked={defaultChecked} />
      </div>
      <h3 className="text-lg font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default ParametresSysteme;

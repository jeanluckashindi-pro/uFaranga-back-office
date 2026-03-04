import { useState } from 'react';
import { Lock, Shield, User, AlertCircle } from 'lucide-react';

const Securite = () => {
  const [config, setConfig] = useState({
    twoFactorAuth: false,
    multipleSessions: true,
    sessionExpiration: '1h',
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireUppercase: true,
    passwordExpiration: 'never'
  });

  const SettingRow = ({ icon: Icon, title, description, type, value, onChange, options }) => {
    return (
      <div className="group bg-background border border-darkGray rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-text mb-1">{title}</p>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
          <div className="ml-4">
            {type === 'toggle' && (
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
                <div className="w-14 h-7 bg-darkGray peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            )}
            {type === 'select' && (
              <select 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-4 py-2.5 bg-card border border-darkGray rounded-xl text-text font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-w-[150px]"
              >
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {type === 'number' && (
              <input
                type="number"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                min="6"
                max="32"
                className="w-24 px-4 py-2.5 bg-card border border-darkGray rounded-xl text-text font-bold text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-anton uppercase text-text mb-2">Sécurité</h1>
        <p className="text-gray-400">Configurez les paramètres de sécurité de votre plateforme</p>
      </div>

      {/* Authentification */}
      <div className="bg-card border border-darkGray rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-darkGray">
          <div className="p-4 bg-gradient-to-br from-danger/20 to-danger/10 rounded-xl">
            <Lock className="w-7 h-7 text-danger" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Authentification</h2>
            <p className="text-sm text-gray-400 mt-1">Sécurisez l'accès à votre plateforme</p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            icon={Shield}
            title="Authentification à deux facteurs"
            description="Sécurité renforcée avec code OTP"
            type="toggle"
            value={config.twoFactorAuth}
            onChange={(val) => setConfig({ ...config, twoFactorAuth: val })}
          />
          <SettingRow
            icon={User}
            title="Sessions multiples"
            description="Autoriser plusieurs connexions simultanées"
            type="toggle"
            value={config.multipleSessions}
            onChange={(val) => setConfig({ ...config, multipleSessions: val })}
          />
          <SettingRow
            icon={AlertCircle}
            title="Expiration de session"
            description="Durée avant déconnexion automatique"
            type="select"
            value={config.sessionExpiration}
            onChange={(val) => setConfig({ ...config, sessionExpiration: val })}
            options={[
              { label: '15 minutes', value: '15m' },
              { label: '30 minutes', value: '30m' },
              { label: '1 heure', value: '1h' },
              { label: '4 heures', value: '4h' },
              { label: '24 heures', value: '24h' }
            ]}
          />
        </div>
      </div>

      {/* Politique de mot de passe */}
      <div className="bg-card border border-darkGray rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-darkGray">
          <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Politique de mot de passe</h2>
            <p className="text-sm text-gray-400 mt-1">Définissez les règles de sécurité</p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingRow
            icon={Lock}
            title="Longueur minimale"
            description="Nombre minimum de caractères requis"
            type="number"
            value={config.passwordMinLength}
            onChange={(val) => setConfig({ ...config, passwordMinLength: val })}
          />
          <SettingRow
            icon={Shield}
            title="Caractères spéciaux requis"
            description="Exiger au moins un caractère spécial (!@#$%...)"
            type="toggle"
            value={config.requireSpecialChars}
            onChange={(val) => setConfig({ ...config, requireSpecialChars: val })}
          />
          <SettingRow
            icon={Shield}
            title="Majuscules requises"
            description="Exiger au moins une lettre majuscule"
            type="toggle"
            value={config.requireUppercase}
            onChange={(val) => setConfig({ ...config, requireUppercase: val })}
          />
          <SettingRow
            icon={AlertCircle}
            title="Expiration du mot de passe"
            description="Forcer le changement de mot de passe après"
            type="select"
            value={config.passwordExpiration}
            onChange={(val) => setConfig({ ...config, passwordExpiration: val })}
            options={[
              { label: 'Jamais', value: 'never' },
              { label: '30 jours', value: '30d' },
              { label: '60 jours', value: '60d' },
              { label: '90 jours', value: '90d' },
              { label: '180 jours', value: '180d' }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Securite;

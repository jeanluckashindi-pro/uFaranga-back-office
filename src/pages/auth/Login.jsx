import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import { Input, PasswordInput, Button, Alert } from '../../components/common';
import Spinner from '../../components/common/Spinner';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '', // Changé de 'email' à 'username' pour accepter email ou téléphone
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, clearAuthError, isAuthenticated, loading: authLoading } = useAuth();

  // Simuler le chargement initial de la page
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  // Fonction de validation côté client
  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Saisissez votre adresse e-mail ou votre numéro de téléphone.';
    }

    // Vérification e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(username)) {
      return null; // E-mail valide
    }

    // Vérification téléphone (9 à 15 chiffres, + optionnel, espaces et tirets ignorés)
    const phoneRegex = /^\+?[\d\s-]{9,15}$/;
    const cleanPhone = username.replace(/[\s-]/g, ''); // Supprimer espaces et tirets
    const phoneDigitsOnly = cleanPhone.replace(/^\+/, ''); // Supprimer le + du début
    
    if (phoneRegex.test(username) && phoneDigitsOnly.length >= 9 && phoneDigitsOnly.length <= 15) {
      return null; // Téléphone valide
    }

    return 'Saisissez une adresse e-mail valide ou un numéro de téléphone valide (9 à 15 chiffres).';
  };

  // Récupérer la route de redirection ou utiliser le dashboard par défaut
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (error) {
      setError('');
      clearAuthError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    clearAuthError();

    // Validation côté client
    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      setError(usernameError);
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError('Saisissez votre mot de passe.');
      setLoading(false);
      return;
    }

    try {
      // Délai minimum pour afficher le spinner (500ms)
      const [loginResult] = await Promise.all([
        login(formData.username, formData.password, rememberMe),
        new Promise(resolve => setTimeout(resolve, 500))
      ]);

      // Rediriger vers la page demandée ou le dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Erreur de connexion:', err);
      // Afficher un message d'erreur clair et compréhensible
      const errorMessage = err.message || 'Identifiants incorrects. Vérifiez votre adresse e-mail/téléphone et votre mot de passe.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Afficher le spinner pendant le chargement initial
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Spinner size="medium" color="white" />
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-cookie text-secondary mb-1" style={{ fontFamily: 'Kaushan Script, cursive' }}>
            uFaranga
          </h1>
          <div className="flex items-center justify-center gap-2 font-allan">
            <span className="text-lg text-text">Simply</span> 
            <span className="text-lg text-primary">Money</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Header avec logo - fixe en haut sur mobile, centré sur desktop */}
      <div className="md:pt-8 md:pb-4 px-4 md:text-center bg-background md:bg-transparent border-b md:border-b-0 border-darkGray md:border-none py-3 md:py-0 relative z-10">
        <h1 className="text-xl md:text-4xl font-cookie text-secondary mb-0.5 md:mb-1" style={{ fontFamily: 'Kaushan Script, cursive' }}>
          uFaranga
        </h1>
        <div className="flex items-center md:justify-center gap-1.5 md:gap-2 font-allan">
          <span className="text-sm md:text-2xl text-text">Simply</span> 
          <span className="text-sm md:text-2xl text-primary">Money</span>
        </div>
      </div>

      {/* Formulaire centré */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12 relative z-10">
        <div className="max-w-md w-full space-y-6">
          {/* Formulaire de connexion */}
          <div className="bg-transparent md:bg-card border-0 md:border md:border-darkGray rounded-lg p-4 md:p-8 md:shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                Adresse e-mail ou numéro de téléphone
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Email ou numéro de téléphone"
                className="w-full bg-transparent border-gray-400 text-text placeholder-gray-400 focus:border-primary focus:ring-primary"
                size="large"
                fullWidth
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Mot de passe
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full !bg-transparent border-gray-400 text-text placeholder-gray-400 focus:border-primary focus:ring-primary"
                size="large"
                fullWidth
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Checkbox
                  inputId="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.checked)}
                  className="mr-2"
                />
                <label htmlFor="remember-me" className="block text-sm cursor-pointer">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-secondary transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50"
                disabled={loading}
                loading={loading}
                fullWidth
              >
                Se connecter
              </Button>
            </div>
          </form>
          
          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-darkGray" />
            </div>
            <div className="relative flex justify-center text-xs md:text-sm">
              <span className="px-2 bg-background md:bg-card text-gray-400">Ou</span>
            </div>
          </div>
          
          {/* Actions supplémentaires */}
          <div className="text-center mt-4 md:mt-6">
            <p className="text-xs md:text-sm text-gray-400">
              Besoin d'aide ? {' '}
              <a href="#" className="text-secondary hover:text-primary transition-colors">
                Contactez l'administrateur
              </a>
            </p>
          </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500 leading-relaxed mb-5">
               Parce que nous croyons en une finance électronique mobile simple, sécurisée et accessible à tous, It's time for Africa!
            </p>
            <p className="text-xs text-gray-500 leading-relaxed"><span className="text-white font-bold text-3xl" style={{ fontFamily: 'Kaushan Script, cursive' }}>Decima Company</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
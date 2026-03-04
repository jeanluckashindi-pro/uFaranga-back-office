import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input, PasswordInput, Button, Alert } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const tokenFromUrl = searchParams.get('token');

  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer les messages quand l'utilisateur tape
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      return 'Veuillez entrer le code de vérification.';
    }

    if (formData.code.length < 4 || formData.code.length > 8) {
      return 'Le code doit contenir entre 4 et 8 caractères.';
    }

    if (!formData.newPassword.trim()) {
      return 'Veuillez entrer un nouveau mot de passe.';
    }

    if (formData.newPassword.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return 'Les mots de passe ne correspondent pas.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation côté client
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Utiliser le token de l'URL ou le code saisi
      const token = tokenFromUrl || formData.code;
      
      // Appel à l'API de réinitialisation de mot de passe
      await apiService.resetPassword(token, formData.newPassword);
      
      setSuccess(true);
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Code invalide ou expiré. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Afficher un spinner pendant la vérification de la session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-cookie text-secondary mb-2" style={{ fontFamily: 'Kaushan Script, cursive' }}>
              uFaranga
            </h1>
            <div className="flex items-center justify-center gap-2 font-allan">
              <span className="text-sm text-text">Simply</span> 
              <span className="text-sm text-primary">Money</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-heading font-bold text-text mb-2">
            Réinitialiser le mot de passe
          </h2>
          <p className="text-sm text-gray-400">
            Entrez le code reçu et votre nouveau mot de passe
          </p>
        </div>
        
        {/* Formulaire de réinitialisation */}
        <div className="bg-card border border-darkGray rounded-lg p-8 shadow-lg">
          {success ? (
            <div className="space-y-6">
              <Alert variant="success">
                Votre mot de passe a été réinitialisé avec succès ! Vous allez être redirigé vers la page de connexion...
              </Alert>
              
              <div className="text-center">
                <Link 
                  to="/login" 
                  className="text-primary hover:text-secondary transition-colors font-medium"
                >
                  Aller à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <Alert variant="danger">
                  {error}
                </Alert>
              )}
              
              {!tokenFromUrl && (
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-text mb-2">
                    Code de vérification
                  </label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Entrez le code reçu"
                    className="w-full !bg-transparent border-gray-400 text-text placeholder-gray-400 focus:border-primary focus:ring-primary text-center text-2xl tracking-widest font-bold"
                    size="large"
                    fullWidth
                    maxLength={8}
                  />
                  <p className="mt-2 text-xs text-gray-400 text-center">
                    Vérifiez votre e-mail ou SMS
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-text mb-2">
                  Nouveau mot de passe
                </label>
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full !bg-transparent border-gray-400 text-text placeholder-gray-400 focus:border-primary focus:ring-primary"
                  size="large"
                  fullWidth
                />
                <p className="mt-2 text-xs text-gray-400">
                  Minimum 8 caractères
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
                  Confirmer le mot de passe
                </label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full !bg-transparent border-gray-400 text-text placeholder-gray-400 focus:border-primary focus:ring-primary"
                  size="large"
                  fullWidth
                />
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
                  Réinitialiser le mot de passe
                </Button>
              </div>

              <div className="text-center space-y-2">
                <Link 
                  to="/forgot-password" 
                  className="block text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Renvoyer le code
                </Link>
                <Link 
                  to="/login" 
                  className="block text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 uFaranga Platform. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

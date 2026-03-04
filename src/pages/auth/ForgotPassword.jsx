import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Button, Alert, PhoneInput } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Mail, Phone, ArrowLeft, Send, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [method, setMethod] = useState('phone'); // 'phone' ou 'email'
  const [formData, setFormData] = useState({
    phone: '',
    email: ''
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

  // Fonction de validation
  const validateForm = () => {
    if (method === 'email') {
      if (!formData.email.trim()) {
        return 'Veuillez entrer votre adresse email.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return 'Adresse email invalide.';
      }
    } else {
      if (!formData.phone.trim()) {
        return 'Veuillez entrer votre numéro de téléphone.';
      }
      // Validation pour numéro burundais: +257 suivi de 8 chiffres
      const cleanPhone = formData.phone.replace(/\s/g, '');
      const burundianRegex = /^\+257\d{8}$/;
      const localRegex = /^\d{8}$/; // Format local sans préfixe
      
      if (!burundianRegex.test(cleanPhone) && !localRegex.test(cleanPhone)) {
        return 'Numéro de téléphone burundais invalide. Format: +257 79 12 34 56';
      }
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Appel à l'API avec la méthode choisie
      const username = method === 'email' ? formData.email : formData.phone;
      await apiService.forgotPassword(username);
      
      setSuccess(true);
      
      // Rediriger vers la page de réinitialisation après 3 secondes
      setTimeout(() => {
        navigate('/reset-password', { state: { method, contact: username } });
      }, 3000);
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
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
            Mot de passe oublié ?
          </h2>
          <p className="text-sm text-gray-400">
            Choisissez comment recevoir votre code de confirmation
          </p>
        </div>
        
        {/* Formulaire de réinitialisation */}
        <div className="bg-card border border-darkGray rounded-lg shadow-lg overflow-hidden">
          {success ? (
            <div className="p-8 space-y-6">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text mb-2 font-heading">Code envoyé !</h3>
                  <p className="text-sm text-gray-400">
                    Un code de confirmation a été envoyé {method === 'email' ? 'à votre email' : 'par SMS'}
                  </p>
                  <p className="text-sm text-primary font-mono mt-2">
                    {method === 'email' ? formData.email : formData.phone}
                  </p>
                </div>
              </div>
              
              <div className="text-center space-y-3 pt-4 border-t border-darkGray">
                <Link 
                  to="/reset-password" 
                  className="block w-full px-4 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Entrer le code maintenant
                </Link>
                <Link 
                  to="/login" 
                  className="block text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Sélection de la méthode */}
              <div className="grid grid-cols-2 bg-background">
                <button
                  type="button"
                  onClick={() => setMethod('phone')}
                  className={`flex items-center justify-center gap-2 py-4 px-6 transition-all font-sans font-medium ${
                    method === 'phone'
                      ? 'bg-card text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-text hover:bg-darkGray'
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  <span>Téléphone</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  className={`flex items-center justify-center gap-2 py-4 px-6 transition-all font-sans font-medium ${
                    method === 'email'
                      ? 'bg-card text-primary border-b-2 border-primary'
                      : 'text-gray-400 hover:text-text hover:bg-darkGray'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email</span>
                </button>
              </div>

              <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="danger">
                    {error}
                  </Alert>
                )}
                
                {/* Formulaire Téléphone */}
                {method === 'phone' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <p className="text-sm text-blue-400">
                        Vous recevrez un code de confirmation par SMS
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-text mb-2 font-sans">
                        Numéro de téléphone
                      </label>
                      <PhoneInput
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+257 79 12 34 56"
                      />
                      <p className="text-xs text-gray-500 mt-2 font-sans">
                        Format burundais: +257 79 12 34 56 (8 chiffres après +257)
                      </p>
                    </div>
                  </div>
                )}

                {/* Formulaire Email */}
                {method === 'email' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <p className="text-sm text-blue-400">
                        Vous recevrez un code de confirmation par email
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text mb-2 font-sans">
                        Adresse email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="votre.email@ufaranga.com"
                          className="w-full pl-11 pr-4 py-3 bg-background border border-darkGray rounded-lg text-text placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le code</span>
                      </>
                    )}
                  </button>

                  <Link 
                    to="/login" 
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-gray-400 hover:text-primary hover:bg-darkGray rounded-lg transition-colors font-sans"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour à la connexion</span>
                  </Link>
                </div>
              </form>
            </>
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

export default ForgotPassword;

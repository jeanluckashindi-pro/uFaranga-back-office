// Messages d'erreur traduits et compréhensibles pour l'utilisateur
export const ERROR_MESSAGES = {
  // Erreurs d'authentification
  'no_active_account': 'Identifiants incorrects. Vérifiez votre adresse e-mail/téléphone et votre mot de passe.',
  'account_disabled': 'Votre compte a été désactivé. Contactez l\'administrateur pour plus d\'informations.',
  'account_not_verified': 'Votre compte n\'est pas encore vérifié. Vérifiez votre e-mail ou SMS.',
  'invalid_credentials': 'Identifiants incorrects. Vérifiez votre adresse e-mail/téléphone et votre mot de passe.',
  'user_not_found': 'Aucun compte trouvé avec ces identifiants.',
  'authentication_failed': 'Échec de l\'authentification. Veuillez réessayer.',
  
  // Erreurs de token/code
  'invalid_token': 'Code de vérification invalide ou expiré. Demandez-en un nouveau.',
  'token_expired': 'Le code de vérification a expiré. Demandez-en un nouveau.',
  'token_not_found': 'Code de vérification introuvable. Vérifiez le code saisi.',
  'invalid_refresh_token': 'Session expirée. Veuillez vous reconnecter.',
  
  // Erreurs de mot de passe
  'password_too_weak': 'Le mot de passe est trop faible. Utilisez au moins 8 caractères avec des lettres et des chiffres.',
  'passwords_do_not_match': 'Les mots de passe ne correspondent pas. Vérifiez votre saisie.',
  'password_too_short': 'Le mot de passe doit contenir au moins 8 caractères.',
  'password_too_common': 'Ce mot de passe est trop courant. Choisissez un mot de passe plus sécurisé.',
  'incorrect_password': 'Mot de passe incorrect. Vérifiez votre saisie.',
  
  // Erreurs de validation
  'invalid_email': 'Adresse e-mail invalide. Vérifiez le format.',
  'invalid_phone': 'Numéro de téléphone invalide. Utilisez le format international (+257...).',
  'field_required': 'Ce champ est obligatoire.',
  'invalid_format': 'Format invalide. Vérifiez votre saisie.',
  
  // Erreurs réseau
  'network_error': 'Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré et que votre connexion internet fonctionne.',
  'server_error': 'Erreur du serveur. Veuillez réessayer plus tard ou contactez l\'administrateur.',
  'timeout': 'La requête a expiré. Vérifiez votre connexion internet et réessayez.',
  'connection_refused': 'Connexion refusée. Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré sur http://127.0.0.1:8000',
  
  // Erreurs génériques
  'unknown_error': 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  'permission_denied': 'Vous n\'avez pas les permissions nécessaires.',
  'resource_not_found': 'Ressource introuvable.',
  
  // Messages par code HTTP
  400: 'Requête invalide. Vérifiez les informations saisies.',
  401: 'Identifiants incorrects. Vérifiez votre adresse e-mail/téléphone et votre mot de passe.',
  403: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
  404: 'Ressource introuvable.',
  500: 'Erreur du serveur. Veuillez réessayer plus tard.',
  502: 'Service temporairement indisponible. Veuillez réessayer.',
  503: 'Service en maintenance. Veuillez réessayer plus tard.',
};

// Fonction pour obtenir un message d'erreur traduit
export const getErrorMessage = (errorCode, defaultMessage = null) => {
  return ERROR_MESSAGES[errorCode] || defaultMessage || ERROR_MESSAGES['unknown_error'];
};

export default ERROR_MESSAGES;

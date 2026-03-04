import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({
  children,
  variant = 'info',
  size = 'medium',
  dismissible = false,
  onDismiss,
  icon = true,
  className = ''
}) => {
  // Design system de la plateforme - fond sombre avec bordures
  const variantClasses = {
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    danger: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-primary/10 border-primary/30 text-primary'
  };

  const sizeClasses = {
    small: 'p-3 text-sm',
    medium: 'p-4 text-sm',
    large: 'p-5 text-base'
  };

  const iconComponents = {
    success: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info
  };

  const IconComponent = iconComponents[variant];

  const classes = `
    border rounded-lg flex items-start backdrop-blur-sm
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <div className={classes} role="alert">
      {icon && IconComponent && (
        <div className="flex-shrink-0 mr-3">
          <IconComponent className="w-5 h-5" />
        </div>
      )}
      
      <div className="flex-1">
        {children}
      </div>
      
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-3 text-gray-400 hover:text-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
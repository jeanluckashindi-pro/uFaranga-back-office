import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  variant = 'default',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-card rounded-lg border transition-all duration-200';
  
  const variantClasses = {
    default: 'border-darkGray',
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-green-500/30 bg-green-500/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    danger: 'border-red-500/30 bg-red-500/5'
  };

  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
    xlarge: 'p-8'
  };

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
    xlarge: 'shadow-xl'
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${shadowClasses[shadow]}
    ${hoverClasses}
    ${className}
  `.trim();

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-text mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="card-content">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-darkGray">
          {footer}
        </div>
      )}
    </div>
  );
};

// Composant CardHeader
export const CardHeader = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 border-b border-darkGray ${className}`}>
      {children}
    </div>
  );
};

// Composant CardBody
export const CardBody = ({ children, className = '' }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

// Composant CardFooter
export const CardFooter = ({ children, className = '' }) => {
  return (
    <div className={`px-4 py-3 border-t border-darkGray ${className}`}>
      {children}
    </div>
  );
};

// Composant StatsCard
export const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  className = ''
}) => {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <Card className={`${className}`} padding="medium">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-text">{value}</p>
          {change && (
            <p className={`text-sm ${changeColors[changeType]} mt-1`}>
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
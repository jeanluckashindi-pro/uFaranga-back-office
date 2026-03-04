import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-transparent',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary bg-transparent',
    link: 'text-primary hover:text-secondary underline-offset-4 hover:underline focus:ring-primary bg-transparent',
    facebook: 'bg-facebook hover:bg-facebook-hover active:bg-facebook-active text-white focus:ring-facebook shadow-facebook border-0 font-semibold'
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm min-h-[32px]',
    medium: 'px-4 py-2 text-sm min-h-[36px]',
    large: 'px-6 py-3 text-base min-h-[40px]',
    xlarge: 'px-8 py-4 text-lg min-h-[44px]'
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-7 h-7'
  };

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const renderIcon = () => {
    if (loading) {
      return <Spinner size="small" color={variant === 'outline' || variant === 'ghost' || variant === 'link' ? 'primary' : 'white'} />;
    }
    
    if (icon) {
      return React.cloneElement(icon, {
        className: `${iconSizes[size]} ${iconPosition === 'right' ? 'ml-2' : 'mr-2'}`
      });
    }
    
    return null;
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Spinner size="small" color={variant === 'outline' || variant === 'ghost' || variant === 'link' ? 'primary' : 'white'} />
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
};

// Composant FacebookButton - Style exact de Facebook
export const FacebookButton = ({
  children,
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[32px]',
    medium: 'px-6 py-2.5 text-sm min-h-[36px]',
    large: 'px-8 py-3 text-base min-h-[40px]'
  };

  const classes = `
    inline-flex items-center justify-center
    bg-facebook hover:bg-facebook-hover active:bg-facebook-active
    text-white font-semibold
    rounded-md
    border-0 outline-none
    transition-all duration-150 ease-in-out
    focus:ring-2 focus:ring-facebook focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
    shadow-facebook hover:shadow-facebook-hover
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="mr-2">
          <Spinner size="small" color="white" />
        </div>
      )}
      {children}
    </button>
  );
};

// Composant ButtonGroup
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          return React.cloneElement(child, {
            className: `
              ${child.props.className || ''}
              ${!isFirst ? 'ml-0 rounded-l-none' : ''}
              ${!isLast ? 'rounded-r-none' : ''}
              ${!isFirst && !isLast ? 'rounded-none' : ''}
            `.trim()
          });
        }
        return child;
      })}
    </div>
  );
};

// Composant IconButton
export const IconButton = ({ 
  icon, 
  size = 'medium', 
  variant = 'ghost',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3'
  };

  return (
    <Button
      variant={variant}
      className={`${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default Button;
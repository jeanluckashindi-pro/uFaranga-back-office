import React from 'react';
import './Spinner.css';

const Spinner = ({ 
  size = 'medium', 
  color = 'primary', 
  text = '', 
  overlay = false,
  className = '' 
}) => {
  const sizeMap = {
    small: 14,
    medium: 20,
    large: 28,
    xlarge: 36
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  const spinnerSize = sizeMap[size];
  const spokeCount = 12;

  const spinnerElement = (
    <div className={`spinner-container ${text ? 'spinner-with-text' : ''} ${overlay ? 'spinner-overlay' : ''} ${className}`}>
      <div 
        className={`spinner-radial ${colorClasses[color]}`}
        style={{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }}
      >
        {[...Array(spokeCount)].map((_, index) => (
          <div
            key={index}
            className="spinner-spoke"
            style={{
              transform: `rotate(${index * (360 / spokeCount)}deg)`,
              animationDelay: `${-((spokeCount - index) / spokeCount)}s`
            }}
          />
        ))}
      </div>
      {text && (
        <p className={`spinner-text text-sm ${color === 'white' ? 'text-white' : 'text-gray-600'}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

// Composant RadialSpinner - Style moderne avec barres radiales
export const RadialSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '' 
}) => {
  const sizeMap = {
    small: 14,
    medium: 20,
    large: 28,
    xlarge: 36
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    white: 'text-white'
  };

  const spinnerSize = sizeMap[size];
  const spokeCount = 12;

  return (
    <div 
      className={`spinner-radial ${colorClasses[color]} ${className}`}
      style={{ width: `${spinnerSize}px`, height: `${spinnerSize}px` }}
    >
      {[...Array(spokeCount)].map((_, index) => (
        <div
          key={index}
          className="spinner-spoke"
          style={{
            transform: `rotate(${index * (360 / spokeCount)}deg)`,
            animationDelay: `${-((spokeCount - index) / spokeCount)}s`
          }}
        />
      ))}
    </div>
  );
};

// Composant Spinner avec points
export const DotSpinner = ({ color = 'primary', className = '' }) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  return (
    <div className={`dot-spinner ${className}`}>
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
    </div>
  );
};

// Composant Spinner en barres
export const BarSpinner = ({ color = 'primary', className = '' }) => {
  const colorClasses = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  return (
    <div className={`bar-spinner ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div 
          key={i} 
          className={`bar ${colorClasses[color]}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        ></div>
      ))}
    </div>
  );
};

export default Spinner;

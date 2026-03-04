import { useState } from 'react';
import { Phone } from 'lucide-react';

const PhoneInput = ({ value, onChange, error, ...props }) => {
  const [focused, setFocused] = useState(false);

  // Formater le numéro de téléphone burundais
  const formatPhoneNumber = (input) => {
    // Si vide, retourner vide
    if (!input) return '';
    
    // Retirer tous les caractères non numériques sauf le +
    let cleaned = input.replace(/[^\d+]/g, '');
    
    // Si vide après nettoyage, retourner vide
    if (!cleaned) return '';
    
    // Gérer le préfixe +257 pour le Burundi
    let prefix = '+257 ';
    let numbers = '';
    
    if (cleaned.startsWith('+257')) {
      numbers = cleaned.substring(4);
    } else if (cleaned.startsWith('257')) {
      numbers = cleaned.substring(3);
    } else if (cleaned.startsWith('+')) {
      // Autre préfixe international - garder tel quel
      const match = cleaned.match(/^(\+\d{1,3})\s?(.*)$/);
      if (match) {
        prefix = match[1] + ' ';
        numbers = match[2].replace(/\D/g, '');
      }
    } else {
      // Pas de préfixe, ajouter +257 automatiquement
      numbers = cleaned;
    }
    
    // Retirer tous les non-chiffres
    numbers = numbers.replace(/\D/g, '');
    
    // Limiter à 8 chiffres pour le Burundi
    numbers = numbers.substring(0, 8);
    
    // Si pas de chiffres, retourner vide (pas le préfixe seul)
    if (!numbers) return '';
    
    // Formater en groupes de 2 chiffres (79 12 34 56)
    let formatted = '';
    for (let i = 0; i < numbers.length; i += 2) {
      if (i > 0) formatted += ' ';
      formatted += numbers.substring(i, Math.min(i + 2, numbers.length));
    }
    
    return prefix + formatted;
  };

  // Obtenir la valeur brute (sans espaces)
  const getRawValue = (formatted) => {
    return formatted.replace(/\s/g, '');
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const raw = getRawValue(input);
    
    // Appeler onChange avec la valeur brute
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: e.target.name,
          value: raw
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    // Permettre: backspace, delete, tab, escape, enter, arrows
    const allowedKeys = [8, 9, 27, 13, 46, 37, 38, 39, 40];
    
    if (allowedKeys.includes(e.keyCode) ||
      // Permettre: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode))) {
      return;
    }
    
    // Permettre + seulement au début
    if (e.key === '+' && e.target.selectionStart === 0) {
      return;
    }
    
    // Permettre uniquement les chiffres
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Formater la valeur affichée
  const displayValue = formatPhoneNumber(value || '');
  
  // Compter les chiffres (sans le préfixe +257)
  const digitCount = (value || '').replace(/[^\d]/g, '').replace(/^257/, '').length;
  const maxDigits = 8;
  const isComplete = digitCount === maxDigits;

  return (
    <div className="relative">
      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full pl-11 pr-16 py-3 bg-background border rounded-lg text-text placeholder-gray-500 focus:outline-none transition-all font-sans ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20'
            : isComplete
            ? 'border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20'
            : focused
            ? 'border-primary focus:ring-2 focus:ring-primary/20'
            : 'border-darkGray hover:border-gray-500'
        }`}
        {...props}
      />
      {/* Compteur de caractères */}
      {focused && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className={`text-xs font-mono ${
            isComplete ? 'text-green-400' : digitCount > 0 ? 'text-primary' : 'text-gray-500'
          }`}>
            {digitCount}/{maxDigits}
          </span>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-400 mt-1 font-sans">{error}</p>
      )}
    </div>
  );
};

export default PhoneInput;

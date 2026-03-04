/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],      // Police par défaut pour le texte
        'body': ['Open Sans', 'sans-serif'],      // Police pour le corps de texte
        'heading': ['Josefin Sans', 'sans-serif'], // Police pour les titres
        'anton': ['Anton', 'sans-serif'],
        'antonio': ['Antonio', 'sans-serif'],
        'bangers': ['Bangers', 'cursive'],
        'cookie': ['Cookie', 'cursive'],
        'allan': ['Allan', 'cursive'],
        'luckiest': ['Luckiest Guy', 'cursive'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
      },
      colors: {
        primary: '#007BFF',        // Bleu
        secondary: '#F58424',      // Orange
        text: '#F9F9F9',           // Blanc cassé
        lightGray: '#F8F9FA',      // Gris clair
        background: '#00070F',     // Noir bleuté
        card: '#181F27',           // Gris foncé
        darkBlue: '#000C18',       // Bleu très foncé
        darkGray: '#343A40',       // Gris foncé
        danger: '#8B1538',         // Rouge
      },
    },
  },
  plugins: [],
}

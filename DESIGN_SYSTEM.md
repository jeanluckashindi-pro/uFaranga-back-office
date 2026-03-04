# 🎨 Design System - uFaranga Back Office

Ce document définit la palette de couleurs et les polices utilisées dans le projet.

## 🎨 Palette de Couleurs

### Couleurs Principales

| Nom | Hex | Usage | Classe Tailwind |
|-----|-----|-------|-----------------|
| **Primary** | `#007BFF` | Bleu principal, boutons, liens | `bg-primary`, `text-primary`, `border-primary` |
| **Secondary** | `#F58424` | Orange secondaire, accents | `bg-secondary`, `text-secondary`, `border-secondary` |
| **Text** | `#F9F9F9` | Blanc cassé, texte principal | `text-text` |
| **Background** | `#00070F` | Noir bleuté, fond principal | `bg-background` |

### Couleurs Secondaires

| Nom | Hex | Usage | Classe Tailwind |
|-----|-----|-------|-----------------|
| **Card** | `#181F27` | Gris foncé pour les cartes | `bg-card` |
| **Dark Blue** | `#000C18` | Bleu très foncé | `bg-darkBlue` |
| **Dark Gray** | `#343A40` | Gris foncé | `bg-darkGray` |
| **Light Gray** | `#F8F9FA` | Gris clair | `bg-lightGray` |
| **Danger** | `#8B1538` | Rouge pour erreurs/alertes | `bg-danger` |

### Variables CSS

```css
:root {
  --primary: #007BFF;
  --secondary: #F58424;
  --text: #F9F9F9;
  --light-gray: #F8F9FA;
  --background: #00070F;
  --card: #181F27;
  --dark-blue: #000C18;
  --dark-gray: #343A40;
  --red-color: #8B1538;
}
```

## 🔤 Polices (Font Family)

### Polices Principales

| Police | Usage | Classe Tailwind |
|--------|-------|-----------------|
| **Open Sans** | Texte par défaut, corps de texte | `font-sans`, `font-body` |
| **Josefin Sans** | Titres H1-H6 | `font-heading` |

### Polices Supplémentaires

| Police | Style | Classe Tailwind |
|--------|-------|-----------------|
| **Anton** | Sans-serif | `font-anton` |
| **Antonio** | Sans-serif | `font-antonio` |
| **Bangers** | Cursive | `font-bangers` |
| **Cookie** | Cursive | `font-cookie` |
| **Allan** | Cursive | `font-allan` |
| **Luckiest Guy** | Cursive | `font-luckiest` |
| **Ubuntu** | Sans-serif | `font-ubuntu` |

## 📝 Exemples d'Utilisation

### Couleurs

```jsx
// Bouton principal
<button className="bg-primary text-text hover:bg-opacity-90">
  Cliquez ici
</button>

// Carte
<div className="bg-card border border-darkGray rounded-lg p-4">
  Contenu de la carte
</div>

// Alerte danger
<div className="bg-danger text-text p-3 rounded">
  Message d'erreur
</div>
```

### Polices

```jsx
// Titre avec Josefin Sans
<h1 className="font-heading text-4xl">
  Titre Principal
</h1>

// Texte avec Open Sans (par défaut)
<p className="font-body text-base">
  Texte du paragraphe
</p>

// Texte avec police spéciale
<span className="font-bangers text-2xl">
  Texte stylisé
</span>
```

## 🎯 Configuration

Les couleurs et polices sont configurées dans :
- `tailwind.config.js` - Configuration Tailwind
- `src/index.css` - Variables CSS et imports de polices
- `index.html` - Import des Google Fonts

## 📦 Import des Polices

Toutes les polices sont importées via Google Fonts dans `index.html` et `src/index.css` pour garantir leur disponibilité.

---

**Note** : Ce design system doit être respecté dans tout le projet pour maintenir une cohérence visuelle.

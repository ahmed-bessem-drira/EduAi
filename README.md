# 🧠 EduAI - Master Agent Platform

**Transformez vos cours en intelligence avec l'IA**

EduAI est une plateforme web complète d'analyse de cours alimentée par l'IA qui permet aux étudiants et enseignants de télécharger du contenu pédagogique (texte ou PDF) et de recevoir instantanément :

- 📖 **Résumé structuré** (introduction, points clés, définitions, conclusion)
- 📝 **20 QCM** avec 4 options + corrigé intégré
- 🔍 **10 questions ouvertes** avec difficulté progressive (facile → moyen → difficile)
- 💬 **Interface de chat** pour interagir avec les résultats

---

## 🎨 Design Vision - "Dark Academic Intelligence"

Une esthétique éditoriale sombre et raffinée - think outil de recherche premium meets bibliothèque universitaire futuriste.

### Palette de Couleurs
```css
--bg-primary: #0a0b0f;
--bg-secondary: #111318;
--bg-card: #16181f;
--accent-primary: #6c63ff;     /* Indigo électrique */
--accent-secondary: #00d4aa;   /* Vert turquoise */
--accent-warm: #f59e0b;        /* Ambre pour les badges de difficulté */
```

---

## 🗂️ Structure du Projet

```
EduAi/
├── frontend/                 # Application React + Vite
│   ├── src/
│   │   ├── components/       # Composants UI
│   │   ├── services/         # Services API
│   │   ├── hooks/           # Hooks personnalisés
│   │   ├── utils/           # Utilitaires
│   │   └── styles/          # Styles globaux
│   ├── public/
│   └── package.json
├── backend/                  # API NestJS
│   ├── src/
│   │   ├── ai/             # Service IA Groq
│   │   ├── upload/         # Upload PDF
│   │   └── common/         # Filtres & intercepteurs
│   └── package.json
└── README.md
```

---

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation Frontend
```bash
cd frontend
npm install
npm run dev
```

### Installation Backend
```bash
cd backend
npm install
npm run start:dev
```

### Variables d'Environnement

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

#### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=10485760
```

---

## 🔌 API Endpoints

### POST /api/upload/pdf
**Input**: `multipart/form-data` avec champ `file` (PDF)
**Process**: Multer sauvegarde → pdf-parse extrait → retourne texte brut
**Output**: `{ "text": "contenu du cours..." }`

### POST /api/ai/generate
**Input**: `{ "text": "contenu...", "language": "fr" | "en" | "ar" }`
**Process**: Prompt structuré → Appel Groq API → Parse + validation JSON → retour
**Output**: JSON structuré avec résumé, QCM, questions ouvertes

### GET /api/health
**Output**: `{ "status": "ok", "timestamp": "ISO date" }`

---

## 🤖 Intégration IA - Groq

Le service utilise le modèle `llama-3.3-70b-versatile` avec :
- **Température**: 0.3 (sortie cohérente)
- **Max tokens**: 8000
- **Top-p**: 0.9

Le système de prompt engineering garantit une sortie JSON strictement validée.

---

## 📱 Fonctionnalités

### ✨ Interface Utilisateur
- **Header sticky** avec glassmorphism
- **Hero animé** avec gradient mesh
- **InputZone** avec drag-and-drop PDF
- **OutputResume** avec accordéons et animations
- **OutputQuiz** avec tabs et progression
- **ChatInterface** flottant
- **ContactForm** avec validation EmailJS
- **Footer** responsive

### 🎯 Composants UI
- **Loader** (spinner, skeleton, pulse)
- **Badge** (difficulté, statut)
- **Toast** (notifications)
- **ProgressBar** (upload/génération)

### 🌐 Accessibilité
- Navigation au clavier complète
- Labels ARIA sur les boutons
- Contraste ≥ 4.5:1
- Styles focus-visible

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **React Router** pour navigation
- **Axios** pour HTTP
- **EmailJS** pour contact
- **Lucide React** pour icônes
- **PDF.js** pour parsing client

### Backend
- **NestJS** (TypeScript)
- **Multer** pour upload
- **pdf-parse** pour extraction PDF
- **Groq SDK** pour IA
- **class-validator** pour validation

---

## 📦 Déploiement

### Frontend (Vercel)
```bash
npm run build
# Déployer sur Vercel avec variables d'environnement
```

### Backend (Render)
```bash
npm run build
npm run start:prod
# Déployer sur Render avec config Docker/Node
```

---

## 🎨 Personnalisation

### Thème
Modifier les variables CSS dans `src/styles/global.css` pour personnaliser :
- Couleurs
- Typographie
- Animations
- Effets visuels

### Langues
L'application supporte :
- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **Anglais**
- 🇸🇦 **Arabe**

Ajouter de nouvelles langues en étendant les composants avec des clés de traduction.

---

## 🔧 Développement

### Hooks Personnalisés
- `useUploadPDF()` - Upload et extraction PDF
- `useGenerate()` - Génération IA avec état

### Services API
- `uploadPDF()` - Upload multipart
- `generateContent()` - Appel IA Groq
- `healthCheck()` - Vérification statut

### Utilitaires
- `parseResponse()` - Validation JSON
- `downloadPDF()` - Export résultats
- `sanitizeText()` - Nettoyage texte

---

## 📈 Performance

- **Lighthouse score** > 85
- **First contentful paint** < 2s
- **Lazy loading** des composants output
- **Debounce** inputs textarea
- **Error boundaries** autour composants critiques

---

## 🤝 Contribuer

1. Fork le projet
2. Créer une feature branch (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branch (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour les détails.

---

## 🙏 Crédits

- **Groq AI** - Modèles de langage avancés
- **Lucide** - Icônes magnifiques
- **Google Fonts** - Playfair Display, DM Sans, JetBrains Mono
- **EmailJS** - Service email client-side

---

**Made with ❤️ and Groq AI**

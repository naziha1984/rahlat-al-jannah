# رحلات الجنة - Voyages du Paradis

Application web d'agence de voyage multilingue (Français - Anglais - Arabe)

## 🚀 Fonctionnalités

### Pour les Clients
- ✅ Consultation des destinations disponibles
- ✅ Filtrage et recherche par destination, prix, disponibilité
- ✅ Détails complets des destinations
- ✅ Réservation de voyages (dates, participants)
- ✅ Espace personnel avec historique des réservations
- ✅ Interface multilingue (FR/EN/AR)

### Pour les Administrateurs
- ✅ Interface d'administration sécurisée
- ✅ Gestion complète des destinations (CRUD)
- ✅ Visualisation des réservations clients
- ✅ Gestion des contenus multilingues

## 🛠️ Technologies Utilisées

### Frontend
- React.js avec Vite
- Tailwind CSS
- React Router DOM
- i18next pour la traduction
- Axios pour les appels API

### Backend
- Node.js + Express
- MongoDB Atlas
- Mongoose
- JWT pour l'authentification
- Sécurité : CORS, dotenv, helmet

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd rahilat-al-jannah
```

2. **Installer toutes les dépendances**
```bash
npm run install-all
```

3. **Configuration des variables d'environnement**
```bash
# Copier le fichier d'exemple
cp server/.env.example server/.env
```

4. **Configurer MongoDB Atlas**
- Créer un cluster MongoDB Atlas
- Obtenir l'URI de connexion
- Ajouter l'URI dans `server/.env`

5. **Lancer le développement**
```bash
npm run dev
```

## 🌐 Accès

- **Frontend Client**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Panel**: http://localhost:5173/admin

## 📁 Structure du Projet

```
rahilat-al-jannah/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Hooks personnalisés
│   │   ├── services/      # Services API
│   │   ├── locales/       # Fichiers de traduction
│   │   └── utils/         # Utilitaires
│   └── public/            # Assets statiques
├── server/                # Backend Node.js
│   ├── controllers/       # Contrôleurs API
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── middleware/       # Middlewares
│   └── config/           # Configuration
└── docs/                 # Documentation
```

## 🔐 Authentification Admin

**Identifiants par défaut:**
- Email: admin@paradis.com
- Mot de passe: admin123

⚠️ **Important**: Changez ces identifiants en production !

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Render/Railway)
- Connecter le dossier `server/` à votre plateforme
- Configurer les variables d'environnement

### Base de Données
- Utiliser MongoDB Atlas (Cluster partagé)

## 📝 API Endpoints

### Destinations
- `GET /api/destinations` - Liste des destinations
- `GET /api/destinations/:id` - Détails d'une destination

### Réservations
- `POST /api/reservations` - Créer une réservation
- `GET /api/users/:id/reservations` - Réservations d'un utilisateur

### Admin
- `POST /api/login` - Authentification admin
- `POST /api/admin/destinations` - Créer une destination
- `PUT /api/admin/destinations/:id` - Modifier une destination
- `DELETE /api/admin/destinations/:id` - Supprimer une destination

## 🌍 Support Multilingue

L'application supporte 3 langues :
- 🇫🇷 Français (fr)
- 🇬🇧 Anglais (en)
- 🇸🇦 Arabe (ar)

## 📞 Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails. #   r a h l a t - a l - j a n n a h  
 
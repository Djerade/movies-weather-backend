# Movies Weather Backend

Un backend API pour une application combinant des données de films et de météo, construit avec Node.js, Express et TypeScript.

## 🚀 Fonctionnalités

- **API REST** pour les films et la météo
- **TypeScript** pour un développement type-safe
- **Express.js** comme framework web
- **Nodemon** pour le développement avec rechargement automatique
- **Variables d'environnement** avec dotenv

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- Yarn (recommandé) ou npm
- MongoDB (optionnel, pour la persistance des données)

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone <votre-repo-url>
   cd movies-weather-backend
   ```

2. **Installer les dépendances**
   ```bash
   yarn install
   # ou
   npm install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   
   Puis éditez le fichier `.env` avec vos clés API :
   ```env
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/movies-weather
   TMDB_API_KEY=votre_clé_tmdb
   OPENWEATHER_API_KEY=votre_clé_openweather
   ```

## 🏃‍♂️ Démarrage

### Mode développement
```bash
yarn dev
# ou
npm run dev
```

Le serveur sera accessible sur `http://localhost:4000`

### Mode production
```bash
yarn build
yarn start
# ou
npm run build
npm start
```

## 📚 API Endpoints

### Endpoints de base
- `GET /` - Page d'accueil avec la liste des endpoints
- `GET /health` - Vérification de l'état du serveur
- `GET /api` - Informations sur l'API

### Films (à venir)
- `GET /api/movies` - Liste des films
- `GET /api/movies/:id` - Détails d'un film
- `GET /api/movies/search?q=query` - Recherche de films

### Météo (à venir)
- `GET /api/weather` - Données météo actuelles
- `GET /api/weather/:city` - Météo par ville
- `GET /api/weather/coordinates?lat=lat&lon=lon` - Météo par coordonnées

## 🏗️ Structure du projet

```
src/
├── config/          # Configuration (base de données, etc.)
├── graphql/         # Schémas et résolveurs GraphQL
├── middleware/      # Middlewares Express
├── models/          # Modèles de données (MongoDB/Mongoose)
├── services/        # Services pour les appels API externes
└── index.ts         # Point d'entrée de l'application
```

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **TypeScript** - Langage de programmation
- **MongoDB** - Base de données (optionnel)
- **Mongoose** - ODM pour MongoDB
- **Apollo Server** - Serveur GraphQL (à venir)
- **Axios** - Client HTTP pour les appels API externes

## 🔧 Scripts disponibles

- `yarn dev` - Démarre le serveur en mode développement avec nodemon
- `yarn build` - Compile TypeScript vers JavaScript
- `yarn start` - Démarre le serveur en mode production
- `yarn test` - Lance les tests (à configurer)

## 🌐 APIs externes

Ce projet utilise les APIs suivantes :
- **The Movie Database (TMDB)** - Pour les données de films
- **OpenWeatherMap** - Pour les données météo

## 📝 Variables d'environnement

| Variable | Description | Requis |
|----------|-------------|---------|
| `PORT` | Port du serveur | Non (défaut: 4000) |
| `NODE_ENV` | Environnement (development/production) | Non |
| `MONGODB_URI` | URI de connexion MongoDB | Non |
| `TMDB_API_KEY` | Clé API The Movie Database | Oui |
| `OPENWEATHER_API_KEY` | Clé API OpenWeatherMap | Oui |

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Si vous avez des questions ou des problèmes, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Développé avec ❤️ en TypeScript**

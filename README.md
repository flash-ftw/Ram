# Rammeh MotoScoot

Site e-commerce spécialisé dans la vente de motos et accessoires.

## Déploiement sur Railway

### Prérequis

1. Créez un compte sur [Railway](https://railway.app)
2. Créez un dépôt GitHub avec le code de ce projet
3. Connectez votre compte Railway à GitHub

### Étapes de déploiement

1. Dans Railway, créez un nouveau projet en cliquant sur "New Project"
2. Sélectionnez "Deploy from GitHub"
3. Choisissez votre dépôt GitHub contenant ce projet
4. Railway détectera automatiquement le projet Node.js

### Configuration de la Base de Données

1. Dans votre projet Railway, cliquez sur "New" > "Database" > "PostgreSQL"
2. Une fois la base de données créée, Railway générera une variable d'environnement `DATABASE_URL`
3. Copiez cette URL pour l'utiliser lors de la configuration des variables d'environnement

### Configuration des Variables d'Environnement

Dans les paramètres de votre projet Railway, ajoutez les variables d'environnement suivantes:

- `DATABASE_URL`: L'URL de connexion PostgreSQL fournie par Railway
- `SESSION_SECRET`: Une chaîne aléatoire pour sécuriser les sessions (par exemple, générée via [random.org](https://www.random.org/strings/))
- `NODE_ENV`: Définissez-la à `production`

### Déploiement Initial

1. Railway déploiera automatiquement votre application après la configuration
2. Le build utilisera les commandes définies dans le fichier `package.json`:
   - `npm run build` pour construire l'application
   - `npm start` pour démarrer le serveur

### Configuration du Domaine Personnalisé (Optionnel)

1. Dans Railway, allez dans "Settings" > "Domains"
2. Vous pouvez utiliser le sous-domaine Railway fourni ou configurer votre propre domaine
3. Pour un domaine personnalisé, suivez les instructions pour configurer les enregistrements DNS

## Maintenance

- Chaque nouveau commit sur votre branche principale déclenchera automatiquement un redéploiement
- Surveillez les journaux de déploiement dans Railway pour détecter d'éventuels problèmes

## Accès Admin

- URL: `/admin/login`
- Identifiants par défaut:
  - Nom d'utilisateur: `admin`
  - Mot de passe: `admin123`

**Important**: Changez le mot de passe admin par défaut après le premier déploiement!
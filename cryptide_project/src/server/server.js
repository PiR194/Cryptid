const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const authRoutes = require('./routes/authRoutes');
const DatabaseService = require('./services/DatabaseService');

const app = express();
const port = 3000;

// Middleware
app.use(cors());                // Autoriser les requêtes cross-origin
app.use(bodyParser.json());     // Parser le body des requêtes en JSON

// Session
const secret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' ? true : false,
            maxAge: 60 * 60 * 1000
  }
}));

// Middleware pour les routes d'authentification
app.use('/auth', authRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur interne du serveur!');
});

// Middleware pour la gestion des erreurs 404
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Connexion à la base de données au démarrage du serveur
const databaseService = new DatabaseService();
databaseService.connect()
  .then(() => {
    // Démarrage du serveur
    app.listen(port, () => {
      console.log(`Serveur écoutant sur le port ${port}`);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la connexion à la base de données:', error);
    process.exit(1);
  });

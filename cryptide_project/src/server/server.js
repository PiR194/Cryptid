const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const DatabaseService = require('./services/DatabaseService');

const app = express();
const port = 3000;

// Middleware CORS
app.use(cors());

// Middleware pour traiter le corps des requêtes en JSON
app.use(bodyParser.json());

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

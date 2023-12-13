const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const authRoutes = require(path.resolve(__dirname, './routes/AuthRoutes'));
const DatabaseService = require(path.resolve(__dirname, './services/DatabaseService'));

const app = express();
const port = 3003;

// Middleware
app.use(cors(
  {
    origin: ["http://172.20.10.4:3000", "http://localhost:8080", "*"],
    credentials: true
  }
));                            // Autoriser les requêtes cross-origin
app.use(bodyParser.json());     // Parser le body des requêtes en JSON

// Session
const secret = crypto.randomBytes(32).toString('hex');
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 60 * 60 * 1000
  }
}));

// Middleware pour les routes
app.use('/', authRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erreur interne du serveur!');
});

// Middleware pour la gestion des erreurs 404
app.use((req, res) => {
  console.log(req.url)
  res.status(404).send('Page non trouvée');
});

// Connexion à la base de données sqlite3 au démarrage du serveur
const databaseService = new DatabaseService();
databaseService.connect()
  .then(() => {
    // Lancer le serveur
    app.listen(port, () => {
      console.log(`Serveur lancé sur le port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

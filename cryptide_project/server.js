const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Définir le type MIME pour les fichiers JavaScript
app.use('*.js', (req, res, next) => {
  res.type('application/javascript');
  next();
});

// Servir les fichiers statiques depuis le dossier 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Route par défaut pour servir l'application React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 80;

// Servir les fichiers statiques depuis le dossier 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Définir le type MIME pour les fichiers JavaScript
app.use('/static/js', (req, res, next) => {
  res.type('application/javascript; charset=utf-8');
  next();
}, express.static(path.join(__dirname, 'build/static/js')));

// Définir le type MIME pour les fichiers CSS
app.use('/static/css', (req, res, next) => {
  res.type('text/css; charset=utf-8');
  next();
}, express.static(path.join(__dirname, 'build/static/css')));

// Route par défaut pour servir l'application React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
  console.log(path.join(__dirname, 'build'))
});

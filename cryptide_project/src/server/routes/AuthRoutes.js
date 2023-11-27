const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const SessionController = require('../controllers/SessionController');

// Routes pour l'authentification
router.post('/auth/signup', AuthController.signUp);
router.post('/auth/signin', AuthController.signIn);
router.delete('/auth/logout', AuthController.logout)
router.delete('/auth/delAccount', AuthController.delAccount)

// Routes pour les sessions
router.get('/session', SessionController.getUserInformation);

module.exports = router;

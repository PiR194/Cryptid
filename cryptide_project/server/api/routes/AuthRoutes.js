const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const SessionController = require('../controllers/SessionController');
const ScoreboardController = require('../controllers/ScoreboardController');

// Routes pour l'authentification
router.post('/auth/signup', AuthController.signUp);
router.post('/auth/signin', AuthController.signIn);
router.delete('/auth/logout', AuthController.logout)
router.delete('/auth/delAccount', AuthController.delAccount)
router.post('/auth/validatePassword', AuthController.validatePassword);
router.put('/auth/updatePassword', AuthController.updatePassword);

// Routes pour les sessions
router.get('/session', SessionController.getUserInformation);
router.post('/session/addMastermindStats', SessionController.addMastermindStats);
router.post('/session/addEasyEnigmaStats', SessionController.addEasyEnigmaStats);
// router.post('/session/addMediumEnigmaStats', SessionController.addMediumEnigmaStats);
router.post('/session/addHardEnigmaStats', SessionController.addHardEnigmaStats);
router.post('/session/addOnlineStats', SessionController.addOnlineStats);
router.put('/session/updatePseudo', SessionController.UpdatePseudo);

// Routes pour le scoreboard
router.get('/scoreboard/getDailyMastermind', ScoreboardController.getDailyMastermind);

module.exports = router;

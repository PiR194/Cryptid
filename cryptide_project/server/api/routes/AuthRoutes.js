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

router.get('/auth/getAllUsers', AuthController.getUsers)
router.get('/auth/games', AuthController.getGames)


// Routes pour les sessions
router.get('/session', SessionController.getUserInformation);
router.post('/session/addMastermindStats', SessionController.addMastermindStats);
router.post('/session/addEasyEnigmaStats', SessionController.addEasyEnigmaStats);
router.post('/session/addMediumEnigmaStats', SessionController.addMediumEnigmaStats);
router.post('/session/addHardEnigmaStats', SessionController.addHardEnigmaStats);
router.post('/session/addOnlineStats', SessionController.addOnlineStats);
router.put('/session/updatePseudo', SessionController.UpdatePseudo);

// Routes pour le daily scoreboard
router.get('/scoreboard/getDailyMastermind', ScoreboardController.getDailyMastermind);
router.get('/scoreboard/getDailyEasyEnigma', ScoreboardController.getDailyEasyEnigma);
router.get('/scoreboard/getDailyMediumEnigma', ScoreboardController.getDailyMediumEnigma);
router.get('/scoreboard/getDailyHardEnigma', ScoreboardController.getDailyHardEnigma);
router.get('/scoreboard/getDailyOnline', ScoreboardController.getDailyOnline);

// Routes pour le weekly scoreboard
router.get('/scoreboard/getWeeklyMastermind', ScoreboardController.getWeeklyMastermind);
router.get('/scoreboard/getWeeklyEasyEnigma', ScoreboardController.getWeeklyEasyEnigma);
router.get('/scoreboard/getWeeklyMediumEnigma', ScoreboardController.getWeeklyMediumEnigma);
router.get('/scoreboard/getWeeklyHardEnigma', ScoreboardController.getWeeklyHardEnigma);
router.get('/scoreboard/getWeeklyOnline', ScoreboardController.getWeeklyOnline);


module.exports = router;

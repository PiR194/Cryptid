const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/auth/signup', AuthController.signUp);
router.post('/auth/signin', AuthController.signIn);

module.exports = router;

const express = require('express');
const validators = require('../middleware/validators');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogin);

router.post('/register', validators.registration, authController.postRegister);

router.post('/logout', authController.postLogout);

module.exports = router;
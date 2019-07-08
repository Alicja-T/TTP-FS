const express = require('express');
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.post('/login', authController.postLogin);

router.post('/register', check('email').isEmail(), authController.postRegister);

router.post('/logout', authController.postLogout);

module.exports = router;
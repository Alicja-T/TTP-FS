const path = require('path');

const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is_auth');

router.get('/transactions', isAuth, userController.getTransactions);

router.get('/transactionTicker', isAuth, userController.findPrice);

router.get('/transaction', isAuth, userController.getTransaction);

router.get('/portfolio', isAuth, userController.getPortfolio);

router.post('/transaction', isAuth, userController.postTransaction);


router.get("/", userController.getHomePage);


module.exports = {
    routes: router
}

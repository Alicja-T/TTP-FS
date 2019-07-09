const path = require('path');

const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/is_auth');
const validators = require('../middleware/validators');

router.get('/transactions', isAuth, userController.getTransactions);

router.get('/transactionTicker', isAuth, userController.findPrice);

router.get('/portfolioUpdate', isAuth, userController.updatePortfolio);

router.get('/portfolio', isAuth, userController.getPortfolio);

router.post('/portfolio', validators.transaction, isAuth, userController.postPortfolio);


router.get("/", userController.getHomePage);


module.exports = {
    routes: router
}

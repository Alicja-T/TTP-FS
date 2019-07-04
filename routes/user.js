const path = require('path');

const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is_auth');

router.get('/transactions', isAuth, userController.getTransactions);

router.get('/transaction_ticker', isAuth, userController.findPrice);

router.get('/transaction', isAuth, userController.getTransaction);

router.get('/portfolio', isAuth, userController.getPortfolio);

router.post('/transaction', isAuth, userController.postTransaction);


router.get("/",(req, res, next) => {
    console.log('home page');
    res.render('index', {
        pageTitle: 'home',
        path: '/',
        isAuthenticated: false,
        activeHome: true
    });
});


module.exports = {
    routes: router
}

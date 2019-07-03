const path = require('path');

const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.get('/transactions', userController.getTransactions);

router.get('/transaction_ticker', userController.findPrice);

router.get('/transaction', userController.getTransaction);

router.post('/transaction', userController.postTransaction);


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

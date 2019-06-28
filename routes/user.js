const path = require('path');

const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

const users = [];

router.get('/login', (req, res, next) => {
    res.render('login', {
        pageTitle: 'login',
        path: '/login',
        loginCSS: true,
        activeLogin: true    
    });
});

router.get('/transactions', userController.getTransactions);

router.get('/register', (req, res, next) => {
    console.log('register');
    res.render('register', {
        pageTitle: 'Register',
        path: '/register',
        formCSS: true,
        activeRegister: true
    });
});

router.post('/register',(req, res, next) => {
    console.log('registered');
    users.push({ user: req.body.name});
    console.log(users);
    res.redirect('/');
});

router.get('/portfolio',(req, res, next) => {
    console.log('register');
    res.render('portfolio', {
        pageTitle: 'Portfolio',
        path: '/portfolio',
        activePortfolio: true
    });
});


router.get("/",(req, res, next) => {
    console.log('home page');
    res.render('index', {
        pageTitle: 'home',
        path: '/',
        activeHome: true
    });
});


module.exports = {
    routes: router,
    users: users
}

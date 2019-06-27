const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');

const router = express.Router();

router.use("/login",(req, res, next) =>{
    console.log('login');
    res.sendFile(path.join(rootDir, 'views', 'login.html'));
});

router.use("/register",(req, res, next) =>{
    console.log('register');
    res.sendFile(path.join(rootDir, 'views', 'register.html'));
});

router.get("/portfolio",(req, res, next) =>{
    console.log('register');
    res.sendFile(path.join(rootDir, 'views', 'portfolio.html'));
});


router.get("/",(req, res, next) =>{
    console.log('home page');
    res.sendFile(path.join(rootDir, 'views', 'index.html'));
});


module.exports = router;
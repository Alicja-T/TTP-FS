const path = require('path');

const express = require('express');

const rootDir = require('../utils/path');
const userData = require('./user');

const router = express.Router();

router.get( "/users", (req, res, next) =>{
    const users = userData.users;
    console.log(users);
    res.render('users', {
        pageTitle: 'Users',
        path: '/users',
        users: users
    });
 });

module.exports = router;
const {body} = require('express-validator');
const User = require('../models/user');


exports.registration = [
    body(
        'name',
        'Please enter your name.')
    .isLength({min: 1}),
    
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, {req}) => {
        return User.findOne({email: value})
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject(
                        'Entered e-mail is already being used.'
                    );
                }
            });
    }),
    
    body('password',
    'Please enter a password at least 5 characters long.'
    )
    .isLength({min: 5}),

    body('confirmPassword')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords have to match!')
        }
        return true;
    })
]
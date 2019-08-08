const {body} = require('express-validator');
const User = require('../models/user');
const stocks = require('../utils/stocks')


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

exports.transaction = [
    body('transactionTicker', 
    'Please enter transaction ticker')
    .isLength({min: 1})
    .custom((value, {req}) => {
        let ticker = value.toUpperCase();
        return stocks.getSingleQuote(ticker)
            .then( result => {
                console.log(result);
                req.body.transactionTicker = ticker;
                req.body.transactionPrice = result.data[0].price,
                req.body.openPrice = result.data[0].price
            })
            .catch(err => {
                console.log(err);
                if (err) {
                    throw new Error('Incorrect ticker.')
                }
            });
    }),

    body('quantity', 
    'Quantity has to be greater than zero.')
    .isInt({min: 1})
    .custom((value, {req}) => {
        if (value * req.body.transactionPrice > req.session.user.balance) {
            throw new Error('Insufficient funds.')
        }
        return true;
    }),


]
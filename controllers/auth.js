const bcrypt = require('bcryptjs');
const User = require('../models/user');
const stocks = require('../utils/stocks');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getRegister = (req, res, next) => {
  res.render('register', {
    path: '/register',
    pageTitle: 'Register',
    errorMessage: ''
  });
};

function getDynamicPortfolio(userPortfolio, stockdata){
  let stocks = [];
  let value = 0;
  userPortfolio.forEach(function(element){
    const tickerValue = stockdata[element.ticker].quote.latestPrice;
    const openValue = stockdata[element.ticker].quote.open;
    let newObject = {
      ticker : element.ticker,
      quantity : element.quantity,
      open: openValue,
      current: tickerValue,
      color : (openValue > tickerValue ? "down" : (openValue == tickerValue ? "no-change" : "up") )
    }
    value += element.quantity * tickerValue;
    stocks.push(newObject);
  })
  value = value.toFixed(2);
  return {stocks: stocks, portfolioValue : value};
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            console.log('logged in');
            let userPortfolio = user.portfolio.stocks;
            const symbols = userPortfolio.map(key => key.ticker);
            console.log(symbols);
            req.session.user = user;
            req.session.isLoggedIn = true;
            if (user.portfolio.stocks.length == 0 ) {
              req.session.portfolio = [];
              req.session.portfolioValue = 0;
              return req.session.save( err => {
                console.log(err);
                res.redirect('portfolio');
              });
            }
            else {
            stocks.getOpenPrices(symbols.join(','))
              .then( data => {
                userPortfolio = getDynamicPortfolio(userPortfolio, data.data);
                req.session.portfolio = userPortfolio.stocks;
                req.session.portfolioValue = userPortfolio.portfolioValue;
                return req.session.save( err => {
                  console.log(err);
                  res.redirect('portfolio');
                });
              })
              .catch(err => {
                console.log(err);
              });
            }            
          }
          else {
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
          }
        })
        .catch( err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postRegister = (req, res, next) => {
  console.log('registering');
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  
  if ( !errors.isEmpty() ) {
    console.log(errors.array());
    return res.status(422).render('register',  {
        path: '/register',
        pageTitle: 'Register',
        errorMessage: errors.array()[0].msg
    }); 
  }
  
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        name: name,
        email: email,
        balance: 5000,
        password: hashedPassword,
        portfolio: { stocks: []}
    });
    return user.save();
    })
    .then(result => {      
      res.redirect('/login');
    })
    .catch(err => { 
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

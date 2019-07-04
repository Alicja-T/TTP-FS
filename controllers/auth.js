const bcrypt = require('bcryptjs');
const User = require('../models/user');


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
    pageTitle: 'Register'
  });
};

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
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              if (err) {
                console.log(err);
              }
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password');
          res.redirect('/login');
        })
        .catch( err => {
          console.log(err);
          res.redirect('/login');
        });
      
    })
    .catch(err => console.log(err));
};

exports.postRegister = (req, res, next) => {
  console.log('registered');
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email: email})
      .then(userDoc => {
          if (userDoc) {
              return res.redirect('/register');
          }
          return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
              const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                portfolio: { stocks: []}
              });
              return user.save();
            })
            .then(result => {
              res.redirect('/login');
            });
      })
      .catch(err => { 
          console.log(err) 
      });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

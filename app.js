
require('dotenv').config();

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const errorController = require('./controllers/error');
const MONGODB_URI = 'mongodb+srv://portfolio:9J7MvvKmccyDL0cY@cluster0-hed3b.mongodb.net/portfolio';
const csrf = require('csurf');
const flash = require('connect-flash');

const app = express();
const store = new MongoDBStore({
     uri: MONGODB_URI,
     collection: 'sessions'
})

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public') ) );
app.use(
    session({
        secret: 'my secret', 
        resave: false, 
        saveUninitialized: false,
        store: store
    })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
     .then(user => {
         if (!user) {
             return next();
         }
         req.user = user;
         next();
    })
    .catch(err => {
        throw new Error(err);
    });
});

app.use(userRoutes.routes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.redirect('/500');
});

mongoose
.connect(MONGODB_URI)
.then( result => {
    app.listen(process.env.PORT || 3000);
})
.catch(err =>{

    console.log(err);
});
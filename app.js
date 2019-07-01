const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./utils/database').mongoConnect;

const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({secret: 'my secret', resave: false, saveUninitialized: false})
    );

app.use(userRoutes.routes);
app.use(adminRoutes);


app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found' });
});

mongoConnect(() => {
    app.listen(3000);
});

const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const db = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRoutes.routes);
app.use(adminRoutes);


app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found' });
});

app.listen(3000);
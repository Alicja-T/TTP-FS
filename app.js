
require('dotenv').config();

const path = require('path');
const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/deep')
const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./utils/database').mongoConnect;

const session = require('express-session');
const fetchSymbols = require('./utils/stocks').fetchSymbols;

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

// //let dictionary = fetchSymbols(1);
// //console.log("dupsko " + dictionary[0]);
// let messArray = [];
// socket.on('message', message => {
//     messArray.push(message);
//     console.log('message');
//     console.log(messArray);
// });
// socket.on('connect', () => {
//     // Subscribe to topics (i.e. appl,fb,aig+)
//     socket.emit('subscribe', JSON.stringify({
//         symbols: ['snap'],
//         channels: ['officialprice'],
//     }))
//     console.log('connected');
//     // Unsubscribe from topics (i.e. aig+)
//     //socket.emit('unsubscribe', 'aig+')
// });


mongoConnect(() => {

    app.listen(3000);
});

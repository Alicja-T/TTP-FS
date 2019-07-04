const Transaction = require('../models/transaction');
const retrieveQuote = require('../utils/stocks')
const User = require('../models/user');


exports.getHomePage = (req, res, next) => {
    console.log('home page');
    res.render('index', {
        pageTitle: 'home',
        path: '/',        
    });
}

exports.getTransactions = (req, res, next) => {
    Transaction.find()
    .then( transactions => {
        console.log(transactions);
        res.render('transactions', {
            transactions: transactions,
            pageTitle: 'transactions',
            path: '/transactions'
        });
    })
    .catch(err => console.log(err));
};

exports.findPrice = (req, res, next) => {
    console.log('Finding Price...');
    const ticker = req.query.ticker;
    console.log(ticker);
    const quoteData = retrieveQuote.quote(ticker)
        .then( result => { 
            console.log(result.open);
            console.log(ticker);
            res.render('includes/tickerPrice', {
                ticker: ticker,
                tickerPrice: result.open,
                errorMessage: "",
             });
        })
        .catch( err => {
            console.log(err);
            res.render('includes/tickerPrice', {
            ticker: "",
            tickerPrice: "",
            errorMessage: "Incorrect ticket symbol",
        })
    });
};

exports.getPortfolio = (req, res, next) => {
    console.log('portfolio');
    res.render('portfolio', {
        pageTitle: 'Portfolio',
        path: '/portfolio',
        activePortfolio: true,
        error: false
    });
};

exports.getTransaction = (req, res, next) => {
    let message = req.flash();
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    console.log('transaction');
    res.render('transaction', {
        pageTitle: 'Buy',
        path: '/transaction',
        ticker: "",
        tickerPrice: "",
        errorMessage: message
    });
};


exports.postTransaction = (req, res, next) => {
    console.log('bought');
    const ticker = req.body.transactionTicker;
    const price = req.body.transactionPrice;
    const quantity = req.body.quantity;
    console.log(ticker);
    console.log(price);
    console.log(quantity);
    const transaction = new Transaction({
        userId: req.user, 
        ticker: ticker, 
        tickerPrice: price, 
        timestamp: Date.now(), 
        quantity: quantity});
        transaction
          .save()
          .then(result => {
              console.log('Created Transaction');
              res.redirect('/transaction');
          })
          .catch(err => {
              console.log(err);
          });
};
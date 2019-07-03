const Transaction = require('../models/transaction');
const retrieveQuote = require('../utils/stocks')
const User = require('../models/user');


exports.getTransactions = (req, res, next) => {
    Transaction.find()
    .then( transactions => {
        console.log(transactions);
        res.render('transactions', {
            transactions: transactions,
            pageTitle: 'transactions',
            isAuthenticated: req.session.isLoggedIn,
            path: '/'
        });
    })
    .catch(err => console.log(err));
};

exports.findPrice = (req, res, next) => {
    console.log('Finding Price...');
    const ticker = req.query.ticker;
    console.log(ticker);
    const quoteData = retrieveQuote.quote(ticker)
        .then( result => { //reload partial instead
            res.render('includes/transaction_ticker', {
                ticker: ticker,
                tickerPrice: result.open,
                pageTitle: 'transaction',
                path: '/transaction',
                isAuthenticated: req.session.isLoggedIn,
                error : false
            })
        })
        .catch( err => {
            console.log(err);
            res.render('includes/transaction_ticker', {
            ticker: "",
            tickerPrice: "",
            error : true,
            pageTitle: 'transaction',
            path: '/transaction',
            isAuthenticated: req.session.isLoggedIn
        })
    });
};

exports.getTransaction = (req, res, next) => {
    console.log('transaction');
    res.render('transaction', {
        pageTitle: 'Buy',
        path: '/transaction',
        ticker: "",
        tickerPrice: "",
        activePortfolio: true,
        isAuthenticated: req.session.isLoggedIn,
        error: false
    });
};


exports.postTransaction = (req, res, next) => {
    console.log('bought');
    const ticker = req.body.ticker;
    const price = req.body.price;
    const quantity = req.body.quantity;
    
    const quoteData = retrieveQuote.quote(ticker)
        .then( result => { //reload partial instead
            let ticker = "", price = "";
            if (result) {
                ticker = result.symbol;
                price = result.price;
            }
            res.render('transaction', {
                ticker: ticker,
                tickerPrice: price,
                pageTitle: 'transaction',
                isAuthenticated: req.session.isLoggedIn,
                path: '/transaction',
                error : false
            })
        })
        .catch( err => {
            console.log(err);
            res.render('transaction', {
            ticker: "",
            tickerPrice: "",
            error : true,
            pageTitle: 'transaction',
            path: '/transaction',
            isAuthenticated: req.session.isLoggedIn
            })
        });
    //  const transaction = new Transaction({
         // userId: req.user, ticker: ticker, tickerPrice: price, timestamp: Date.now(), quantity: quantity});
    //  transaction
    //      .save()
    //      .then(result => {
    //          console.log('Created Transaction');
    //          res.redirect('/transaction');
    //      })
    //      .catch(err => {
    //          console.log(err);
    //      });
};
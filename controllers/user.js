const Transaction = require('../models/transaction');
const retrieveQuote = require('../utils/stocks')
const User = require('../models/user');
const iex_pkey = "&token=" + process.env.IEXCLOUD_PUBLIC_KEY;
const IEX_URL = "https://cloud.iexapis.com/v1/stock/market/batch?types=ohlc,price&symbols=";
const axios = require('axios');

exports.getHomePage = (req, res, next) => {
    console.log('home page');
    res.render('index', {
        pageTitle: 'home',
        path: '/',        
    });
}

exports.getTransactions = (req, res, next) => {
    Transaction.find({'userId' : req.user._id})
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

function dynamicPortfolio(portfolio, data) {
    const result = [];
    portfolio.forEach( function(element){
        let openPrice = data[element.ticker.toUpperCase()].ohlc.open.price;
        let current = data[element.ticker.toUpperCase()].price;
        let newObject = {
            ticker: element.ticker, 
            quantity: element.quantity,
            currentValue: current * element.quantity,
            }
        newObject.color = (openPrice > current ? "red" : (openPrice==current ? "grey" : "green"));    
        result.push(newObject);
    });
    return result;
}

exports.getPortfolio = (req, res, next) => {
    console.log('portfolio');
    let portfolio = req.user.portfolio.stocks;
    const symbols = portfolio.map(key => key.ticker);
    console.log(symbols.join(','));
    axios.get(IEX_URL + symbols.join(',') + iex_pkey)
        .then(response => {
            console.log(response.data);
            portfolio = dynamicPortfolio(portfolio, response.data);
            console.log(portfolio);
            res.render('portfolio', {
                pageTitle: 'Portfolio',
                path: '/portfolio',
                portfolio: portfolio                
            });
        })
        .catch(err => {
            console.log(err);
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
              req.user.addToPortfolio(result);
              res.redirect('/transaction');
          })
          .catch(err => {
              console.log(err);
          });
};
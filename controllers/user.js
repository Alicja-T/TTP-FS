const Transaction = require('../models/transaction');
const stocks = require('../utils/stocks')
const User = require('../models/user');
const { validationResult } = require('express-validator');


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
    const ticker = req.query.ticker.toUpperCase();
    console.log(ticker);
    const stock = req.session.portfolio.find(element => {return element.ticker===ticker;});
    console.log(stock);
    if (stock) {
        res.render('includes/tickerPrice', {
            ticker: ticker,
            tickerPrice: stock.current,
            errorMessage: "",
            openPrice: stock.open
        });
    }
    else {
        const quoteData = stocks.getOpenPrice(ticker)
            .then( result => { 
                console.log(result.data["Global Quote"]);
                console.log(ticker);
                res.render('includes/tickerPrice', {
                    ticker: ticker,
                    tickerPrice: result.data["Global Quote"]["05. price"],
                    errorMessage: "",
                    openPrice: result.data["Global Quote"]["02. open"]
                });
            })
            .catch( err => {
                console.log(err);
                res.render('includes/tickerPrice', {
                ticker: "",
                tickerPrice: "",
                errorMessage: "Incorrect ticket symbol",
                openPrice: ""
                })
            });
    }
};

function dynamicPortfolio(portfolio, data) {
    let value = 0;
    symbolValues = {};
    data.forEach( function(element) {
        symbolValues[element.symbol] = element.price;
    });
    portfolio.forEach( function(element){
        let symbol = element.ticker.toUpperCase();
        let current = symbolValues[symbol];
        element.current = current;
        value += current * element.quantity;
        element.color = (element.open > current ? "down" : (element.open == current ? "no-change" : "up"));    
    });
    let result = { stocks: portfolio, portfolioValue : value.toFixed(2)};
    return result;
}

 exports.updatePortfolio = (req, res, next) => {
    console.log('portfolio update');
    let portfolio = req.session.portfolio;
    const symbols = portfolio.map(key => key.ticker);
    stocks.getCurrentPrices(symbols.join(','))
        .then(response => {
            console.log(response.data);
            portfolio = dynamicPortfolio(portfolio, response.data);
            console.log(portfolio);
            res.render('includes/portfolio_dynamic', {
                portfolio: portfolio.stocks,
                portfolioValue: portfolio.portfolioValue             
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getPortfolio = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    }
    else {
        message = null;
    }
    console.log('portfolio');

    res.render('portfolio', {
        pageTitle: 'Buy',
        path: '/portfolio',
        ticker: "",
        tickerPrice: "",
        errorMessage: message,
        balance: req.session.user.balance,
        portfolio: req.session.portfolio,
        portfolioValue: req.session.portfolioValue
    });
};

function updateSessionData(req, transaction){
    console.log("updating session data...");
    req.session.user.balance -= transaction.tickerPrice * transaction.quantity;
    const tickerIndex = req.session.portfolio.findIndex(element => {
        return element.ticker === transaction.ticker;
    });
    console.log("open price: " + req.body.openPrice);
    if (tickerIndex >= 0) {
        req.session.portfolio[tickerIndex].quantity += transaction.quantity;
    }
    else {
        let openPrice = req.body.openPrice;
        req.session.portfolio.push({
            ticker: transaction.ticker,
            quantity: transaction.quantity,
            open: req.body.openPrice,
            current: transaction.tickerPrice,
            color: (openPrice > transaction.tickerPrice ? "down" : (openPrice == transaction.tickerPrice ? "no-change" : "up") )
        });
    }
    let value = 0;
    req.session.portfolio.forEach(element => {
        value += element.current * element.quantity;
    });
    req.session.portfolioValue = value.toFixed(2);
}

exports.postPortfolio  = (req, res, next) => {
    console.log('bought');
    const ticker = req.body.transactionTicker;
    const price = req.body.transactionPrice;
    const quantity = req.body.quantity;
    const errors = validationResult(req);

    if ( !errors.isEmpty() ) {
        console.log(errors.array());
        return res.status(422).render('portfolio',  {
            path: '/portfolio',
            pageTitle: 'portfolio',
            errorMessage: errors.array()[0].msg,
            ticker: "",
            tickerPrice: "",
            balance: req.session.user.balance,
            portfolio: req.session.portfolio,
            portfolioValue: req.session.portfolioValue
        }); 
    }

    console.log(req.user.balance);
    if (price*quantity > req.user.balance) {
        req.flash('error', 'Insufficient funds');
        console.log(req);
        this.getPortfolio(req,res,next);
    }
    else {
        const transaction = new Transaction({
                     userId: req.user, 
                     ticker: ticker, 
                     tickerPrice: price, 
                     timestamp: Date.now(), 
                     quantity: quantity});
        transaction.save()
            .then(result => {
                console.log('Created Transaction');
                console.log(result)
                req.user.addToPortfolio(result);
                updateSessionData(req, transaction);
                let message = req.flash('error');
                if (message.length > 0) {
                    message = message[0];
                }
                else {
                    message = null;
                }  
                res.render('portfolio', {
                    pageTitle: 'Portfolio',
                    path: '/portfolio',
                    ticker: "",
                    tickerPrice: "",
                    errorMessage: message,
                    balance: req.session.user.balance,
                    portfolio: req.session.portfolio,
                    portfolioValue: req.session.portfolioValue
                });
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    }
};
const Transaction = require('../models/transaction');
const retrieveQuote = require('../utils/stocks')


exports.getTransactions = (req, res, next) => {
    Transaction.fetchAll()
    .then( transactions => {
        console.log(transactions);
        res.render('transactions', {
            transactions: transactions,
            pageTitle: 'transactions',
            path: '/'
        });
    })
    .catch(err => console.log(err));
};

exports.postTransaction = (req, res, next) => {
    console.log('bought');
    const ticker = req.body.ticker;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const userId = 1234;
    const quoteData = retrieveQuote.quote(ticker)
        .then( result => {
            res.render('transaction', {
                ticker: result.symbol,
                tickerPrice: result.open,
                pageTitle: 'transaction',
                error : false
            })
        })
        .catch( err => {
            const message = "Not Found Try Again";
            console.log(err);
            res.render('transaction', {
            ticker: "",
            tickerPrice: "",
            error : true,
            pageTitle: 'transaction'
            })
        });
    // const transaction = new Transaction(userId, ticker, price, Date.now(), quantity);
    // transaction
    //     .save()
    //     .then(result => {
    //         console.log('Created Transaction');
    //         res.redirect('/transaction');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
};
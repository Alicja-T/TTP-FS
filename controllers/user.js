const Transaction = require('../models/transaction');


exports.getTransactions = (req, res, next) => {
    Transaction.fetchAll()
    .then(([rows, fieldData]) => {
        console.log(rows);
        res.render('transactions', {
            transactions: rows,
            pageTitle: 'transactions',
            path: '/'
        });
    })
    .catch(err => console.log(err));
};
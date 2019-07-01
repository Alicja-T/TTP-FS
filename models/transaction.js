const getDb = require('../utils/database').getDb;

class Transaction {
    constructor(userId, ticker, tickerPrice, timestamp, quantity) {
        this.userId = userId;
        this.ticker = ticker;
        this.tickerPrice = tickerPrice;
        this.timestamp = timestamp;
        this.quantity = quantity;
    }

    save() {
        const db = getDb();
        return db
            .collection('transactions')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch( err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db
            .collection('transactions')
            .find()
            .toArray()
            .then(transactions => {
                console.log(transactions);
                return transactions;
            })
            .catch( err => {
                console.log(err);
            });
    }

    static fetchAllForUser(id) {
       
    }

}

module.exports = Transaction;
const db = require('../utils/database');

module.exports = class Transaction {
    constructor(userId, ticker, tickerPrice, timestamp, quantity) {
        this.userId = userId;
        this.ticker = ticker;
        this.tickerPrice = tickerPrice;
        this.timestamp = timestamp;
        this.quantity = quantity;
    }
    save() {

    }

    static fetchAll() {
        return db.execute('SELECT * FROM transactions');
    }

    static fetchAllForUser(id) {
        return db.execute('SELECT * FROM transactions WHERE user_id =' + id);
    }

}
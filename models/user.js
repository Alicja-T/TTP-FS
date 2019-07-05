const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    portfolio: {
        stocks: [
            {
                ticker: {
                    type: String, 
                    required: true
                },
                quantity: {type: Number, required: true}
            }
        ]
    }
});

userSchema.methods.addToPortfolio = function(transaction) {
    const tickerIndex = this.portfolio.stocks.findIndex( ps => {
        return ps.ticker === transaction.ticker;
    });
    let newQuantity = transaction.quantity;
    const updatedStocks = [...this.portfolio.stocks];

    if (tickerIndex >= 0) {
        newQuantity = this.portfolio.stocks[tickerIndex].quantity + transaction.quantity;
        updatedStocks[tickerIndex].quantity = newQuantity;
    }
    else {
        updatedStocks.push({
            ticker: transaction.ticker,
            quantity: newQuantity
        });
    }
    const updatedPortfolio = {
        stocks: updatedStocks
    };
    this.portfolio = updatedPortfolio;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);

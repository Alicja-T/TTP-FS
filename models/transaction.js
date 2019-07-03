const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    tickerPrice: {
        type: Number,
        required: true
    },
    timestamp : {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);

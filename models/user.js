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

module.exports = mongoose.model('User', userSchema);

const  iex = require( 'iexcloud_api_wrapper' )
const socket = require('socket.io-client')('https://ws-api.iextrading.com/1.0/deep')

exports.quote = async (sym) => {
    try {
        const quoteData = await iex.quote(sym);
        return quoteData;
    } catch(err){
        console.log(err.message) 
    }
};

// //let dictionary = fetchSymbols(1);
// //console.log("dupsko " + dictionary[0]);
// let messArray = [];
// socket.on('message', message => {
//     messArray.push(message);
//     console.log('message');
//     console.log(messArray);
// });
// socket.on('connect', () => {
//     // Subscribe to topics (i.e. appl,fb,aig+)
//     socket.emit('subscribe', JSON.stringify({
//         symbols: ['snap'],
//         channels: ['officialprice'],
//     }))
//     console.log('connected');
//     // Unsubscribe from topics (i.e. aig+)
//     //socket.emit('unsubscribe', 'aig+')
// });


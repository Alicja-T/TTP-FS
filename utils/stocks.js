const  iex = require( 'iexcloud_api_wrapper' );
const axios = require('axios');
const iex_pkey = "&token=" + process.env.IEXCLOUD_PUBLIC_KEY;
const IEX_OPEN_URL = "https://cloud.iexapis.com/v1/stock/market/batch?types=quote&symbols=";
const IEX_CURRENT_URL = "https://cloud.iexapis.com/v1/stock/market/batch?types=price&symbols=";
const IEX_SINGLE_URL = "https://cloud.iexapis.com/v1/stock/"


exports.quote = async (sym) => {
    try {
        const quoteData = await iex.quote(sym);
        return quoteData;
    } catch(err){
        console.log(err.message) 
    }
};

exports.getSingleQuote = (sym) => {
    return this.getOpenPrices(sym);
};

exports.getCurrentPrices = (symbols) => {
   return axios.get(IEX_CURRENT_URL + symbols + iex_pkey);
};

exports.getOpenPrices = (symbols) => {
    return axios.get(IEX_OPEN_URL + symbols + '&filter=open,latestPrice' + iex_pkey);
};



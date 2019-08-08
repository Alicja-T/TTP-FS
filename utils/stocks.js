const axios = require('axios');
const iex_pkey = "&token=" + process.env.IEXCLOUD_PUBLIC_KEY;
const alpha_key = "&apikey=" + process.env.ALPHA_VANTAGE_KEY;
const IEX_OPEN_URL = "https://cloud.iexapis.com/v1/stock/market/batch?types=quote&symbols=";
const IEX_CURRENT_URL = "https://api.iextrading.com/1.0/tops/last?symbols=";
const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=";


exports.getSingleQuote = (sym) => {
    return this.getCurrentPrices(sym);
};

exports.getCurrentPrices = (symbols) => {
   return axios.get(IEX_CURRENT_URL + symbols);
};

exports.getOpenPrices = (symbols) => {
    return this.getCurrentPrices(symbols);
};

exports.getOpenPrice = (symbol) => {
    return axios.get(ALPHA_VANTAGE_URL + symbol + alpha_key);
}


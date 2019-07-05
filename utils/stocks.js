const  iex = require( 'iexcloud_api_wrapper' )

exports.quote = async (sym) => {
    try {
        const quoteData = await iex.quote(sym);
        return quoteData;
    } catch(err){
        console.log(err.message) 
    }
};



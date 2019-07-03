$(document).ready(function() {

    function searchTicker(form) {
      var formData = $(form).serializeArray();
      $.get('/transaction_ticker', {
        ticker: formData[0].value
      }).then(function (data) {
        $('#tickerPrice').html(data);
      });
    }
  
    window.searchTicker = searchTicker;
  });
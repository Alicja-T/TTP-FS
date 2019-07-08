$(document).ready(function() {
    //$('#portfolio-data').load('/portfolioUpdate');
    refresh();
    function refresh() {
        setTimeout (function() {
            $("#portfolio-data").load('/portfolioUpdate');
            refresh();
        }, 15000);
    }
    $("#ticker-symbol").click(function() {
        this.value = '';
        $('#ticker-price').val(null);
      });
    
      function searchTicker(form) {
        var formData = $(form).serializeArray();
        $.get('/transactionTicker', {
          ticker: formData[0].value
        }).then(function (data) {
          const dataObject = JSON.parse(data);
          console.log(dataObject);
          if (dataObject.errorMessage === "") {
            $('#main-form-ticker').val(dataObject.ticker);
            $('#ticker-price').val(dataObject.tickerPrice);
            $('#main-form-price').val(dataObject.tickerPrice);
            $('#open-price').val(dataObject.openPrice);
          }
          else {
            $('#ticker-price').val(null);
            $('#ticker-symbol').val(dataObject.errorMessage);
          }
        });
       // form.preventDefault();
      }
    
      window.searchTicker = searchTicker;

});
      
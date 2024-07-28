$(function() {

    var companies = [
        { name: 'Apple', symbol: 'AAPL', price: '236.21', shares: '0' },
        { name: 'Google', symbol: 'GOOG', price: '1215.45', shares: '0' },
        { name: 'Tesla', symbol: 'TSLA', price: '247.89', shares: '0' },
        { name: 'Microsoft', symbol: 'MSFT', price: '139.68', shares: '0' },
        { name: 'J.P. Morgan', symbol: 'JPM', price: '184.89', shares: '0' },
        { name: 'Amazon', symbol: 'AMZN', price: '1731.92', shares: '0' },
        { name: 'Nike', symbol: 'NKE', price: '93.88', shares: '0' },
        { name: 'Intel', symbol: 'INTC', price: '57.89', shares: '0' }
    ];

    var cashflow = 10000;

    var apiKey = '1FCVK76UZ7NBTVO1';

    var portfolioValue = function() {
        var total = 0;
        for (var key in companies) {
            var obj = companies[key];
            var priceOfCurrentStock = parseFloat(obj.price);
            var sharesOwned = parseFloat(obj.shares);
            total += priceOfCurrentStock * sharesOwned;
        }
        return total;
    };

    var fetchRealTimePrices = function() {
        for (let i = 0; i < companies.length; i++) {
            let symbol = companies[i].symbol;
            $.ajax({
                url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
                method: 'GET',
                success: function(data) {
                    let newPrice = parseFloat(data['Global Quote']['05. price']);
                    companies[i].price = newPrice.toFixed(2);
                    $('#price' + symbol).html("<span class='price'>" + newPrice.toFixed(2) + "</span>");
                },
                error: function(error) {
                    console.log('Error fetching data for symbol: ' + symbol, error);
                }
            });
        }
    };

    for (var key in companies) {
        var obj = companies[key];
        var symbol = '';
        var html = "<tr>";
        for (var prop in obj) {
            if (prop === 'symbol') {
                symbol = obj[prop];
            }
            if (prop !== 'price') {
                html += "<td id='" + prop + symbol + "'>";
                html += obj[prop];
                html += "</td>";
            } else {
                html += "<td id='" + prop + symbol + "'>";
                html += "<span class='price'>" + obj[prop] + "</span>";
                html += "</td>";
            }
            if (prop === 'shares') {
                html += "<td> <a href='#' class='buy' id='" + symbol + "Buy" + "'>buy 1 share</a> </td> <td> <a href='#' class='sell' id='" + symbol + "Sell" + "'>sell 1 share</a> </td>";
            }
        }
        html += "</tr>";
        $("#myPortfolio tbody").append(html);
    }

    setInterval(fetchRealTimePrices, 60000);

    setInterval(function() {
        for (var key in companies) {
            var obj = companies[key];
            var symbol = obj.symbol;
            var price = parseFloat(obj.price);
            var p = portfolioValue();
            var t = cashflow + p;

            $('#cashflow').html(cashflow);
            $('#portfolio').html(p);
            $('#netWorth').html(t);
            $('#cashflow1').html(cashflow);

            if (cashflow === 0) {
                $('a').each(function() {
                    var id = String($(this).attr('id'));
                    if (id.indexOf('Buy') > 0) {
                        $(this).hide();
                    }
                });
            }

            if (cashflow < price) {
                $('#' + symbol + 'Buy').hide();
            } else {
                $('#' + symbol + 'Buy').show();
            }

            var sharesOwned = parseFloat(obj.shares);
            if (sharesOwned > 0) {
                $('#' + symbol + 'Sell').show();
            } else {
                $('#' + symbol + 'Sell').hide();
            }
        }
    }, 1000);

    $(document).on('click', "a", function() {
        var id = String($(this).attr('id'));

        if (id.indexOf('Buy') > 0) {
            var symbol = id.substr(0, id.indexOf('Buy'));
            var thisObj = companies.find(company => company.symbol === symbol);

            if (cashflow > parseFloat(thisObj.price)) {
                cashflow -= parseFloat(thisObj.price);
                thisObj.shares = (parseFloat(thisObj.shares) + 1).toFixed(0);
                $('#shares' + symbol).html(thisObj.shares);
            }
        }

        if (id.indexOf('Sell') > 0) {
            var symbol = id.substr(0, id.indexOf('Sell'));
            var thisObj = companies.find(company => company.symbol === symbol);

            if (parseFloat(thisObj.shares) > 0) {
                cashflow += parseFloat(thisObj.price);
                thisObj.shares = (parseFloat(thisObj.shares) - 1).toFixed(0);
                $('#shares' + symbol).html(thisObj.shares);
            }
        }

        return false;
    });

    fetchRealTimePrices();
});

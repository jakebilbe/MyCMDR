//EXAMPLE JAVASCRIPT FILE
var soldPanel = document.getElementById('SELLDATA');
var boughtPanel = document.getElementById('BOUGHTDATA');

var data = TRADING.reverse();
for (var i = 0; i < data.length; i++) {
  if (data[i].buySell === "MarketSell") {
    soldPanel.innerHTML += prettyTrade(data[i]);
  } else {
    boughtPanel.innerHTML += prettyTrade(data[i]);
  }
}

function prettyTrade(data, sold) {
  var panel = '';
  if (data.buySell === "MarketBuy") {
    panel = '<tr>' +
      '<td>' + data.type + '</td>' +
      '<td>' + data.count + '</td>' +
      '<td>' + data.pricePaid.toLocaleString() + 'CR</td>' +
      '<td>-' + (data.pricePaid * data.count).toLocaleString() + 'CR</td>' +
      '</tr>';
  } else if (data.buySell === "MarketSell") {
    var color;
    if (Profit(data.priceSold, data.pricePaid, data.count) > 0) {
      color = ' class="success"';
    }
    panel = '<tr' + color + '>' +
      '<td>' + data.type + '</td>' +
      '<td>' + data.count + '</td>' +
      '<td>' + data.priceSold.toLocaleString() + 'CR</td>' +
      '<td>' + data.total.toLocaleString() + 'CR</td>' +
      '<td>' + Profit(data.priceSold, data.pricePaid, data.count).toLocaleString() + 'CR</td>' +
      '</tr>';
  }
  return panel;
}

function Profit(sellPrice, buyPrice, amount) {
  sellPrice = parseInt(sellPrice);
  buyPrice = parseInt(buyPrice);
  amount = parseInt(amount);
  var x = buyPrice;
  return ((sellPrice - buyPrice) * amount);
}

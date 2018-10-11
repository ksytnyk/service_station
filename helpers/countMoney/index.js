const formatDate = require('../../helpers/formatDate');

module.exports = function (dates, requests) {
    var fromDateChart = new Date(dates.fromDateChart);
    var toDateChart = new Date(dates.toDateChart);

    var requestsObj = {};
    while (fromDateChart <= toDateChart) {
        requestsObj[formatDate(fromDateChart, true)] = {
            count: 0,
            sum_cost: 0
        };
        fromDateChart.setDate(fromDateChart.getDate() + 1);
    }

    requests.map(item => {
        requestsObj[formatDate(item.createdAt, true)].sum_cost += item.cost;
        requestsObj[formatDate(item.createdAt, true)].count++;
    });

    var datesArr = [];
    var moneyArr = [];
    var quantityReq = [];

    for (var key in requestsObj) {
        datesArr.push(key);
        moneyArr.push(requestsObj[key].sum_cost);
        quantityReq.push(requestsObj[key].count);
    }

    return {
        dates: datesArr,
        money: moneyArr,
        quantity: quantityReq
    };
};
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

    requests.map(item=> {
        if(item.dataValues.payed){
            requestsObj[formatDate(item.dataValues.payedDate, true)].sum_cost += item.dataValues.cost;
            requestsObj[formatDate(item.dataValues.payedDate, true)].count++;
        }
    });

    var datesArr = [];
    var moneyArr = [];
    var countsArr = [];

    for (var key in requestsObj) {
        datesArr.push(key);
        moneyArr.push(requestsObj[key].sum_cost);
        countsArr.push(requestsObj[key].count)
    }

    return {
        dates: datesArr,
        conunts: countsArr,
        money: moneyArr
    };
};
const formatDate = require('../../helpers/formatDate');

module.exports = function (dates, tasks) {
    var fromDateChart = new Date(dates.fromDateChart);
    var toDateChart = new Date(dates.toDateChart);

    var requestsObj = {};
    while (fromDateChart <= toDateChart) {
        requestsObj[formatDate(fromDateChart, true)] = {
            count: 0,
            summ: 0
        };
        fromDateChart.setDate(fromDateChart.getDate() + 1);
    }

    tasks.map(item => {
        if(item.status === 3){
            requestsObj[formatDate(item.endTime, true)].summ += item.cost;
            requestsObj[formatDate(item.endTime, true)].count++;
        }
    });

    var datesArr = [];
    var moneyArr = [];
    var countsArr = [];

    for (var key in requestsObj) {
        datesArr.push(key);
        moneyArr.push(requestsObj[key].summ);
        countsArr.push(requestsObj[key].count)
    }

    return {
        dates: datesArr,
        conunts: countsArr,
        money: moneyArr
    };
};
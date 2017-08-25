const formatDate = require('../../helpers/formatDate');
const countStatuses = require('../../helpers/countStatuses');

module.exports = function (dates, requestHistory) {
    var fromDateChart = new Date(dates.fromDateChart);
    var toDateChart = new Date(dates.toDateChart);

    var requestDays = {};
    while (fromDateChart <= toDateChart) {
        requestDays[formatDate(fromDateChart, true)] = {};
        fromDateChart.setDate(fromDateChart.getDate() + 1);
    }

    requestHistory.forEach(item => {
        var formattedDay = formatDate(item.createdAt ,true);
        var uniqueKey = '' + item.requestID + item.status;

        if (requestDays[formattedDay] === undefined) {
            requestDays[formattedDay][uniqueKey] = item.dataValues;
        }
        else if (requestDays[formattedDay][uniqueKey] === undefined) {
            requestDays[formattedDay][uniqueKey] = item.dataValues;
        }
        else if (item.createdAt > requestDays[formattedDay][uniqueKey].createdAt){
            requestDays[formattedDay][uniqueKey] = item.dataValues;
        }
    });

    var datesArr = [];
    var newRequestsArr = [];
    var doneRequestsArr = [];
    var canceledRequestsArr = [];

    for (var key in requestDays) {
        var countStatusesArr = [];

        for (var key1 in requestDays[key]) {
            countStatusesArr.push(requestDays[key][key1]);
        }

        var result = countStatuses(countStatusesArr);

        datesArr.push(key.slice(-2));
        newRequestsArr.push(result[0]);
        doneRequestsArr.push(result[1]);
        canceledRequestsArr.push(result[2]);
    }

    return {
        dates: datesArr,
        newRequests: newRequestsArr,
        doneRequests: doneRequestsArr,
        canceledRequests: canceledRequestsArr,
    };
};
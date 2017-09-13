"use strict";

module.exports = function (requests) {

    let requestsObj = {};

    requests.map(item => {
        if (requestsObj[item.name] === undefined) {
            requestsObj[item.name] = item.dataValues;
        }
    });

    let requestsArr = [];
    for (let key in requestsObj) {
        requestsArr.push(requestsObj[key]);
    }

    return requestsArr;
};
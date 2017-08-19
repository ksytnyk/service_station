"use strict";

const formatDate = require('../formatDate/index');

module.exports = function (requests, tasks) {

    let requestsObj = {};

    requests.map(item => {
        if (requestsObj[item.id] === undefined) {
            requestsObj[item.id] = item.dataValues;
            requestsObj[item.id].startTime = formatDate(requestsObj[item.id].startTime);
            requestsObj[item.id].estimatedTime = formatDate(requestsObj[item.id].estimatedTime);
            requestsObj[item.id].user = item.dataValues.user.dataValues;
            requestsObj[item.id].tasks = [];
            if (new Date(item.estimatedTime) - new Date() > 0) {
                requestsObj[item.id].overdue = 0;
            } else {
                requestsObj[item.id].overdue = 1;
            }
        }
    });

    if (tasks) {
        tasks.map(item => {
            if (requestsObj[item.requestID] !== undefined) {
                item.dataValues.estimationTime = formatDate(item.dataValues.estimationTime);
                item.dataValues.startTime = formatDate(item.dataValues.startTime);
                item.dataValues.endTime = formatDate(item.dataValues.endTime);
                requestsObj[item.requestID].tasks.push(item.dataValues);
            }
        });
    }

    let requestsArr = [];
    for (let key in requestsObj) {
        requestsArr.push(requestsObj[key]);
    }

    return requestsArr;
};
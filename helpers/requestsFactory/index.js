"use strict";

const formatDate = require('../formatDate/index');

module.exports = function (requests, tasks, isHold, requestsHistory) {

    let requestsObj = {};

    requests.map(item => {
        if (requestsObj[item.id] === undefined) {
            requestsObj[item.id] = item.dataValues;
            requestsObj[item.id].startTime = formatDate(requestsObj[item.id].startTime);
            requestsObj[item.id].estimatedTime = formatDate(requestsObj[item.id].estimatedTime);
            requestsObj[item.id].user = item.dataValues.user.dataValues;
            requestsObj[item.id].transportTypeName = item.dataValues.transport_type.dataValues.transportTypeName;
            requestsObj[item.id].transportMarkkName = item.dataValues.transport_markk.dataValues.transportMarkkName;
            requestsObj[item.id].transportModelName = item.dataValues.transport_model.dataValues.transportModelName;
            requestsObj[item.id].transportType = item.dataValues.transport_type.dataValues.transportTypeName;
            requestsObj[item.id].tasks = [];
            requestsObj[item.id].requestsHistory = [];
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
                item.dataValues.startTime = formatDate(item.dataValues.startTime);
                item.dataValues.endTime = formatDate(item.dataValues.endTime);
                requestsObj[item.requestID].tasks.push(item.dataValues);
            }
        });
    }

    if (requestsHistory) {
        requestsHistory.map(item => {
            if (requestsObj[item.requestID] !== undefined) {
                item.dataValues.createdAt = formatDate(item.dataValues.createdAt);
                requestsObj[item.requestID].requestsHistory.push(item.dataValues);
            }
        });
    }

    if (isHold) {
        for (var key in requestsObj) {
            if (requestsObj[key].tasks.length === 0) {
                delete requestsObj[key];
            }
        }
    }

    let requestsArr = [];
    for (let key in requestsObj) {
        requestsArr.push(requestsObj[key]);
    }

    return requestsArr;
};
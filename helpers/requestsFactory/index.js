"use strict";

const formatDate = require('../formatDate/index');

module.exports = function (result) {

    let requests = {};

    result.map(item => {
        if (requests[item.request.id] === undefined) {
            requests[item.request.id] = item.request.dataValues;
            requests[item.request.id].user = item.request.dataValues.user.dataValues;
            requests[item.request.id].executor = item.planedExecutor.dataValues;
            requests[item.request.id].assigned = item.assignedUser.dataValues;
            requests[item.request.id].startTime = formatDate(requests[item.request.id].startTime);
            requests[item.request.id].estimatedTime = formatDate(requests[item.request.id].estimatedTime);
            requests[item.request.id].tasks = [];
        }

        let task = item.dataValues;
        task.estimationTime = formatDate(task.estimationTime);
        task.startTime = formatDate(task.startTime);
        task.endTime = formatDate(task.endTime);
        delete task.request;

        requests[item.request.id].tasks.push(task);
    });

    let newArray = [];
    for (let key in requests) {
        newArray.push(requests[key]);
    }

    return newArray;
};
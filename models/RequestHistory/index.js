"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeRequestHistoryTable = {
    requestID: {
        type: Sequelize.INTEGER,
        field: 'request_id'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
};

const optionRequestHistoryTable = {
    freezeTableName: true,
};

let RequestHistory = sequelize.define('request_history', describeRequestHistoryTable, optionRequestHistoryTable);

RequestHistory.sync();

RequestHistory.getAllRequestHistory = function (data) {
    return new Promise((resolve, reject) => {
        RequestHistory
            .findAll({
                where: {
                    createdAt: {
                        $between: [new Date(data.fromDateChart), new Date(data.toDateChart)]
                    },
                    status: [1, 3, 5]
                },
                attributes: ['requestID', 'status', 'createdAt']
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

RequestHistory.createRequestHistory = function (data) {
    return new Promise((resolve, reject) => {
        RequestHistory
            .build(data)
            .save()
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

module.exports = RequestHistory;

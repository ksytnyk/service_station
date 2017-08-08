"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeRequestTable = {
    assignedUserID: {
        type: Sequelize.INTEGER,
        field: 'assigned_user_id'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    },
    startTime: {
        type: Sequelize.DATETIME,
        field: 'start_time'
    },
    estimatedTime: {
        type: Sequelize.DATETIME,
        field: 'estimated_time'
    }
};

const optionRequestTable = {
    freezeTableName: true,
};

let Request = sequelize.define('request', describeRequestTable, optionRequestTable);

Request.sync();

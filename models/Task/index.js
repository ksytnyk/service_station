"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTaskTable = {
    requestID: {
        type: Sequelize.INTEGER,
        field: 'request_id'
    },
    assignedUserID: {
        type: Sequelize.INTEGER,
        field: 'assigned_user_id'
    },
    planedExecutorID: {
        type: Sequelize.INTEGER,
        field: 'planed_executor_id'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    },
    estimationTime: {
        type: Sequelize.DATETIME,
        field: 'estimation_time'
    },
    startTime: {
        type: Sequelize.DATETIME,
        field: 'start_time'
    },
    endTime: {
        type: Sequelize.DATETIME,
        field: 'end_time'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
    typeID: {
        type: Sequelize.INTEGER,
        field: 'type_id'
    },
    part: {
        type: Sequelize.TEXT,
        field: 'part'
    },
    customerParts: {
        type: Sequelize.TEXT,
        field: 'customer_parts'
    },
    needBuyParts: {
        type: Sequelize.TEXT,
        field: 'need_buy_parts'
    }
};

const optionTaskTable = {
    freezeTableName: true,
};

let Task = sequelize.define('task', describeTaskTable, optionTaskTable);

Task.sync();

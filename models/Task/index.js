"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const Request = require('../Request');

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
        type: Sequelize.DATE,
        field: 'estimation_time'
    },
    startTime: {
        type: Sequelize.DATE,
        field: 'start_time'
    },
    endTime: {
        type: Sequelize.DATE,
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

Task.belongsTo(Request, {foreignKey: 'assigned_user_id'});

Task.sync();

module.exports = Task;
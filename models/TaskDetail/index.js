"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTaskDetailTable = {
    taskID: {
        type: Sequelize.INTEGER,
        field: 'task_id'
    },
    detailID: {
        type: Sequelize.INTEGER,
        field: 'detail_id'
    },
    detailQuantity: {
        type: Sequelize.INTEGER,
        field: 'detail_quantity'
    }
};

const optionTaskDetailTable = {
    freezeTableName: true,
};

let TaskDetail = sequelize.define('task_detail', describeTaskDetailTable, optionTaskDetailTable);

module.exports = TaskDetail;
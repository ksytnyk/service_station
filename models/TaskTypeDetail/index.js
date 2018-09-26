"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTaskTypeDetailTable = {
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
    },
    detailType: {
        type: Sequelize.INTEGER,
        field: 'detail_type',
        defaultValue: 1
    }
};

const optionTaskTypeDetailTable = {
    freezeTableName: true,
};

let TaskTypeDetail = sequelize.define('task_type_detail', describeTaskTypeDetailTable, optionTaskTypeDetailTable);

module.exports = TaskTypeDetail;
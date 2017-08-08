"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTaskTypeTable = {
    typeName: {
        type: Sequelize.STRING,
        field: 'type_name'
    },
    carTypeID: {
        type: Sequelize.INTEGER,
        field: 'car_type_id'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    }
};

const optionTaskTypeTable = {
    freezeTableName: true,
};

let TaskType = sequelize.define('task_type', describeTaskTypeTable, optionTaskTypeTable);

TaskType.sync();

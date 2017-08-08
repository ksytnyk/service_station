"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeCarTypeTable = {
    carName: {
        type: Sequelize.STRING,
        field: 'car_name'
    },
};

const optionCarTypeTable = {
    freezeTableName: true,
};

let CarType = sequelize.define('car_type', describeCarTypeTable, optionCarTypeTable);

CarType.sync();

"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeCarMarkkTable = {
    markkName: {
        type: Sequelize.STRING,
        field: 'markk_name'
    }
};



const optionCarMarkkTable = {
    freezeTableName: true,
};

let CarMarkk = sequelize.define('car_type', describeCarMarkkTable, optionCarMarkkTable);

CarMarkk.sync();

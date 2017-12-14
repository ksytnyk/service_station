"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeDetailTable = {
    detailName: {
        type: Sequelize.STRING,
        field: 'detail_name'
    },
    detailPrice: {
        type: Sequelize.FLOAT,
        field: 'detail_price'
    },
    transportTypeID: {
        type: Sequelize.INTEGER,
        field: 'transport_type_id',
        defaultValue: null
    },
    transportMarkkID: {
        type: Sequelize.INTEGER,
        field: 'transport_markk_id',
        defaultValue: null
    },
    transportModelID: {
        type: Sequelize.INTEGER,
        field: 'transport_model_id',
        defaultValue: null
    },
    missingDetail: {
        type: Sequelize.BOOLEAN,
        field: 'missing_detail'
    },
    clientDetail: {
        type: Sequelize.BOOLEAN,
        field: 'client_detail'
    }
};

const optionDetailTable = {
    freezeTableName: true,
};

let Detail = sequelize.define('detail', describeDetailTable, optionDetailTable);

module.exports = Detail;
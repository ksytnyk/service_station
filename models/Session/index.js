"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeSessionTable = {
    sessionState: {
        type: Sequelize.INTEGER,
        field: 'session_state'
    },
    sessionStartTime: {
        type: Sequelize.DATE,
        field: 'session_start_time'
    },
    sessionEndTime: {
        type: Sequelize.DATE,
        field: 'session_end_time'
    }
};

const optionSessionTable = {
    freezeTableName: true,
};

let Session = sequelize.define('session', describeSessionTable, optionSessionTable);

Session.sync();

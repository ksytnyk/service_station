"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const UserType = sequelize.define('user_type', {
    userTypeName: {
        type: Sequelize.STRING,
        field: 'user_type_name'
    }
}, {
    freezeTableName: true
});

module.exports = UserType;
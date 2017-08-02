"use strict";

var Sequelize = require('sequelize');
var sequelize = require('../connection');

var TypeUser = sequelize.define('type_user', {
    nameTypeUser: {
        type: Sequelize.STRING,
        field: 'name_type_user'
    }
}, {
    freezeTableName: true
});

module.exports = TypeUser;
"use strict";

var Sequelize = require('sequelize');
var config = require('../../config/default.json');

module.exports = new Sequelize(config.postgreSQL.database, config.postgreSQL.username, config.postgreSQL.password, {
    host: config.postgreSQL.host,
    dialect: config.postgreSQL.dialect,
    pool: {
        max: config.postgreSQL.pool.max,
        min: config.postgreSQL.pool.min,
        idle: config.postgreSQL.pool.idle
    }
});




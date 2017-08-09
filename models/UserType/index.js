"use strict";

var Sequelize = require('sequelize');
var sequelize = require('../connection');

var UserType = sequelize.define('user_type', {
    userTypeName: {
        type: Sequelize.STRING,
        field: 'user_type_name'
    }
}, {
    freezeTableName: true
});

// UserType.sync({force: true}).then(() => {
//     UserType.bulkCreate([
//         {userTypeName: 'Admin'},
//         {userTypeName: 'Moderator'},
//         {userTypeName: 'Executor'},
//         {userTypeName: 'StoreKeeper'},
//         {userTypeName: 'Customer'}
//     ]);
// });

module.exports = UserType;
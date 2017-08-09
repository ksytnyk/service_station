"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const UserType = require('../UserType');

const describeUserTable = {
    userName: {
        type: Sequelize.STRING,
        field: 'user_name'
    },
    userSurname: {
        type: Sequelize.STRING,
        field: 'user_surname'
    },
    userCompanyName: {
        type: Sequelize.TEXT,
        field: 'user_company_name',
    },
    userAddress: {
        type: Sequelize.STRING,
        field: 'user_address',
    },
    userPhone: {
        type: Sequelize.STRING,
        field: 'user_phone',
    },
    userLogin: {
        type: Sequelize.STRING,
        field: 'user_login',
        unique: true
    },
    userEmail: {
        type: Sequelize.STRING,
        field: 'user_email',
        unique: true
    },
    userTypeID: {
        type: Sequelize.INTEGER,
        field: 'user_type_id'
    },
    userPassword: {
        type: Sequelize.STRING,
        field: 'user_password',
    }
};

const optionUserTable = {
    freezeTableName: true,
    indexes: [
        {
            unique: true,
            fields: ['user_login', 'user_email']
        }
    ]
};

let User = sequelize.define('users', describeUserTable, optionUserTable);

User.belongsTo(UserType, {foreignKey: 'user_type_id'});

// User.sync({force: true}).then(() => {
//
//     User.bulkCreate([
//         {
//             userLogin: 'admin',
//             userEmail: 'admin@admin.com',
//             userPassword: '11111',
//             userTypeID: '1'
//         },
//         {
//             userLogin: 'm',
//             userEmail: 'm@admin.com',
//             userPassword: '11',
//             userTypeID: '2'
//         },
//         {
//             userLogin: 'c',
//             userEmail: 'c@admin.com',
//             userPassword: '11',
//             userTypeID: '5'
//         }
//     ]).catch(err => console.log(err));
// });


module.exports = {

    getUserById: function (id) {
        return new Promise((resolve, reject) => {
            User
                .findById(id)
                .then(function (res) {
                    resolve(res);
                })
                .catch(function (err) {
                    reject(err);
                })
        })
    },

    getCurrentUser: function (login) {
        return new Promise((resolve, reject) => {
            User
                .findOne({
                    where: {
                        user_login: login
                    }
                })
                .then(function (res) {
                    resolve(res)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    },

    getAllUsers: function () {
        return new Promise((resolve, reject) => {
            User
                .findAll({
                    include: [
                        {model: UserType}
                    ]
                })
                .then(users => {
                    resolve(users);
                })
                .catch(err => {
                    console.warn(err);
                    reject(err);
                });

        });
    },

    getModeratorUsers: function () {
        return new Promise((resolve, reject) => {
            User
                .findAll({
                    where: {
                        user_type_id: 5
                    },
                    include: [
                        {model: UserType}
                    ]
                })
                .then(users => {
                    resolve(users);
                })
                .catch(err => {
                    console.warn(err);
                    reject(err);
                });
        });
    },

    createUser: function (user) {
        return new Promise((resolve, reject) => {
            User
                .build(user)
                .save()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.warn(error);
                    reject(err);
                });
        });
    },

    updateUser: function (userID, params) {
        return new Promise((resolve, reject) => {
            User
                .update(
                    params,
                    {where: {id: userID}})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    console.warn(err);
                    reject(err);
                });
        });
    },

    deleteUser: function (idUser) {
        return new Promise((resolve, reject) => {
            User
                .destroy({
                    where: {
                        id: Number(idUser)
                    }
                }).then(result => {
                resolve(result);
            }).catch(err => {
                console.warn(err);
                reject(err);
            });
        });
    }
};
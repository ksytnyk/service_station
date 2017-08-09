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

User.getUserById = function (id) {
    return new Promise((resolve, reject) => {
        User
            .findById(id)
            .then(function (res) {
                resolve(res);
            })
            .catch(function (err) {
                reject(err);
            });
    });
};

User.getCurrentUser = function (login) {
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
            });
    })
};

User.getAllUsers = function () {
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
};

User.getModeratorUsers = function () {
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
};

User.createUser = function (user) {
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
};

User.updateUser = function (userID, params) {
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
};

User.deleteUser = function (idUser) {
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
};

module.exports = User;
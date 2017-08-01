"use strict";

const Sequelize = require('sequelize'), sequelize = require('../connection');

const TypeUser = require('../TypeUser');

const describeUserTable = {
    loginUser: {
        type: Sequelize.STRING,
        field: 'login_user',
        unique: true
    },
    passwordUser: {
        type: Sequelize.STRING,
        field: 'password_user',
    },
    emailUser: {
        type: Sequelize.STRING,
        field: 'email_user',
        unique: true
    },
    firstName: {
        type: Sequelize.STRING,
        field: 'first_name'
    },
    lastName: {
        type: Sequelize.STRING,
        field: 'last_name'
    },
    idTypeUser: {
        type: Sequelize.INTEGER,
        field: 'id_type_user'
    }
};

const optionUserTable = {
    freezeTableName: true,
    indexes: [
        {
            unique: true,
            fields: ['login_user', 'email_user']
        }
    ]
};

let User = sequelize.define('users', describeUserTable, optionUserTable);

User.belongsTo(TypeUser, {foreignKey: 'id_type_user'});

module.exports = {

    userModel: User,

    getCurrentUser: function (params) {
        let queryParams;

        if ("id_user" in params) {
            queryParams = {id: params.id_user};
        } else if ("login" in params && "password" in params) {
            queryParams = {login_user: params.login, password_user: params.password};
        }

        return new Promise((resolve, reject) => {
            User.find({
                where: queryParams,
                include: [
                    {model: TypeUser}
                ]
            }).then((currentUser) => {
                if (currentUser) {
                    resolve(currentUser.dataValues);
                } else {
                    throw new Error("Not find user.");
                }
            }).catch(err => {
                console.warn(err);
                reject(err);
            });
        });
    },

    getAllUsers: function () {
        return new Promise((resolve, reject) => {
            User.findAll({
                include: [
                    {model: TypeUser}
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
                .build({
                    loginUser: user.login_user,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    passwordUser: user.password,
                    emailUser: user.email,
                    idTypeUser: Number(user.id_type_user)
                })
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

    updateUser: function (idUser, params) {
        return new Promise((resolve, reject) => {
            User.update(
                params,
                {where: {id: idUser}})
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
            User.destroy({
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
"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');
const Task = require('../Task');

const describeRequestTable = {
    customerID: {
        type: Sequelize.INTEGER,
        field: 'customer_id'
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    comment: {
        type: Sequelize.STRING,
        field: 'comment'
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        field: 'status'
    },
    startTime: {
        type: Sequelize.DATE,
        field: 'start_time'
    },
    estimatedTime: {
        type: Sequelize.DATE,
        field: 'estimated_time'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    },
    createdBy: {
        type: Sequelize.INTEGER,
        field: 'created_by'
    }
};

const optionRequestTable = {
    freezeTableName: true,
};

let Request = sequelize.define('request', describeRequestTable, optionRequestTable);

Request.belongsTo(User, {foreignKey: 'customerID'});

Request.sync();

// Request.getAllRequests = function () {
//     return new Promise((resolve, reject) => {
//         Request
//             .findAll({
//                 include: [
//                     {model: User}
//                 ]
//             })
//             .then(requests => {
//                 resolve(requests);
//             })
//             .catch(err => {
//                 console.warn(err);
//                 reject(err);
//             });
//
//     });
// };

Request.getRequestById = function (id) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    id: id
                },
                include: [
                    {
                        model: User
                    }
                ]
            })
            .then(request => {
                resolve(request);
            })
            .catch(error => {
                reject(error);
            });
    });
};

Request.createRequest = function (request) {
    return new Promise((resolve, reject) => {
        Request
            .build(request)
            .save()
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

Request.getRequestByAssignedId = function (customerID) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    customer_id: customerID
                }
            })
            .then(result => {
                resolve(result)
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            })
    })
};

Request.updateRequest = function (requestID, params) {
    return new Promise((resolve, reject) => {
        Request
            .update(
                params,
                {where: {id: requestID}})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.deleteRequest = function (idRequest) {
    return new Promise((resolve, reject) => {
        Request
            .destroy({
                where: {
                    id: Number(idRequest)
                }
            })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.changeStatus = function (idRequest, status) {
    return new Promise((resolve, reject) => {
        Request
            .update({
                    status: status
                },
                {
                    where: {
                        id: idRequest
                    }
                })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    })
};

module.exports = Request;

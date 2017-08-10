"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');

const describeRequestTable = {
    assignedUserID: {
        type: Sequelize.INTEGER,
        field: 'assigned_user_id'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'status'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    },
    startTime: {
        type: Sequelize.DATE,
        field: 'start_time'
    },
    estimatedTime: {
        type: Sequelize.DATE,
        field: 'estimated_time'
    }
};

const optionRequestTable = {
    freezeTableName: true,
};

let Request = sequelize.define('request', describeRequestTable, optionRequestTable);

Request.belongsTo(User, {foreignKey: 'assignedUserID'});

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
            }).then(result => {
            resolve(result);
        }).catch(err => {
            console.warn(err);
            reject(err);
        });
    });
};

module.exports = Request;

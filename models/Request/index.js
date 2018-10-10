"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');
const Task = require('../Task');
const RequestHistory = require('../RequestHistory');
const status = require('../../constants/status');
const requestTypesFactory = require('../../helpers/requestTypesFactory');
const transportType = require('../TransportType');
const transportMarkk = require('../TransportMarkk');
const transportModel = require('../TransportModel');

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
    hadStarted: {
        type: Sequelize.BOOLEAN,
        field: 'had_started',
        defaultValue: false
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
        field: 'cost',
        defaultValue: 0
    },
    createdBy: {
        type: Sequelize.INTEGER,
        field: 'created_by'
    },
    transportTypeID: {
        type: Sequelize.INTEGER,
        field: 'transport_type_id'
    },
    transportMarkkID: {
        type: Sequelize.INTEGER,
        field: 'transport_markk_id'
    },
    transportModelID: {
        type: Sequelize.INTEGER,
        field: 'transport_model_id'
    },
    hadDeleted: {
        type: Sequelize.BOOLEAN,
        field: 'had_deleted',
        defaultValue: false
    },
    payed: {
        type: Sequelize.BOOLEAN,
        field: 'payed',
        defaultValue: false
    },
    giveOut: {
        type: Sequelize.BOOLEAN,
        field: 'give_out',
        defaultValue: false
    },
    payedDate: {
        type: Sequelize.DATE,
        field: 'payed_date',
        defaultValue: null
    }
};

const optionRequestTable = {
    freezeTableName: true,
};

let Request = sequelize.define('request', describeRequestTable, optionRequestTable);

Request.belongsTo(User, {foreignKey: 'customerID'});
Request.belongsTo(transportType, {foreignKey: 'transportTypeID'});
Request.belongsTo(transportMarkk, {foreignKey: 'transportMarkkID'});
Request.belongsTo(transportModel, {foreignKey: 'transportModelID'});
Request.sync();

Request.getAllRequests = function (findBy) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                include: [
                    {
                        model: User
                    },
                    {
                        model: transportType
                    },
                    {
                        model: transportMarkk
                    },
                    {
                        model: transportModel
                    }
                ],
                where: findBy
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.getAllRequestsByCustomerId = function (findBy) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: findBy,
                include: [
                    {
                        model: User
                    },
                    {
                        model: transportType
                    },
                    {
                        model: transportMarkk
                    },
                    {
                        model: transportModel
                    }
                ]
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.getRequestById = function (id) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    id: id
                },
                include: [{
                    model: User
                },
                {
                    model: transportType
                },
                {
                    model: transportMarkk
                },
                {
                    model: transportModel
                }]
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
                var data = {
                    requestID: result.id,
                    status: result.status
                };

                RequestHistory
                    .createRequestHistory(data)
                    .then(() => {
                        resolve(result);
                    })
                    .catch(err => {
                        console.warn(err);
                        reject(err);
                    });
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

Request.changeStatus = function (idRequest, params) {
    return new Promise((resolve, reject) => {
        if (params.status == status.PROCESSING) {
            params.hadStarted = true;
        }

        Request
            .update(
                params,
                {
                    where: {
                        id: idRequest
                    }
                })
            .then(result => {
                var data = {
                    requestID: idRequest,
                    status: params.status,
                    comment: params.comment
                };

                RequestHistory
                    .createRequestHistory(data)
                    .then(() => {
                        resolve(result);
                    })
                    .catch(err => {
                        console.warn(err);
                        reject(err);
                    });
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    })
};

Request.getAllRequestsForChart = function (data) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                attributes: ['cost', 'createdAt', 'status'],
                where: {
                    createdAt: {
                        $between: [new Date(data.fromDateChart), new Date(data.toDateChart)]
                    }
                }
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.getAllPayedRequestForChart = (data) => {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                attributes: ['cost', 'createdAt', 'status', 'payed', 'payedDate'],
                where: {
                    createdAt: {
                        $between: [new Date(data.fromDateChart), new Date(data.toDateChart)]
                    },
                    payed: true
                }
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.getRequests = function (carMarkk, carModel) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    carMarkk: carMarkk,
                    carModel: carModel
                }
            })
            .then(requests => {
                resolve(requests);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Request.getRequestsWithoutCondition = function () {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                attributes: ['id','name']
            })
            .then(requests => {
                var result = requestTypesFactory(requests);

                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

module.exports = Request;

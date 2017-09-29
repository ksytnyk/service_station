"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');
const Task = require('../Task');
const RequestHistory = require('../RequestHistory');
const status = require('../../constants/status');
const requestTypesFactory = require('../../helpers/requestTypesFactory');

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
    typeOfCar: {
        type: Sequelize.STRING,
        field: 'type_of_car'
    },
    carMarkk: {
        type: Sequelize.STRING,
        field: 'car_markk'
    },
    carModel: {
        type: Sequelize.STRING,
        field: 'car_model'
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
    }
};

const optionRequestTable = {
    freezeTableName: true,
};

let Request = sequelize.define('request', describeRequestTable, optionRequestTable);

Request.belongsTo(User, {foreignKey: 'customerID'});

Request.sync();

Request.getAllRequests = function (findBy) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                include: {
                    model: User
                },
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

Request.getAllRequestsByCustomerId = function (customerID) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    customerID: customerID
                },
                include: {
                    model: User
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

Request.getRequestById = function (id) {
    return new Promise((resolve, reject) => {
        Request
            .findAll({
                where: {
                    id: id
                },
                include: {
                    model: User
                }
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
                    status: params.status
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

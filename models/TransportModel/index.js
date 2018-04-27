"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTransportModel = {
    transportModelName: {
        type: Sequelize.STRING,
        field: 'transport_model_name'
    },
    transportMarkkID: {
        type: Sequelize.INTEGER,
        field: 'transport_markk_id'
    }
};

const optionTransportModel = {
    freezeTableName: true,
};

let TransportModel = sequelize.define('transport_model', describeTransportModel, optionTransportModel);

TransportModel.sync();

TransportModel.getAllTransportModel = function () {
    return new Promise((resolve, reject) => {
        TransportModel
            .findAll()
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TransportModel.getTransportModelOfMarkkID = function (transportMarkkID) {
    return new Promise((resolve, reject) => {
        TransportModel
            .findAll({
                where: {
                    transportMarkkID: transportMarkkID
                }
            })
            .then(markks => {
                resolve(markks);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TransportModel.createTransportModel = function (data) {
    return new Promise((resolve, reject) => {
        TransportModel
            .findAll({
                where: data
            })
            .then(result => {
                if (result.length === 0) {
                    TransportModel
                        .build(data)
                        .save()
                        .then(transportModel => {
                            resolve({
                                transportModel: transportModel,
                                hasResult: true
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                }
                else {
                    resolve({
                        hasResult: false
                    });
                }
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TransportModel.updateTransportModel = function (transportModelID, data) {
    return new Promise((resolve, reject) => {
        TransportModel
            .update(
                data,
                {where: {id: transportModelID}})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

TransportModel.deleteTransportModel = function (transportModelID) {
    return new Promise((resolve, reject) => {
        TransportModel
            .destroy({
                where: {
                    id: Number(transportModelID)
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

module.exports = TransportModel;
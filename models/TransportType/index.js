"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTransportType = {
    transportTypeName: {
        type: Sequelize.STRING,
        field: 'transport_type_name'
    }
};

const optionTransportType = {
    freezeTableName: true,
};

let TransportType = sequelize.define('transport_type', describeTransportType, optionTransportType);

TransportType.sync();

TransportType.getAllTransportType = function () {
    return new Promise((resolve, reject) => {
        TransportType
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

TransportType.createTransportType = function (data) {
    return new Promise((resolve, reject) => {
        TransportType
            .build(data)
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

TransportType.updateTransportType = function (transportTypeID, data) {
    return new Promise((resolve, reject) => {
        TransportType
            .update(
                data,
                {where: {id: transportTypeID}})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

TransportType.deleteTransportType = function (transportTypeID) {
    return new Promise((resolve, reject) => {
        TransportType
            .destroy({
                where: {
                    id: Number(transportTypeID)
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

module.exports = TransportType;
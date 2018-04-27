"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const TransportType = require('../TransportType');

const describeTransportMarkk = {
    transportMarkkName: {
        type: Sequelize.STRING,
        field: 'transport_markk_name'
    },
    transportTypeID: {
        type: Sequelize.INTEGER,
        field: 'transport_type_id'
    }
};

const optionTransportMarkk = {
    freezeTableName: true,
};

let TransportMarkk = sequelize.define('transport_markk', describeTransportMarkk, optionTransportMarkk);

TransportMarkk.belongsTo(TransportType, {foreignKey: 'transportTypeID'});

TransportMarkk.sync();

TransportMarkk.getAllTransportMarkks = function () {
    return new Promise((resolve, reject) => {
        TransportMarkk
            .findAll()
            .then(markks => {
                resolve(markks);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TransportMarkk.getTransportMarkksOfTypeID = function (transportTypeID) {
    return new Promise((resolve, reject) => {
        TransportMarkk
            .findAll({
                where: {
                    transportTypeID: transportTypeID
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

TransportMarkk.createTransportMarkk = function (data) {
    return new Promise((resolve, reject) => {
        TransportMarkk
            .findAll({
                where: data
            })
            .then(result => {
                if (result.length === 0) {
                    TransportMarkk
                        .build(data)
                        .save()
                        .then(transportMarkk => {
                            resolve({
                                transportMarkk: transportMarkk,
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

TransportMarkk.updateTransportMarkk = function (transportMarkkID, data) {
    return new Promise((resolve, reject) => {
        TransportMarkk
            .update(
                data,
                {where: {id: transportMarkkID}})
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

TransportMarkk.deleteTransportMarkk = function (transportMarkkID) {
    return new Promise((resolve, reject) => {
        TransportMarkk
            .destroy({
                where: {
                    id: Number(transportMarkkID)
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

module.exports = TransportMarkk;
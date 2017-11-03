"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const TransportType = require('../TransportType');

const describeTransportMarkk = {
    markkName: {
        type: Sequelize.STRING,
        field: 'transport_markk_name'
    },
    typeID: {
        type: Sequelize.INTEGER,
        field: 'transport_type_id'
    }
};

const optionTransportMarkk = {
    freezeTableName: true,
};

let TransportMarkk = sequelize.define('transport_markk', describeTransportMarkk, optionTransportMarkk);

TransportMarkk.belongsTo(TransportType, {foreignKey: 'typeID'});

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
                    typeID: transportTypeID
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
        console.log('looool');
        TransportMarkk
            .count({
                where: {
                    markkName: data.markkName
                }
            })
            .then(count => {
                console.log('resss', count);
                if(count===0) {
                    console.log('OKKK!!');
                    TransportMarkk
                        .build(data)
                        .save()
                        .then(result => {
                            resolve({
                                result: [result],
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
                        taskTypes: count,
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
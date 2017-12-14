"use strict";

const Models = {};

//getModels
Models.Detail = require('../Detail');
Models.TaskDetail = require('./index');
Models.Task = require('../Task');
Models.Request = require('../Request');
Models.TransportType = require('../TransportType');
Models.TransportMarkk = require('../TransportMarkk');
Models.TransportModel = require('../TransportModel');

//Relations
Models.TaskDetail.belongsTo(Models.Task, {foreignKey: 'taskID'});
Models.TaskDetail.belongsTo(Models.Detail, {foreignKey: 'detailID'});
Models.Detail.belongsTo(Models.TransportType, {foreignKey: 'transportTypeID'});
Models.Detail.belongsTo(Models.TransportMarkk, {foreignKey: 'transportMarkkID'});
Models.Detail.belongsTo(Models.TransportModel, {foreignKey: 'transportModelID'});

//Creating in DB
Models.Detail.sync();
Models.TaskDetail.sync();

//setMethods

// --- Detail Model ---
Models.Detail.getAll = () => {
    return new Promise((resolve, reject) => {
        Models.Detail
            .findAll({
                include: [
                    {
                        model: Models.TransportType
                    },
                    {
                        model: Models.TransportMarkk
                    },
                    {
                        model: Models.TransportModel
                    }
                ]
            })
            .then(Detail => {
                resolve(Detail);
            })
            .catch((err) => {
                reject(err);
            })
    })
};

Models.Detail
    .getAll()
    .then((Detail) => {
        console.log(Detail);
    })
    .catch((err) => {
        console.error(err);
    });

module.exports = Models;
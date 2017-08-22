"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const describeTaskTypeTable = {
    typeName: {
        type: Sequelize.STRING,
        field: 'type_name'
    },
    carMarkk: {
        type: Sequelize.STRING,
        field: 'car_markk'
    },
    carModel: {
        type: Sequelize.STRING,
        field: 'car_model'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    }
};

const optionTaskTypeTable = {
    freezeTableName: true,
};

let TaskType = sequelize.define('task_type', describeTaskTypeTable, optionTaskTypeTable);

TaskType.sync();

TaskType.getTaskTypesByCar = function (carMarkk, carModel) {
    return new Promise((resolve, reject) => {
        TaskType
            .findAll({
                where: {
                    carMarkk: carMarkk,
                    carModel: carModel
                }
            })
            .then(taskTypes => {
                resolve(taskTypes);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TaskType.createTaskType = function (taskType) {
    return new Promise((resolve, reject) => {
        TaskType
            .count({
                where: {
                    typeName: taskType.typeName,
                    carMarkk: taskType.carMarkk,
                    carModel: taskType.carModel
                }
            })
            .then(count => {
                if (count === 0) {
                    TaskType
                        .build(taskType)
                        .save()
                        .then(taskTypes => {
                            resolve(taskTypes);
                        })
                        .catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                } else {
                    resolve();
                }
            })
    });
};

TaskType.getTaskTypeByID = function (taskTypeID) {
    return new Promise((resolve, reject) => {
        TaskType
            .findById(taskTypeID)
            .then(taskType => {
                resolve(taskType);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

module.exports = TaskType;
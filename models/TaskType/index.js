"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');

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
    },
    estimationTime: {
        type: Sequelize.FLOAT,
        field: 'estimation_time'
    },
    planedExecutorID: {
        type: Sequelize.INTEGER,
        field: 'planed_executor_id'
    },
};

const optionTaskTypeTable = {
    freezeTableName: true,
};

let TaskType = sequelize.define('task_type', describeTaskTypeTable, optionTaskTypeTable);

TaskType.belongsTo(User, {foreignKey: 'planedExecutorID', as: 'planedExecutor'});

TaskType.sync();

TaskType.getAllTaskType = function () {
    return new Promise((resolve, reject) => {
        TaskType
            .findAll({
                include: {
                    model: User,
                    as: 'planedExecutor'
                }
            })
            .then(tasks => {
                resolve(tasks);
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TaskType.updateTaskType = function (taskTypeID, params) {
    return new Promise((resolve, reject) => {
        TaskType
            .update(
                params,
                {
                    where: {
                    id: taskTypeID
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

TaskType.deleteTaskType = function (taskTypeID) {
    return new Promise((resolve, reject) => {
        TaskType
            .destroy({
                where: {
                    id: taskTypeID
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
"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');
const taskTypesFactory = require('../../helpers/taskTypesFactory');

const describeTaskTypeTable = {
    typeName: {
        type: Sequelize.STRING,
        field: 'type_name'
    },
    typeOfCar: {
        type: Sequelize.STRING,
        field: 'type_of_car',
        defaultValue: ''
    },
    carMarkk: {
        type: Sequelize.STRING,
        field: 'car_markk',
        defaultValue: ''
    },
    carModel: {
        type: Sequelize.STRING,
        field: 'car_model',
        defaultValue: ''
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

TaskType.getTaskTypesByCarAttributes = function (typeOfCar, carMarkk, carModel) {
    return new Promise((resolve, reject) => {
        TaskType
            .findAll({
                where: {
                    typeOfCar: '',
                    carMarkk: '',
                    carModel: ''
                }
            })
            .then(taskTypesNoneAttributes => {
                TaskType
                    .findAll({
                        where: {
                            typeOfCar: typeOfCar,
                            carMarkk: '',
                            carModel: ''
                        }
                    })
                    .then(taskTypesOneAttributes => {
                        TaskType
                            .findAll({
                                where: {
                                    typeOfCar: typeOfCar,
                                    carMarkk: carMarkk,
                                    carModel: ''
                                }
                            })
                            .then(taskTypesTwoAttributes => {
                                TaskType
                                    .findAll({
                                        where: {
                                            typeOfCar: typeOfCar,
                                            carMarkk: carMarkk,
                                            carModel: carModel
                                        }
                                    })
                                    .then(taskTypesAllAttributes => {
                                        var result = taskTypesFactory(taskTypesNoneAttributes, taskTypesOneAttributes, taskTypesTwoAttributes, taskTypesAllAttributes);

                                        resolve(result);
                                    })
                                    .catch(error => {
                                        console.warn(error);
                                        reject(error);
                                    });
                            })
                            .catch(error => {
                                console.warn(error);
                                reject(error);
                            });
                    })
                    .catch(error => {
                        console.warn(error);
                        reject(error);
                    });
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TaskType.createTaskType = function (taskType) {
    return new Promise((resolve, reject) => {
        var search = {
            typeName: '',
            typeOfCar: '',
            carModel: '',
            carMarkk: ''
        };

        if (taskType.typeName) {
            search.typeName = taskType.typeName;
        }
        if (taskType.typeOfCar) {
            search.typeOfCar = taskType.typeOfCar;
        }
        if (taskType.carModel) {
            search.carModel = taskType.carModel;
        }
        if (taskType.carMarkk) {
            search.carMarkk = taskType.carMarkk;
        }

        TaskType
            .findAll({
                where: search
            })
            .then(result => {

                if (result.length === 0 && taskType.typeID) {
                    TaskType
                        .build(taskType)
                        .save()
                        .then(taskTypes => {
                            resolve({
                                taskTypes: [taskTypes],
                                hasResult: true
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                } else {
                    resolve({
                        taskTypes: result,
                        hasResult: false
                    });
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
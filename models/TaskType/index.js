"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');
const User = require('../User');
const TransportType = require('../TransportType');
const TransportMarkk = require('../TransportMarkk');
const TransportModel = require('../TransportModel');
const TaskDetail = require('../TaskDetail');
const Detail = require('../Detail');

const taskTypesFactory = require('../../helpers/taskTypesFactory');

const describeTaskTypeTable = {
    typeName: {
        type: Sequelize.STRING,
        field: 'type_name'
    },
    articleCode: {
        type: Sequelize.STRING,
        field: 'article_code',
        defaultValue: null
    },
    typeOfCar: {
        type: Sequelize.INTEGER,
        field: 'type_of_car',
        defaultValue: null
    },
    carMarkk: {
        type: Sequelize.INTEGER,
        field: 'car_markk',
        defaultValue: null
    },
    carModel: {
        type: Sequelize.INTEGER,
        field: 'car_model',
        defaultValue: null
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost',
        defaultValue: null
    },
    estimationTime: {
        type: Sequelize.FLOAT,
        field: 'estimation_time',
        defaultValue: null
    },
    planedExecutorID: {
        type: Sequelize.INTEGER,
        field: 'planed_executor_id',
        defaultValue: null
    },
};

const optionTaskTypeTable = {
    freezeTableName: true,
};

let TaskType = sequelize.define('task_type', describeTaskTypeTable, optionTaskTypeTable);

TaskType.belongsTo(User, {foreignKey: 'planedExecutorID', as: 'planedExecutor'});
TaskType.belongsTo(TransportType, {foreignKey: 'typeOfCar', as: 'transportType'});
TaskType.belongsTo(TransportMarkk, {foreignKey: 'carMarkk', as: 'transportMarkk'});
TaskType.belongsTo(TransportModel, {foreignKey: 'carModel', as: 'transportModel'});
TaskDetail.belongsTo(Detail, {foreignKey: 'detailID', as: 'detail'});
TaskType.hasMany(TaskDetail, {foreignKey: 'taskTypeID', as: 'taskDetail'});

TaskType.sync();

TaskType.getAllTaskType = function () {
    return new Promise((resolve, reject) => {
        TaskType
            .findAll({
                include: [
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: TransportType,
                        as: 'transportType'
                    },
                    {
                        model: TransportMarkk,
                        as: 'transportMarkk'
                    },
                    {
                        model: TransportModel,
                        as: 'transportModel'
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetail',
                        include: [
                            {
                                model: Detail,
                                as: 'detail'
                            }
                        ]
                    }
                ]
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
    if (params.typeOfCar !== 'default' && params.typeOfCar) {
        params.typeOfCar = +params.typeOfCar;
    }
    else {
        params.typeOfCar = null;
    }

    if (params.carModel !== 'default' && params.carModel) {
        params.carModel = +params.carModel;
    }
    else {
        params.carModel = null;
    }

    if (params.carMarkk !== 'default' && params.carMarkk) {
        params.carMarkk = +params.carMarkk;
    }
    else {
        params.carMarkk = null;
    }

    return new Promise((resolve, reject) => {
        TaskType
            .update(
                params,
                {
                    where: {
                    id: taskTypeID
                }
            })
            .then(() => {
                TaskType
                    .getTaskTypeByID(taskTypeID)
                    .then(taskType => {
                        resolve(taskType);
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
                    typeOfCar: null,
                    carMarkk: null,
                    carModel: null
                }
            })
            .then(taskTypesNoneAttributes => {
                TaskType
                    .findAll({
                        where: {
                            typeOfCar: typeOfCar,
                            carMarkk: null,
                            carModel: null
                        },
                        include: [
                            {
                                model: TransportType,
                                as: 'transportType'
                            }
                        ]
                    })
                    .then(taskTypesOneAttributes => {
                        TaskType
                            .findAll({
                                where: {
                                    typeOfCar: typeOfCar,
                                    carMarkk: carMarkk,
                                    carModel: null
                                },
                                include: [
                                    {
                                        model: TransportType,
                                        as: 'transportType'
                                    },
                                    {
                                        model: TransportMarkk,
                                        as: 'transportMarkk'
                                    }
                                ]
                            })
                            .then(taskTypesTwoAttributes => {
                                TaskType
                                    .findAll({
                                        where: {
                                            typeOfCar: typeOfCar,
                                            carMarkk: carMarkk,
                                            carModel: carModel
                                        },
                                        include: [
                                            {
                                                model: TransportType,
                                                as: 'transportType'
                                            },
                                            {
                                                model: TransportMarkk,
                                                as: 'transportMarkk'
                                            },
                                            {
                                                model: TransportModel,
                                                as: 'transportModel'
                                            }
                                        ]
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

TaskType.createUnicalTaskType = function (taskType) {
    return new Promise((resolve, reject) => {
        var search = {
            typeName: taskType.typeName,
            typeOfCar: null,
            carModel: null,
            carMarkk: null,
            articleCode: null
        };
        if (taskType.typeOfCar !== 'default' && taskType.typeOfCar) {
            search.typeOfCar = +taskType.typeOfCar;
            taskType.typeOfCar = +taskType.typeOfCar;
        } else {
            delete taskType.typeOfCar;
        }
        if (taskType.carModel !== 'default' && taskType.carModel) {
            search.carModel = +taskType.carModel;
            taskType.carModel = +taskType.carModel;
        } else {
            delete taskType.carModel;
        }
        if (taskType.carMarkk !== 'default' && taskType.carMarkk) {
            search.carMarkk = +taskType.carMarkk;
            taskType.carMarkk = +taskType.carMarkk;
        } else {
            delete taskType.carMarkk;
        }
        if (taskType.articleCode !== '' && taskType.articleCode) {
            search.articleCode = taskType.articleCode;
        } else {
            delete taskType.articleCode;
        }

        TaskType
            .findAll({
                where: search
            })
            .then(result => {
                if (!result.length) {
                    TaskType
                        .build(taskType)
                        .save()
                        .then(taskTypes => {
                            resolve({
                                taskTypes: [taskTypes],
                                hasResult: false
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            reject(error);
                        });
                } else {
                    resolve({
                        taskTypes: result,
                        hasResult: true
                    });
                }
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TaskType.createTaskType = function (taskType) {
    return new Promise((resolve, reject) => {
        if (taskType.typeOfCar !== 'default' && taskType.typeOfCar) {
            taskType.typeOfCar = +taskType.typeOfCar;
        }
        else {
            delete taskType.typeOfCar;
        }

        if (taskType.carModel !== 'default' && taskType.carModel) {
            taskType.carModel = +taskType.carModel;
        }
        else {
            delete taskType.carModel;
        }

        if (taskType.carMarkk !== 'default' && taskType.carMarkk) {
            taskType.carMarkk = +taskType.carMarkk;
        }
        else {
            delete taskType.carMarkk;
        }

        TaskType
            .build(taskType)
            .save()
            .then(taskTypes => {
                resolve({
                    taskTypes: [taskTypes]
                });
            })
            .catch(error => {
                console.warn(error);
                reject(error);
            });
    });
};

TaskType.getTaskTypeByID = function (taskTypeID) {
    return new Promise((resolve, reject) => {
        TaskType
            .findAll({
                where: {
                    id: taskTypeID
                },
                include: [
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: TransportType,
                        as: 'transportType'
                    },
                    {
                        model: TransportMarkk,
                        as: 'transportMarkk'
                    },
                    {
                        model: TransportModel,
                        as: 'transportModel'
                    }
                ]
            })
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
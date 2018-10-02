"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Request = require('../Request');
const User = require('../User');
const RequestHistory = require('../RequestHistory');
const TaskDetail = require('../TaskDetail/index');
const Detail = require('../Detail');


const status = require('../../constants/status');

const describeTaskTable = {
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    planedExecutorID: {
        type: Sequelize.INTEGER,
        field: 'planed_executor_id'
    },
    description: {
        type: Sequelize.TEXT,
        field: 'description'
    },
    assignedUserID: {
        type: Sequelize.INTEGER,
        field: 'assigned_user_id'
    },
    cost: {
        type: Sequelize.FLOAT,
        field: 'cost'
    },
    estimationTime: {
        type: Sequelize.FLOAT,
        field: 'estimation_time'
    },
    startTime: {
        type: Sequelize.DATE,
        field: 'start_time'
    },
    endTime: {
        type: Sequelize.DATE,
        field: 'end_time'
    },
    status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        field: 'status'
    },
    comment: {
        type: Sequelize.TEXT,
        field: 'comment'
    },
    requestID: {
        type: Sequelize.INTEGER,
        field: 'request_id'
    },
    typeID: {
        type: Sequelize.INTEGER,
        field: 'type_id'
    }

};

const optionTaskTable = {
    freezeTableName: true,
};

let Task = sequelize.define('task', describeTaskTable, optionTaskTable);

Task.belongsTo(Request, {foreignKey: 'requestID'});
Task.belongsTo(User, {foreignKey: 'planedExecutorID', as: 'planedExecutor'});
Task.belongsTo(User, {foreignKey: 'assignedUserID', as: 'assignedUser'});
Task.hasMany(TaskDetail, {foreignKey: 'taskID', as: 'taskDetails'});
TaskDetail.belongsTo(Detail, {foreignKey: 'detailID'});

Task.sync();

Task.getAllTasks = function () {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetails',
                        include: [
                            {
                                model: Detail
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

Task.getAllHoldTasks = function () {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                where: {
                    status: status.HOLD
                },
                include: [
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetails',
                        include: [
                            {
                                model: Detail
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

Task.getAllTasksOfRequest = function (id) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                where: {
                    requestID: id
                },
                include: [
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetails',
                        include: [
                            {
                                model: Detail
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

Task.getAllTasksStatusOfRequest = function (id) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                where: {
                    requestID: id
                },
                attributes: ['status']
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

Task.getTaskById = function (id) {
    return new Promise((resolve, reject) => {
        Task
            .findById(id)
            .then(tasks => {
                resolve(tasks);
            })
            .catch(error => {
                reject(error);
            });
    });
};
Task.getTaskByExecutorId = function (findBy) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: Request,
                        where: {
                            $or: [
                                {
                                    status: status.DONE
                                },
                                {
                                    status: status.PROCESSING
                                },
                                {
                                    status: status.CANCELED
                                },
                            ]
                        }
                    },
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetails',
                        include: [
                            {
                                model: Detail
                            }
                        ]
                    }
                ],
                where: findBy
            })
            .then(result => {
               // console.log(result);
                resolve(result)
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            })
    })
};

Task.getAllTasksForStore = function (storeID) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: Request,
                        where: {
                            $or: [
                                {
                                    status: status.PENDING
                                },
                                {
                                    status: status.PROCESSING
                                },
                                {
                                    status: status.DONE
                                },
                                {
                                    status: status.CANCELED
                                }
                            ]
                        }
                    },
                    {
                        model: TaskDetail,
                        as: 'taskDetails',
                        include: [
                            {
                                model: Detail
                            }
                        ]
                    }
                ],
                where: {
                    $or: [
                        {
                            status: status.PENDING
                        },
                        {
                            status: status.PROCESSING
                        },
                        {
                            status: status.HOLD
                        },
                        {
                            status: status.DONE
                        },
                        {
                            status: status.CANCELED
                        }

                    ],
                    assigned_user_id: storeID
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

Task.createTask = function (task) {
    return new Promise((resolve, reject) => {
        Task
            .build(task)
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

Task.updateTask = function (taskID, params) {
    return new Promise((resolve, reject) => {
        Task
            .update(
                params,
                {where: {id: taskID}})
            .then(result => {

                if (params.status == status.HOLD) {
                    Task
                        .getTaskById(taskID)
                        .then(task => {
                            let data = {
                                'requestID': task.dataValues.requestID,
                                'status': 4,
                                'comment': task.dataValues.comment
                            };

                            RequestHistory
                                .createRequestHistory(data)
                                .then(result => {
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
                }

                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Task.updateAllTasksStatusOfRequest = function (tasksArray, status) {

    let params;
    if (status === "2") {
        params = {
            status: "1"
        };
    } else {
        params = {
            status: status
        };
    }

    return new Promise((resolve, reject) => {
        tasksArray.forEach(item => {
            Task
                .update(
                    params,
                    {
                        where: {
                            id: item.id
                        }
                    }
                )
                .then()
                .catch(err => {
                    console.warn(err);
                    reject(err);
                });
        });
        resolve(200);
    });
};

Task.deleteTask = function (taskID) {
    return new Promise((resolve, reject) => {
        Task
            .destroy({
                where: {
                    id: Number(taskID)
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


Task.changeTaskStatus = function (idTask, status) {
    return new Promise((resolve, reject) => {
        Task
            .update({
                    status: status
                },
                {
                    where: {
                        id: idTask
                    }
                })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    })
};

Task.getAllTasksForChart = function (data) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                where: {
                    createdAt: {
                        $between: [new Date(data.fromDateChart), new Date(data.toDateChart)]
                    }
                },
                attributes: ['planedExecutorID', 'status', 'cost', 'endTime'],
            })
            .then(tasks => {
                resolve(tasks);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

Task.changeStatusByRequestID = function (requestID, status) {
    return new Promise((resolve, reject) => {
        Task
            .update(
                {
                    status: status
                },
                {
                    where: {
                        requestID: requestID
                    }
                }
            )
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
    });
};

module.exports = Task;
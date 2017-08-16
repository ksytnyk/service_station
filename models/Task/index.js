"use strict";

const Sequelize = require('sequelize');
const sequelize = require('../connection');

const Request = require('../Request');
const User = require('../User');

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
        type: Sequelize.DATE,
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
    parts: {
        type: Sequelize.TEXT,
        field: 'parts'
    },
    customerParts: {
        type: Sequelize.TEXT,
        field: 'customer_parts'
    },
    needBuyParts: {
        type: Sequelize.TEXT,
        field: 'need_buy_parts'
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
    },

};

const optionTaskTable = {
    freezeTableName: true,
};

let Task = sequelize.define('task', describeTaskTable, optionTaskTable);

Task.belongsTo(Request, {foreignKey: 'requestID'});
Task.belongsTo(User, {foreignKey: 'planedExecutorID', as: 'planedExecutor'});
Task.belongsTo(User, {foreignKey: 'assignedUserID', as: 'assignedUser'});

Task.sync();

Task.getAllTasks = function () {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: Request,
                        include: {
                            model: User
                        }
                    },
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
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
                        model: Request,
                        include: {
                            model: User
                        }
                    },
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
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

Task.getAllTasksForCustomer = function (id) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: Request,
                        where: {
                            customerID: id
                        },
                        include: {
                            model: User
                        },
                    },
                    {
                        model: User,
                        as: 'planedExecutor'
                    },
                    {
                        model: User,
                        as: 'assignedUser'
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
Task.getTaskByExecutorId = function (id) {
    return new Promise((resolve, reject) => {
        Task
            .findAll({
                include: [
                    {
                        model: Request,
                        where: {status: status.PROCESSING}
                    }
                ],
                where: {
                    assignedUserID: id,
                    $or: [
                        {
                            status: status.PENDING
                        },
                        {
                            status: status.PROCESSING
                        }
                    ]
                }
            })
            .then(result => {
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
                        where: {status: status.PROCESSING}
                    }
                ],
                where: {
                    status: status.PENDING,
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
                resolve(result);
            })
            .catch(err => {
                console.warn(err);
                reject(err);
            });
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

Task.isLast = function (idRequest) {
    return new Promise((resolve, reject) => {
        Task
            .count({
                where: {
                    requestID: idRequest
                }
            })
            .then(result => {
                if (result === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => {
                reject(err);
            });
    })
};

module.exports = Task;
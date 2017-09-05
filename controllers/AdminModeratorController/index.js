"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');
const TaskType = require('../../models/TaskType');
const RequestHistory = require('../../models/RequestHistory');

const express = require('express');
const router = express.Router();

const roles = require('../../constants/roles');
const validation = require('../../middleware/validation');
const requestsFactory = require('../../helpers/requestsFactory');
const countRequestHistory = require('../../helpers/countRequestHistory');
const countMoney = require('../../helpers/countMoney');
const countTasks = require('../../helpers/countTasks');
const nodemailer = require('../../helpers/nodemailer');
const countEndTime = require('../../helpers/countEndTime');
const status = require('../../constants/status');

router.get('/users', (req, res) => {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/users', {
                users: users,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/users');
        });
});

router.post('/create-user', validation.createAndUpdateUser('create'), (req, res) => {
    if (req.baseUrl === '/moderator') {
        req.body.userTypeID = roles.CUSTOMER;
    }

    User
        .createUser(req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Додавання користувача пройшло успішно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні користувача.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.put('/update-user/:id', validation.createAndUpdateUser(), (req, res) => {
    User
        .updateUser(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({
                errors: errors
            });
        });
});

router.delete('/delete-user/:id', (req, res) => {
    User
        .deleteUser(req.params.id)
        .then(() => {
            res.status(200).send({result: 'ok'});
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({errors: errors});
        });
});

router.get('/requests/:status', (req, res) => {
    let findBy;

    if (req.params.status === 'all' || req.params.status === 'hold') {
        findBy = {
            $between: [1, 5]
        };
    }
    else if (req.params.status === 'processing') {
        findBy = status.PROCESSING;
    }
    else if (req.params.status === 'done') {
        findBy = status.DONE;
    }
    else if (req.params.status === 'canceled') {
        findBy = status.CANCELED;
    }

    Request
        .getAllRequests(findBy)
        .then(requests => {
            method(req.params.status)
                .then(tasks => {
                    User
                        .getAllUsers()
                        .then(users => {
                            res.render('roles/admin_moderator/requests', {
                                assignedExecutorUsers: users,
                                requests: requestsFactory(requests, tasks, true),
                                typeUser: req.session.passport.user.userTypeID
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            res.render('roles/admin_moderator/requests');
                        });
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/requests');
        });
});

router.get('/create-request', (req, res) => {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users => {
                    res.render('roles/admin_moderator/create_request', {
                        assignedExecutorUsers: users,
                        customers: usersCustomers,
                        typeUser: req.session.passport.user.userTypeID
                    })
                })
                .catch(err => {
                    console.warn(err);
                    res.render('roles/admin_moderator/create_request');
                })
        })
});

router.post('/create-request', validation.createAndUpdateRequest(), (req, res) => {
    req.body.createdBy = req.session.passport.user.id;
    Request
        .createRequest(req.body)
        .then((result) => {
            User
                .getUserById(req.body.customerID)
                .then(customer => {
                    res.status(200).send({
                        result: result,
                        customer: customer
                    });
                })
                .catch(errors => {
                    res.status(400).send({errors: errors});
                });
        })
        .catch(errors => {
            res.status(400).send({errors: errors});
        });
});

router.get('/requests/update-request/:id', (req, res) => {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users => {
                    Request
                        .getRequestById(req.params.id)
                        .then(request => {
                            Task
                                .getAllTasksOfRequest(req.params.id)
                                .then(task => {
                                    TaskType
                                        .getTaskTypesByCar(request[0].dataValues.carMarkk, request[0].dataValues.carModel)
                                        .then(taskTypes => {
                                            res.render('roles/admin_moderator/update_request', {
                                                taskTypes: taskTypes,
                                                assignedExecutorUsers: users,
                                                customers: usersCustomers,
                                                typeUser: req.session.passport.user.userTypeID,
                                                request: requestsFactory(request, task)
                                            })
                                        })
                                        .catch(error => {
                                            console.warn(error);
                                            res.render('roles/admin_moderator/update_request');
                                        });
                                })
                                .catch(error => {
                                    console.warn(error);
                                    res.render('roles/admin_moderator/update_request');
                                });
                        });
                });
        });
});

router.put('/update-request/:id', validation.createAndUpdateRequest(), (req, res) => {
    Request
        .updateRequest(req.params.id, req.body)
        .then((result) => {
            res.status(200).send({result: result});
        })
        .catch(errors => {
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-request/:id', (req, res) => {
    Task
        .destroy({
            where: {
                request_id: Number(req.params.id)
            }
        })
        .then(() => {
            Request
                .deleteRequest(req.params.id)
                .then(() => {
                    res.status(200).send({result:'ok'});
                })
                .catch(error => {
                    console.warn(error);
                    res.status(400).send({errors: errors});
                });
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({errors: errors});
        });
});

router.put('/change-request-status/:id', (req, res) => {
    Request
        .changeStatus(req.params.id, req.body.statusID)
        .then(() => {
            if (+req.body.statusID === status.DONE) {
                Request
                    .getRequestById(req.params.id)
                    .then((result) => {
                        nodemailer(result[0].user.dataValues);
                    })
                    .catch(error => {
                        console.warn(error);
                    });
            }
            res.status(200).send({
                status: req.body.statusID,
                requestID: req.params.id
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/get-task-types', (req, res) => {
    TaskType
        .getTaskTypesByCar(req.body.carMarkk, req.body.carModel)
        .then(taskTypes => {
            res.status(200).send({taskTypes: taskTypes});
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/create-task', validation.createAndUpdateTask(), (req, res) => {
    req.body.endTime = countEndTime(req.body.startTime, +req.body.estimationTime);

    Task
        .createTask(req.body)
        .then(result => {
            Request
                .getRequestById(req.body.requestID)
                .then(request => {
                    var newCost = +request[0].dataValues.cost + +req.body.cost;

                    Request
                        .updateRequest(req.body.requestID, {cost: newCost})
                        .then(() => {
                            TaskType
                                .createTaskType({
                                    typeName: req.body.name,
                                    carMarkk: request[0].dataValues.carMarkk,
                                    carModel: request[0].dataValues.carModel,
                                    cost: req.body.cost
                                })
                                .then(() => {
                                    res.status(200).send({result: result});
                                })
                                .catch(errors => {
                                    console.warn(errors);
                                    res.status(400).send({errors: errors});
                                });
                        })
                        .catch(errors => {
                            console.warn(errors);
                            res.status(400).send({errors: errors});
                        });
                })
                .catch(errors => {
                    console.warn(errors);
                    res.status(400).send({errors: errors});
                });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.put('/update-task/:id', validation.createAndUpdateTask(), (req, res) => {
    req.body.endTime = countEndTime(req.body.startTime, +req.body.estimationTime);

    Task
        .updateTask(req.body.id, req.body)
        .then(() => {
            Request
                .getRequestById(req.body.requestID)
                .then(request => {
                    var newCost = +request[0].dataValues.cost - +req.body.oldCost + +req.body.cost;

                    Request
                        .updateRequest(req.body.requestID, {cost: newCost})
                        .then(() => {
                            Task
                                .getTaskById(req.body.id)
                                .then(task => {

                                    TaskType
                                        .createTaskType({
                                            typeName: req.body.name,
                                            carMarkk: request[0].dataValues.carMarkk,
                                            carModel: request[0].dataValues.carModel,
                                            cost: req.body.cost
                                        })
                                        .then(() => {
                                            res.status(200).send({
                                                task: task,
                                                requestID: req.body.requestID,
                                                newCost: newCost
                                            });
                                        })
                                        .catch(errors => {
                                            console.warn(errors);
                                            res.status(400).send({errors: errors});
                                        })

                                })
                                .catch(errors => {
                                    console.warn(errors);
                                    res.status(400).send({errors: errors});
                                });

                        })
                        .catch(errors => {
                            console.warn(errors);
                            res.status(400).send({errors: errors});
                        });
                })
                .catch(errors => {
                    console.warn(errors);
                    res.status(400).send({errors: errors});
                });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-task/:id', (req, res) => {
    Task
        .destroy({
            where: {
                id: Number(req.params.id)
            }
        })
        .then(() => {
            Request
                .getRequestById(req.body.requestID)
                .then(request => {
                    var newCost = +request[0].dataValues.cost - +req.body.taskOldCost;

                    Request
                        .updateRequest(req.body.requestID, {cost: newCost})
                        .then(() => {
                            res.status(200).send({
                                id: req.params.id,
                                requestID: req.body.requestID,
                                newCost: newCost
                            });
                        })
                        .catch(errors => {
                            console.warn(errors);
                            res.status(400).send({errors: errors});
                        });
                })
                .catch(errors => {
                    console.warn(errors);
                    res.status(400).send({errors: errors});
                });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.get('/chart', (req, res) => {
    res.render('roles/admin_moderator/chart', {
        typeUser: req.session.passport.user.userTypeID
    });
});

router.post('/chart/requests', (req, res) => {
    RequestHistory
        .getAllRequestHistory(req.body)
        .then(requestHistory => {
            res.status(200).send({
                data: countRequestHistory(req.body, requestHistory)
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/chart/finances', (req, res) => {
    Request
        .getAllRequestsForChart(req.body)
        .then(requests => {
            res.status(200).send({
                data: countMoney(req.body, requests)
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/chart/tasks', (req, res) => {
    User
        .getAllExecutors()
        .then(users => {
            Task
                .getAllTasksForChart(req.body)
                .then(tasks => {
                    res.status(200).send({
                        data: countTasks(users, tasks)
                    });
                })
                .catch(errors => {
                    console.warn(errors);
                    res.status(400).send({errors: errors});
                });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/get-task-prise/:id', (req, res) => {
    TaskType
        .getTaskTypeByID(req.params.id)
        .then(taskType => {
            console.log(taskType.dataValues.cost);
            res.status(200).send({
                taskTypeCost: taskType.dataValues.cost
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.get('/create-global-request', (req, res) => {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users => {

                    res.render('roles/admin_moderator/create_global_request', {
                        assignedExecutorUsers: users,
                        customers: usersCustomers,
                        typeUser: req.session.passport.user.userTypeID
                    })

                })
                .catch(err => {
                    console.warn(err);
                    res.render('roles/admin_moderator/create_global_request');
                })
        })
});

router.post('/create-global-request', validation.createGlobalRequest(), (req, res) => {
    req.body.createdBy = req.session.passport.user.id;
    req.body.estimationTime = req.body.estimatedTime;
    req.body.estimatedTime = countEndTime(req.body.startTime, +req.body.estimationTime);

    Request
        .createRequest(req.body)
        .then((request) => {
            req.body.endTime = req.body.estimatedTime;
            req.body.requestID = request.id;

            Task
                .createTask(req.body)
                .then(() => {
                    TaskType
                        .createTaskType({
                            typeName: req.body.name,
                            carMarkk: req.body.carMarkk,
                            carModel: req.body.carModel,
                            cost: req.body.cost
                        })
                        .then(() => {
                            res.status(200).send();
                        })
                        .catch(errors => {
                            console.warn(err);
                            res.status(400).send({errors: errors});
                        })
                })
                .catch(errors => {
                    console.warn(err);
                    res.status(400).send({errors: errors});
                });

            res.status(200).send({
                result: result
            });
        })
        .catch(errors => {
            console.warn(err);
            res.status(400).send({errors: errors});
        });
});

function method(isHold) {
    return new Promise(function (resolve, reject) {

        if (isHold === 'hold') {
            Task
                .getAllHoldTasks()
                .then(result => {
                    resolve(result);
                })
        } else {
            Task
                .getAllTasks()
                .then(result => {
                    resolve(result);
                })
        }
    })
}

router.get('/task-type', (req, res) => {
    TaskType
        .getAllTaskType()
        .then(taskType => {
            res.render('roles/admin_moderator/task_type', {
                taskType: taskType,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/task_type');
        });
});

router.post('/create-task-type', validation.createAndUpdateTaskType('create'), (req, res) => {
    TaskType
        .createTaskType(req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Додавання задачі пройшло успішно.');
            res.redirect(req.baseUrl + '/task-type');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні задачі.'});
            res.redirect(req.baseUrl + '/task-type');
        });
});

router.put('/update-task-type/:id', validation.createAndUpdateTaskType(), (req, res) => {
    TaskType
        .updateTaskType(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-task-type/:id', (req, res) => {
    TaskType
        .deleteTaskType(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({errors: errors});
        });
});

module.exports = router;
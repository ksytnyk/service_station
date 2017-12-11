"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');
const TaskType = require('../../models/TaskType');
const RequestHistory = require('../../models/RequestHistory');
const TransportType = require('../../models/TransportType');
const TransportMarkk = require('../../models/TransportMarkk');
const TransportModel = require('../../models/TransportModel');

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
            nodemailer('create-user', req.body);
            req.flash('success_alert', true);
            req.flash('success_msg', 'Додавання користувача пройшло успішно.');
            res.redirect('back');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні користувача.'});
            res.redirect('back');
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
    let findBy, hold;

    if (req.params.status === 'all' || req.params.status === 'hold') {
        findBy = {
            status: {
                $between: [1, 5]
            },
            hadDeleted: false
        }
    }
    else if (req.params.status === 'pending') {
        findBy = {
            status: status.PENDING
        }
    }
    else if (req.params.status === 'processing') {
        findBy = {
            status: status.PROCESSING
        }
    }
    else if (req.params.status === 'done') {
        findBy = {
            status: status.DONE
        }
    }
    else if (req.params.status === 'canceled') {
        findBy = {
            status: status.CANCELED
        }
    }
    else if (req.params.status === 'give-out') {
        findBy = {
            giveOut: true
        }
    }
    else if (req.params.status === 'payed') {
        findBy = {
            payed: true,
            hadDeleted: false
        }
    }
    else if (req.params.status === 'not-payed') {
        findBy = {
            payed: false,
            hadDeleted: false
        }
    }
    else if (req.params.status === 'trash') {
        findBy = {
            hadDeleted: true
        }
    }

    Request
        .getAllRequests(findBy)
        .then(requests => {
            RequestHistory
                .getAllRequestHistory()
                .then(requestsHistory => {
                    method(req.params.status)
                        .then(tasks => {
                            User
                                .getAllUsers()
                                .then(users => {
                                    if (req.params.status === 'hold') {
                                        hold = true;
                                    }
                                    res.render('roles/admin_moderator/requests', {
                                        assignedExecutorUsers: users,
                                        requests: requestsFactory(requests, tasks, hold, requestsHistory),
                                        typeUser: req.session.passport.user.userTypeID,
                                        isSetPayed: true //for add class set_payed to print modal
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
                    nodemailer('create-request', customer);
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
                                        .getTaskTypesByCarAttributes(request[0].dataValues.typeOfCar, request[0].dataValues.carMarkk, request[0].dataValues.carModel)
                                        .then(taskTypes => {
                                            User
                                                .getUserById(request[0].dataValues.customerID)
                                                .then(customer => {
                                                    Request
                                                        .getRequestsWithoutCondition()
                                                        .then(requests => {
                                                            res.render('roles/admin_moderator/update_request', {
                                                                requests: requests,
                                                                customer: customer,
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
            Request
                .getRequestById(req.params.id)
                .then(request => {
                    User
                        .getUserById(request[0].dataValues.customerID)
                        .then(customer => {
                            res.status(200).send({request: request[0].dataValues, result: result, customer: customer});
                        })
                        .catch(errors => {
                            res.status(400).send({errors: errors});
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

router.delete('/delete-request/:id', (req, res) => {
    if (req.body.hadDeleted === '') {
        Task
            .changeStatusByRequestID(Number(req.params.id), status.CANCELED)
            .then(() => {
                Request
                    .changeStatus(Number(req.params.id), {status: status.CANCELED})
                    .then(() => {
                        Request
                            .updateRequest(Number(req.params.id), {hadDeleted: true})
                            .then(() => {
                                res.status(200).send();
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
            })
            .catch(error => {
                console.warn(error);
                res.status(400).send({errors: errors});
            });
    } else {
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
                        res.status(200).send();
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

    }
});

router.put('/change-request-status/:id', (req, res) => {
    Request
        .changeStatus(req.params.id, req.body)
        .then(() => {
        Task
            .getAllTasksOfRequest(req.params.id)
            .then(tasks => {

                Task
                    .updateAllTasksStatusOfRequest(tasks, req.body)
                    .then(() => {

                        Request
                            .getRequestById(req.params.id)
                            .then(request => {

                                if (+req.body.status === status.DONE) {

                                    Request
                                        .getRequestById(req.params.id)
                                        .then((result) => {

                                            nodemailer('done-request', result[0].user.dataValues);
                                        })
                                        .catch(error => {
                                            console.warn(error);
                                        });
                                }

                                if (req.body.hadDeleted){
                                    var params = {
                                        hadDeleted: false
                                    };

                                    Request
                                        .updateRequest(req.params.id, params)
                                        .then()
                                        .catch(errors => {
                                            console.warn(errors);
                                            res.status(400).send({errors: errors});
                                        });
                                }
                                res.status(200).send({
                                    status: req.body.status,
                                    requestID: req.params.id,
                                    request: request
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
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.put('/set-payed/:id', (req, res) => {
    Request
        .updateRequest(req.params.id, req.body)
        .then(() => {
            Request
                .getRequestById(req.params.id)
                .then(request => {
                    User
                        .getAllAdmins()
                        .then(admins => {
                            if (req.body.payed) {
                                nodemailer('set-payed', admins, request[0].dataValues);
                            } else {
                                if (req.body.giveOut) {
                                    User
                                        .getAllBookkeepers()
                                        .then(bookkeepers => {
                                            bookkeepers.forEach(item => {
                                                admins.push(item);
                                            });

                                            nodemailer('give-out', admins, request[0].dataValues);
                                        })
                                        .catch(errors => {
                                            console.warn(errors);
                                            res.status(400).send({errors: errors});
                                        });
                                }
                            }
                            res.status(200).send({
                                request: request
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

router.get('/get-request-check/:id', (req, res) => {
    Request
        .getRequestById(req.params.id)
        .then(request => {
            User
                .getUserById(request[0].dataValues.customerID)
                .then(customer => {
                    Task
                        .getAllTasksOfRequest(request[0].dataValues.id)
                        .then(tasks => {
                            res.status(200).send({
                                request: request,
                                customerPhone: customer.dataValues.userPhone,
                                tasks: tasks
                            });
                        })

                });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/get-task-types', (req, res) => {
    TaskType
        .getTaskTypesByCarAttributes(req.body.typeOfCar, req.body.carMarkk, req.body.carModel)
        .then(taskTypes => {
            res.status(200).send({
                taskTypes: taskTypes
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.post('/create-task', validation.createAndUpdateTask(), (req, res) => {
    req.body.endTime = countEndTime(req.body.startTime, +req.body.estimationTime);

    Request
        .getRequestById(req.body.requestID)
        .then(request => {
            var newCost = +request[0].dataValues.cost + +req.body.cost;

            Request
                .updateRequest(req.body.requestID, {cost: newCost})
                .then(() => {
                var search = {
                    typeName: req.body.name,
                    typeOfCar: request[0].dataValues.typeOfCar,
                    carMarkk: request[0].dataValues.carMarkk,
                    carModel: request[0].dataValues.carModel,
                    cost: req.body.cost,
                    estimationTime: req.body.estimationTime,
                    planedExecutorID: req.body.planedExecutorID
                };

                if (!req.body.typeID) {
                    search.typeID = true;
                }
                    TaskType
                        .createTaskType(search)
                        .then(result => {
                            if (!req.body.typeID) {
                                req.body.typeID = result.taskTypes[0].dataValues.id;
                            }

                            Task
                                .createTask(req.body)
                                .then(task => {
                                    res.status(200).send({result: task});
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

    Request
        .getRequestById(req.body.requestID)
        .then(request => {
            var newCost = +request[0].dataValues.cost - +req.body.oldCost + +req.body.cost;

            Request
                .updateRequest(req.body.requestID, {cost: newCost})
                .then(() => {
                    var search = {
                        typeName: req.body.name,
                        typeOfCar: request[0].dataValues.typeOfCar,
                        carMarkk: request[0].dataValues.carMarkk,
                        carModel: request[0].dataValues.carModel,
                        cost: req.body.cost,
                        estimationTime: req.body.estimationTime,
                        planedExecutorID: req.body.planedExecutorID
                    };

                    if (!req.body.typeID) {
                        search.typeID = true;
                    }

                    TaskType
                        .createTaskType(search)
                        .then(result => {
                            if (!req.body.typeID) {
                                req.body.typeID = result.taskTypes[0].dataValues.id;
                            }

                            Task
                                .updateTask(req.body.id, req.body)
                                .then(() => {
                                    Task
                                        .getTaskById(req.body.id)
                                        .then(task => {
                                            Task
                                                .getAllTasksStatusOfRequest(req.body.requestID)
                                                .then(allTasks => {
                                                    var condition = false;
                                                    var counter = 1;
                                                    for (var key in allTasks) {
                                                        if (allTasks[key].dataValues.status !== 3) {
                                                            break;
                                                        }
                                                        if(counter === allTasks.length) {
                                                            condition = true;
                                                            Request
                                                                .changeStatus(req.body.requestID, {status:status.DONE})
                                                                .then((isDone) => {
                                                                    nodemailer('done-request', request[0].user.dataValues);

                                                                    res.status(200).send({
                                                                        isDone: isDone,
                                                                        request: request,
                                                                        task: task,
                                                                        requestID: req.body.requestID,
                                                                        newCost: newCost
                                                                    })
                                                                })
                                                                .catch(errors => {
                                                                    console.warn(errors);
                                                                    res.status(400).send({errors: errors});
                                                                });
                                                        }
                                                        counter++;
                                                    }
                                                    if(!condition) {
                                                        res.status(200).send({
                                                            request: request,
                                                            task: task,
                                                            requestID: req.body.requestID,
                                                            newCost: newCost
                                                        })
                                                    }
                                                })

                                                .catch(errors => {
                                                    console.warn(errors);
                                                    res.status(400).send({errors: errors});
                                                });
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
                                request: request,
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

router.put('/cancel-task/:id', (req, res) => {
    Task
        .updateTask(req.params.id, req.body)
        .then(() => {
            Task
                .getTaskById(req.params.id)
                .then(task => {
                    res.status(200).send({
                        task: task
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
});

router.get('/chart', (req, res) => {
    res.render('roles/admin_moderator/chart', {
        typeUser: req.session.passport.user.userTypeID
    });
});

router.post('/chart/requests', (req, res) => {
    RequestHistory
        .getChartRequestHistory(req.body)
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
            res.status(200).send({
                taskType: taskType
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

// router.get('/create-global-request', (req, res) => {
//     User
//         .getCustomerUsers()
//         .then(usersCustomers => {
//             User
//                 .getAllUsers()
//                 .then(users => {
//                     res.render('roles/admin_moderator/create_global_request', {
//                         assignedExecutorUsers: users,
//                         customers: usersCustomers,
//                         typeUser: req.session.passport.user.userTypeID
//                     })
//                 })
//                 .catch(err => {
//                     console.warn(err);
//                     res.render('roles/admin_moderator/create_global_request');
//                 })
//         })
// });

// router.post('/create-global-request', validation.createGlobalRequest(), (req, res) => {
//     req.body.createdBy = req.session.passport.user.id;
//     req.body.estimationTime = req.body.estimatedTime;
//     req.body.estimatedTime = countEndTime(req.body.startTime, +req.body.estimationTime);
//
//     Request
//         .createRequest(req.body)
//         .then(request => {
//             User
//                 .getUserById(req.body.customerID)
//                 .then(customer => {
//                     nodemailer('create-request', customer);
//                     req.body.endTime = req.body.estimatedTime;
//                     req.body.requestID = request.id;
//
//                     Task
//                         .createTask(req.body)
//                         .then(() => {
//                             TaskType
//                                 .createTaskType({
//                                     estimationTime: req.body.estimationTime,
//                                     planedExecutorID: req.body.planedExecutorID,
//                                     typeName: req.body.name,
//                                     typeOfCar: req.body.typeOfCar,
//                                     carMarkk: req.body.carMarkk,
//                                     carModel: req.body.carModel,
//                                     cost: req.body.cost
//                                 })
//                                 .then(() => {
//                                     res.status(200).send({
//                                         request: request,
//                                         customer: customer
//                                     });
//                                 })
//                                 .catch(errors => {
//                                     console.warn(err);
//                                     res.status(400).send({errors: errors});
//                                 })
//                         })
//                         .catch(errors => {
//                             console.warn(err);
//                             res.status(400).send({errors: errors});
//                         });
//
//                     res.status(200).send({
//                         result: result
//                     });
//                 })
//                 .catch(errors => {
//                     console.warn(err);
//                     res.status(400).send({errors: errors});
//                 });
//         })
//         .catch(errors => {
//             console.warn(err);
//             res.status(400).send({errors: errors});
//         });
// });

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
            User
                .getExecutorUsers()
                .then(users => {
                    res.render('roles/admin_moderator/task_type', {
                        users: users,
                        taskType: taskType,
                        typeUser: req.session.passport.user.userTypeID
                    });
                })
                .catch(error => {
                    console.warn(error);
                    res.render('roles/admin_moderator/task_type');
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/task_type');
        });
});

router.post('/request-type', (req, res) => {
    Request
        .getRequestsWithoutCondition()
        .then(requestTypes  => {
            res.status(200).send({
                requestTypes: requestTypes
            });
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });

});

router.post('/create-task-type', validation.createAndUpdateTaskType('create'), (req, res) => {
    req.body.typeID = true;

    TaskType
        .createTaskType(req.body)
        .then((result) => {
            if (result.hasResult) {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Додавання задачі пройшло успішно.');
                res.redirect(req.baseUrl + '/task-type');
            }
            else {
                var msg = 'Задача "' + req.body.typeName + '" вже існує. Скористайтеся пошуком.';

                req.flash('error_alert', true);
                req.flash('error_msg', {msg: msg});
                res.redirect(req.baseUrl + '/task-type');
            }
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
            User
                .getUserById(req.body.planedExecutorID)
                .then(user => {
                    res.status(200).send({
                        user: user
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

router.put('/start-request/:id', (req,res) => {

    Request
        .changeStatus(req.params.id, {status: status.PROCESSING})
        .then(() => {
            res.status(200).send({
                isBeginButton: true
            })
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({errors: errors});
        });
});

/* ============== TRANSPORT TYPE ============== */
router.get('/transport-type', (req, res) => {
    TransportType
        .getAllTransportType()
        .then(transportTypes => {
            res.render('roles/admin_moderator/transport_type', {
                transportTypes: transportTypes,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/requests/all');
        });
});

router.post('/create-transport-type', validation.createAndUpdateTransportType('create'), (req, res) => {
    TransportType
        .createTransportType(req.body)
        .then((result) => {
            if (result.hasResult) {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Додавання типу транспорту пройшло успішно.');
                res.redirect('back');
            }
            else {
                var msg = 'Тип транспорту "' + req.body.transportTypeName + '" вже існує. Скористайтеся пошуком.';

                req.flash('error_alert', true);
                req.flash('error_msg', {msg: msg});
                res.redirect('back');
            }
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні типу транспорту.'});
            res.redirect('back');
        });
});

router.put('/update-transport-type/:id', validation.createAndUpdateTransportType(), (req, res) => {
    TransportType
        .updateTransportType(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-transport-type/:id', (req, res) => {
    TransportType
        .deleteTransportType(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

/* ============== TRANSPORT MARKK ============== */
router.get('/transport-markk', (req, res) => {
    TransportMarkk
        .getAllTransportMarkks()
        .then(markks => {
            TransportType
                .getAllTransportType()
                .then(types => {
                    res.render('roles/admin_moderator/transport_markk', {
                        markks: markks,
                        types: types,
                        typeUser: req.session.passport.user.userTypeID
                    });
                })
                .catch(error => {
                    console.warn(error);
                    res.render('roles/admin_moderator/users');
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/users');
        });
});

router.post('/create-transport-markk', validation.createAndUpdateTransportMarkk('create'), (req, res) => {
    TransportMarkk
        .createTransportMarkk({markkName: req.body.markkName, typeID: +req.body.typeName})
        .then(result => {

            if (result.hasResult) {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Додавання марки транспорту пройшло успішно.');
                res.redirect(req.baseUrl + '/transport-markk');
            }
            else {
                var msg = 'Марка транспорту "' + req.body.markkName + '" вже існує. Скористайтеся пошуком.';
                req.flash('error_alert', true);
                req.flash('error_msg', {msg: msg});
                res.redirect(req.baseUrl + '/transport-markk');
            }
        })
        .catch(error => {
            console.warn(error);

            res.redirect(req.baseUrl + '/transport-markk');
        });
});

router.put('/update-transport-markk/:id', (req, res) => {
    TransportMarkk
        .updateTransportMarkk(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-transport-markk/:id', (req, res) => {
    TransportMarkk
        .deleteTransportMarkk(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({errors: errors});
        });
});

/* ============== TRANSPORT MODEL ============== */
router.get('/transport-model', (req, res) => {
    TransportModel
        .getAllTransportModel()
        .then(transportModels => {
            TransportMarkk
                .getAllTransportMarkks()
                .then(transportMarkks => {
                    res.render('roles/admin_moderator/transport_model', {
                        transportModels: transportModels,
                        transportMarkks: transportMarkks,
                        typeUser: req.session.passport.user.userTypeID
                    });
                })
                .catch(error => {
                    console.warn(error);
                    res.render('roles/admin_moderator/requests/all');
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/requests/all');
        });
});

router.post('/create-transport-model', validation.createAndUpdateTransportModel('create'), (req, res) => {
    TransportModel
        .createTransportModel(req.body)
        .then((result) => {
            if (result.hasResult) {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Додавання моделі транспорту пройшло успішно.');
                res.redirect(req.baseUrl + '/transport-model');
            }
            else {
                var msg = 'Модель транспорту "' + req.body.transportTypeName + '" вже існує. Скористайтеся пошуком.';

                req.flash('error_alert', true);
                req.flash('error_msg', {msg: msg});
                res.redirect(req.baseUrl + '/transport-model');
            }
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні моделі транспорту.'});
            res.redirect(req.baseUrl + '/transport-model');
        });
});

router.put('/update-transport-model/:id', validation.createAndUpdateTransportModel(), (req, res) => {
    TransportModel
        .updateTransportModel(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-transport-model/:id', (req, res) => {
    TransportModel
        .deleteTransportModel(req.params.id)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

//for create request page

router.get('/get-transport-type', (req, res) => {
    TransportType
        .getAllTransportType()
        .then(transportTypes => {
            res.status(200).send(transportTypes);
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.get('/get-transport-markk/:id', (req, res) => {
    TransportMarkk
        .getTransportMarkksOfTypeID(req.params.id)
        .then(markks => {
            res.status(200).send(markks);
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.get('/get-transport-model/:id', (req, res) => {
    TransportModel
        .getTransportModelOfMarkkID(req.params.id)
        .then(transportModels => {
            res.status(200).send(transportModels)
        })
        .catch(errors => {
            console.warn(errors);
            res.send(400).send({errors: errors});
        });
});

module.exports = router;
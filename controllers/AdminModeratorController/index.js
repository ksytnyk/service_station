"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');

const express = require('express');
const router = express.Router();

const roles = require('../../constants/roles');
const statuses = require('../../constants/status');
const validation = require('../../middleware/validation');
const formatDate = require('../../helpers/formatDate');
const requestsFactory = require('../../helpers/requestsFactory');

router.get('/users', function (req, res) {

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

router.post('/create-user', validation.createAndUpdateUser(), function (req, res) {
    if (req.baseUrl === '/moderator') {
        req.body.userTypeID = roles.CUSTOMER;
    }

    User
        .createUser(req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Добавление прошло успешно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.put('/update-user/:id', validation.createAndUpdateUser(), function (req, res) { //TODO without restart page

    User
        .updateUser(req.params.id, req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Изменение прошло успешно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.delete('/delete-user/:id', function (req, res) { //TODO without restart page
    User
        .deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.get('/requests', function (req, res) {
    Task
        .getAllTasks()
        .then(result => {
            User
                .getAllUsers()
                .then(users => {
                    res.render('roles/admin_moderator/requests', {
                        assignedExecutorUsers: users,
                        requests: requestsFactory(result),
                        typeUser: req.session.passport.user.userTypeID
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

router.get('/create-request', function (req, res) {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users =>
                    res.render('roles/admin_moderator/create-request', {
                        assignedExecutorUsers: users,
                        customers: usersCustomers,
                        typeUser: req.session.passport.user.userTypeID
                    }))
                .catch(err => {
                    console.warn(err);
                    res.render('roles/admin_moderator/create-request');
                });
        });
});

router.post('/create-request', function (req, res) {
    let name = req.body.name;
    let customerID = req.body.customerID;
    let cost = req.body.cost;
    let startTime = req.body.startTime;
    let estimatedTime = req.body.estimatedTime;
    // Validation

    req.checkBody('name', '"Имя заказа" - обязательное поле.').notEmpty();
    req.checkBody('customerID', '"Клиент" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Стоемость" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('estimatedTime', '"Планируемове время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).send({errors: errors});
    } else {
        req.body.createdBy = req.session.passport.user.id;
        Request
            .createRequest(req.body)
            .then((result) => {
                res.status(200).send({result: result});
            })
            .catch(errors => {
                res.status(400).send({errors: errors});
            });
    }
});

router.get('/update-request/:id', function (req, res) {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users => {
                    Task
                        .getAllTasksOfRequest(req.params.id)
                        .then(result => {
                            res.render('roles/admin_moderator/update_request', {
                                assignedExecutorUsers: users,
                                customers: usersCustomers,
                                typeUser: req.session.passport.user.userTypeID,
                                request: requestsFactory(result)
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            res.render('roles/admin_moderator/update_request');
                        });
                });
        });
});

router.put('/update-request/:id', function (req, res) {
    let name = req.body.name;
    let customerID = req.body.customerID;
    let cost = req.body.cost;
    let startTime = req.body.startTime;
    let estimatedTime = req.body.estimatedTime;
    // Validation

    req.checkBody('name', '"Имя заказа" - обязательное поле.').notEmpty();
    req.checkBody('customerID', '"Клиент" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Стоемость" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('estimatedTime', '"Планируемове время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.warn(errors);
        res.status(400).send({errors: errors});
    } else {

        let requestID = req.params.id;
        let params = req.body;

        Request
            .updateRequest(requestID, params)
            .then((result) => {
                res.status(200).send({result: result});
            })
            .catch(errors => {
                res.status(400).send({errors: errors});
            });
    }
});

router.delete('/delete-request/:id', function (req, res) {
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
                    req.flash('success_alert', true);
                    req.flash('success_msg', 'Удаление прошло успешно.');
                    res.redirect(req.baseUrl + '/requests');
                })
                .catch(error => {
                    console.warn(error);
                    req.flash('error_alert', true);
                    req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
                    res.redirect(req.baseUrl + '/requests');
                });
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect(req.baseUrl + '/requests');
        });
});

router.post('/create-task', function (req, res) {

    let name = req.body.name;
    let planedExecutorID = req.body.planedExecutorID;
    let assignedUserID = req.body.assignedUserID;
    let description = req.body.description;
    let estimationTime = req.body.estimationTime;
    let cost = req.body.cost;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    /* let parts = req.body.parts;
     let customerParts = req.body.customerParts;
     let needBuyParts = req.body.needBuyParts;
     let taskComments = req.body.taskComments;*/

    // Validation

    req.checkBody('name', '"Имя задачи" - обязательное поле.').notEmpty();
    req.checkBody('planedExecutorID', '"Исполнитель" - обязательное поле.').notEmpty();
    req.checkBody('assignedUserID', '"Поручить задачу" - обязательное поле.').notEmpty();
    req.checkBody('description', '"Описание задачи" - обязательное поле.').notEmpty();
    req.checkBody('estimationTime', '"Планируемове время" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Цена" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('endTime', '"Конечное время" - обязательное поле.').notEmpty();
    /*
     req.checkBody('parts', '"Планируемове время" - обязательное поле.').notEmpty();
     req.checkBody('customerParts', '"Планируемове время" - обязательное поле.').notEmpty();
     req.checkBody('needBuyParts', '"Планируемове время" - обязательное поле.').notEmpty();
     req.checkBody('taskComments', '"Планируемове время" - обязательное поле.').notEmpty();
     */

    let errors = req.validationErrors();

    if (errors) {
        console.warn(errors);
        res.status(400).send({errors: errors});
    } else {
        Task
            .createTask(req.body)
            .then(result => {
                res.status(200).send({result: result});
            })
            .catch(errors => {
                console.warn(errors);
                res.status(400).send({errors: errors});
            });
    }
});

//====================== UPDATE TASK ==========================================

router.put('/update-task/:id', function (req, res) {

    let description = req.body.description;
    let planedExecutorID = req.body.planedExecutorID;
    let cost = req.body.cost;
    let estimationTime = req.body.estimationTime;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    req.checkBody('description', '"Описание задачи" - обязательное поле.').notEmpty();
    req.checkBody('planedExecutorID', '"Исполнитель" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Цена" - обязательное поле.').notEmpty();
    req.checkBody('estimationTime', '"Планируемове время" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('endTime', '"Конечное время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.warn(errors);
        res.status(400).send({errors: errors});
    } else {

        let taskID = req.body.id;
        let params = req.body;

        Task
            .updateTask(taskID, params)
            .then(() => {
                Task
                    .getTaskById(taskID)
                    .then(task => {
                        res.status(200).send({task: task});
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
    }
});

router.delete('/delete-task/:id', function (req, res) {

    let taskID = req.params.id;
    Task
        .destroy({
            where: {
                id: Number(taskID)
            }
        })
        .then(() => {
            res.status(200).send({id: taskID});
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        })
});

router.post('/change-request-status/:id', (req, res) => {
    Request.changeStatus(req.params.id, req.body.statusID)
        .then(()=> {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Статус успешно изменен.');
            res.redirect(req.baseUrl + '/requests');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect(req.baseUrl + '/requests');
        })
});

module.exports = router;
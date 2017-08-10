"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');

const express = require('express');
const router = express.Router();

const roles = require('../../constants/roles');
const validation = require('../../middleware/validation');

router.get('/users', function (req, res) {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/users', {users: users, typeUser: req.session.passport.user.userTypeID});
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/users');
        });
});

router.post('/create-user', validation.createAndUpdateUser(roles.ADMIN), function (req, res) {
    User
        .createUser(req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Добавление прошло успешно.');
            res.redirect('/admin/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
            res.redirect('/admin/users');
        });
});

router.put('/update-user/:id', validation.createAndUpdateUser(roles.ADMIN), function (req, res) {

    User
        .updateUser(req.params.id, req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Изменение прошло успешно.');
            res.redirect('/admin/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect('/admin/users');
        });
});

router.delete('/delete-user/:id', function (req, res) {
    User
        .deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('/admin/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('/admin/users');
        });
});

router.get('/requests', function (req, res) {
    Task
        .getAllTasks()
        .then(result => {

            //==============================================
            var requests = {};

            function formatDate(date) {
                return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
            }

            result.map(item => {
                if (requests[item.request.id] === undefined) {
                    requests[item.request.id] = item.request.dataValues;
                    requests[item.request.id].user = item.request.dataValues.user.dataValues;
                    requests[item.request.id].executor = item.user.dataValues;
                    requests[item.request.id].startTime = formatDate(requests[item.request.id].startTime);
                    requests[item.request.id].estimatedTime = formatDate(requests[item.request.id].estimatedTime);
                    requests[item.request.id].tasks = [];
                }

                var task = item.dataValues;
                task.estimationTime = formatDate(task.estimationTime);
                task.startTime = formatDate(task.startTime);
                task.endTime = formatDate(task.endTime);
                delete task.request;

                requests[item.request.id].tasks.push(task);
            });

            requests = Object.values(requests);
            //==============================================

            console.log( 88888888888888888888888888, requests[0]);

            res.render('roles/admin_moderator/requests', {
                requests: requests,
                typeUser: req.session.passport.user.userTypeID
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
                .getExecutorUsers()
                .then(usersExecutors =>
                    res.render('roles/admin_moderator/create-request', {
                        executors: usersExecutors,
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
    let cost = req.body.cost;
    let startTime = req.body.startTime;
    let estimatedTime = req.body.estimatedTime;
    // Validation

    req.checkBody('cost', '"Стоемость" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('estimatedTime', '"Планируемове время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.status(400).send({errors: errors});
    } else {
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
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/update_request', {
                users: users,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/update_request');
        });
});

router.put('/update-request/:id', function (req, res) {

});

router.delete('/delete-request/:id', function (req, res) {
    Request
        .deleteRequest(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('/admin/requests');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('/admin/requests');
        });
});

router.post('/create-task', function (req, res) {

    let taskDescription = req.body.taskDescription;
    let planedExecutorID = req.body.planedExecutorID;
    let cost = req.body.cost;
    let estimationTime = req.body.estimationTime;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    /* let parts = req.body.parts;
     let customerParts = req.body.customerParts;
     let needBuyParts = req.body.needBuyParts;
     let taskComments = req.body.taskComments;*/

    // Validation

    req.checkBody('taskDescription', '"Описание задачи" - обязательное поле.').notEmpty();
    req.checkBody('planedExecutorID', '"Исполнитель" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Цена" - обязательное поле.').notEmpty();
    req.checkBody('estimationTime', '"Планируемове время" - обязательное поле.').notEmpty();
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

module.exports = router;
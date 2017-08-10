"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');

const express = require('express');
const router = express.Router();

const roles = require('../../constants/roles');
const validationUserParams = require('../../helpers/validationUserParams');

router.get('/users', function (req, res) {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/users', {
                users: users,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(err => {
            console.warn(err);
            res.render('roles/admin_moderator/users');
        });
});

router.post('/create-user', function (req, res) {

    let errors = validationUserParams(req, roles.ADMIN);

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/admin/users');
    } else {
        User.createUser(req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Добавление прошло успешно.');
                res.redirect('/admin/users');
            })
            .catch(err => {
                console.log(err);
                req.flash('error_alert', true);
                req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
                res.redirect('/admin/users');
            });
    }
});

router.put('/update-user/:id', function (req, res) {

    let errors = validationUserParams(req, roles.ADMIN);

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/admin/users');
    } else {
        User.updateUser(req.params.id, req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Изменение прошло успешно.');
                res.redirect('/admin/users');
            }).catch(err => {
            console.log(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect('/admin/users');
        });
    }
});

router.delete('/delete-user/:id', function (req, res) {
    User.deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('/admin/users');
        })
        .catch(err => {
            console.warn(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('/admin/users');
        });
});

router.get('/requests', function (req, res) {
    Request
        .getAllRequests()
        .then(result => {
            res.render('roles/admin_moderator/requests', {
                requests: result,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(err => {
            console.warn(err);
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
        Request.createRequest(req.body)
            .then((result) => {
                res.status(200).send({result: result});
            })
            .catch(errors => {
                res.status(400).send({errors: errors});
            });
    }
});

router.get('/update-request', function (req, res) {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/update_request', {
                users: users,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(err => {
            console.warn(err);
            res.render('roles/admin_moderator/update_request');
        });
});

router.put('/update-request/:id', function (req, res) {

});

router.delete('/delete-request/:id', function (req, res) {
    Request.deleteRequest(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('/admin/requests');
        })
        .catch(err => {
            console.warn(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('/admin/requests');
        });
});

router.post('/create-task', function (req, res) {
    Task
        .createTask(req.body)
        .then(result => {
            res.status(200).send({result: result});
        })
        .catch(error => {
            console.warn(error);
            res.status(400).send({error: error});
        });
});

module.exports = router;
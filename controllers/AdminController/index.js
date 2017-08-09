"use strict";

const User = require('../../models/User');
const Request = require('../../models/Request');
const express = require('express');
const router = express.Router();
const roles = require('../../constants/roles');
const validationUserParams = require('../../helpers/validationUserParams');

router.get('/users', function (req, res) {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/users', {users: users, typeUser: req.session.passport.user.userTypeID});
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
        .then(requests => {
            res.render('roles/admin_moderator/requests', {
                requests: requests,
                typeUser: req.session.passport.user.userTypeID
            });
        })
});

router.get('/create-request', function (req, res) {
    User.getAllUsers().then(function (users) {
        res.render('roles/admin_moderator/create-request', {users:users,typeUser: req.session.passport.user.userTypeID});
    })

});

router.post('/create-request', function (req, res) {
    let requestPrice = req.body.requestPrice;
    let requestStartTime = req.body.requestStartTime;
    let requestEstimatedTime = req.body.requestEstimatedTime;
    // Validation

    req.checkBody('requestPrice', '"Цена" - обязательное поле.').notEmpty();
    req.checkBody('requestStartTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('requestEstimatedTime', '"Планируемове время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        console.info('11111УУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУ');
        res.redirect('/admin/requests');
    } else {
        Request.createRequest(req.body)
            .then(() => {
                console.info('2222УУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУ');
                req.flash('success_alert', true);
                req.flash('success_msg', 'Добавление прошло успешно.');
                res.render('/layouts/create-request');
            })
            .catch(err => {
                console.log(err);
                console.info('3333УУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУУ');
                req.flash('error_alert', true);
                req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
                res.redirect('/admin/create-request');
            });
    }
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

module.exports = router;
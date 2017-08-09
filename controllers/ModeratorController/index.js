"use strict";

const User = require('../../models/User');
const Request = require('../../models/Request');
const express = require('express');
const router = express.Router();
const validationUserParams = require('../../helpers/validationUserParams');

router.get('/users', (req, res) => {
    if (req.session.passport.user) {
        User.getModeratorUsers()
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
    } else {
        res.redirect('/');
    }
});

router.post('/create-user', function (req, res) {

    let errors = validationUserParams(req);

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('roles/admin_moderator/users');
    } else {
        req.body.userTypeID = '5';
        User.createUser(req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Добавление прошло успешно.');
                res.redirect('roles/admin_moderator/users');
            })
            .catch(err => {
                console.log(err);
                req.flash('error_alert', true);
                req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
                res.redirect('roles/admin_moderator/users');
            });
    }
});

router.put('/update-user/:id', function (req, res) {

    let errors = validationUserParams(req);

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('roles/admin_moderator/users');
    } else {
        User.updateUser(req.params.id, req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Изменение прошло успешно.');
                res.redirect('roles/admin_moderator/users');
            }).catch(err => {
            console.log(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect('roles/admin_moderator/users');
        });
    }
});

router.delete('/delete-user/:id', function (req, res) {
    User.deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('roles/admin_moderator/users');
        })
        .catch(err => {
            console.warn(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('roles/admin_moderator/users');
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
    res.render('roles/admin_moderator/create-request', {typeUser: req.session.passport.user.userTypeID});
});

module.exports = router;
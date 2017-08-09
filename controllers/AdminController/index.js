"use strict";

const User = require('../../models/User');
const Request = require('../../models/Request');
const express = require('express');
const router = express.Router();

router.get('/users', function (req, res) {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin', {users: users, typeUser: req.session.passport.user.userTypeID});
        })
        .catch(err => {
            console.warn(err);
            res.render('roles/admin');
        });
});

router.post('/create-user', function (req, res) {

    let userName = req.body.userName;
    let userSurname = req.body.userSurname;
    let userCompanyName = req.body.userCompanyName;
    let userAddress = req.body.userAddress;
    let userPhone = req.body.userPhone;
    let userLogin = req.body.userLogin;
    let userEmail = req.body.userEmail;
    let userTypeID = req.body.userTypeID;
    let userPassword = req.body.userPassword;

    // Validation
    req.checkBody('userName', '"Имя" - обязательное поле.').notEmpty();
    req.checkBody('userSurname', '"Фамилия" - обязательное поле.').notEmpty();
    req.checkBody('userCompanyName', '"Компания" - обязательное поле.').notEmpty();
    req.checkBody('userAddress', '"Адрес" - обязательное поле.').notEmpty();
    req.checkBody('userPhone', '"Контактный номер" - обязательное поле.').notEmpty();
    req.checkBody('userLogin', '"Логин" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - некорректное поле.').isEmail();
    req.checkBody('userTypeID', '"Роль" - обязательное поле.').notEmpty();
    req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/admin');
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
    let userName = req.body.userName;
    let userSurname = req.body.userSurname;
    let userCompanyName = req.body.userCompanyName;
    let userAddress = req.body.userAddress;
    let userPhone = req.body.userPhone;
    let userLogin = req.body.userLogin;
    let userEmail = req.body.userEmail;
    let userTypeID = req.body.userTypeID;
    let userPassword = req.body.userPassword;

    // Validation
    req.checkBody('userName', '"Имя" - обязательное поле.').notEmpty();
    req.checkBody('userSurname', '"Фамилия" - обязательное поле.').notEmpty();
    req.checkBody('userCompanyName', '"Компания" - обязательное поле.').notEmpty();
    req.checkBody('userAddress', '"Адрес" - обязательное поле.').notEmpty();
    req.checkBody('userPhone', '"Контактный номер" - обязательное поле.').notEmpty();
    req.checkBody('userLogin', '"Логин" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - некорректное поле.').isEmail();
    req.checkBody('userTypeID', '"Роль" - обязательное поле.').notEmpty();
    req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/admin');
    } else {
        User.updateUser(req.params.id, req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Изменение прошло успешно.');
                res.redirect('/admin');
            }).catch(err => {
            console.log(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect('/admin');
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
            res.render('roles/admin', {requests: requests, typeUser: req.session.passport.user.userTypeID});
        })
});

router.get('/create-request',function (req,res) {
    res.render('layouts/create-request', {typeUser: req.session.passport.user.userTypeID});
});

router.post('/create-request', function (req, res) {

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
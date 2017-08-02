"use strict";

const User = require('../../models/User');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        User.getModeratorUsers()
            .then(users => {
                res.render('roles/moderator', {users: users, typeUser: req.session.passport.user.id_type_user});
            })
            .catch(err => {
                console.warn(err);
                res.render('roles/moderator');
            });
    } else {
        res.redirect('/');
    }
});

router.post('/create-user', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var companyUser = req.body.companyUser;
    var addressUser = req.body.addressUser;
    var phoneUser = req.body.phoneUser;
    var loginUser = req.body.loginUser;
    var emailUser = req.body.emailUser;
    var passwordUser = req.body.passwordUser;

    // Validation
    req.checkBody('firstName', '"Имя" - обязательное поле.').notEmpty();
    req.checkBody('lastName', '"Фамилия" - обязательное поле.').notEmpty();
    req.checkBody('companyUser', '"Компания" - обязательное поле.').notEmpty();
    req.checkBody('addressUser', '"Адрес" - обязательное поле.').notEmpty();
    req.checkBody('phoneUser', '"Контактный номер" - обязательное поле.').notEmpty();
    req.checkBody('loginUser', '"Логин" - обязательное поле.').notEmpty();
    req.checkBody('emailUser', '"Email" - обязательное поле.').notEmpty();
    req.checkBody('emailUser', '"Email" - некорректное поле.').isEmail();
    req.checkBody('passwordUser', '"Пароль" - обязательное поле.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/moderator');
    } else {
        req.body.idTypeUser = '5';
        User.createUser(req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Добавление прошло успешно.');
                res.redirect('/moderator');
            })
            .catch(err => {
                console.log(err);
                req.flash('error_alert', true);
                req.flash('error_msg', {msg: 'Возникла ошибка при добавлении.'});
                res.redirect('/moderator');
            });
    }
});

router.put('/update-user/:id', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var companyUser = req.body.companyUser;
    var addressUser = req.body.addressUser;
    var phoneUser = req.body.phoneUser;
    var loginUser = req.body.loginUser;
    var emailUser = req.body.emailUser;
    var passwordUser = req.body.passwordUser;

    // Validation
    req.checkBody('firstName', '"Имя" - обязательное поле.').notEmpty();
    req.checkBody('lastName', '"Фамилия" - обязательное поле.').notEmpty();
    req.checkBody('companyUser', '"Компания" - обязательное поле.').notEmpty();
    req.checkBody('addressUser', '"Адрес" - обязательное поле.').notEmpty();
    req.checkBody('phoneUser', '"Контактный номер" - обязательное поле.').notEmpty();
    req.checkBody('loginUser', '"Логин" - обязательное поле.').notEmpty();
    req.checkBody('emailUser', '"Email" - обязательное поле.').notEmpty();
    req.checkBody('emailUser', '"Email" - некорректное поле.').isEmail();
    req.checkBody('passwordUser', '"Пароль" - обязательное поле.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('error_alert', true);
        req.flash('error_msg', errors);
        res.redirect('/moderator');
    } else {
        User.updateUser(req.params.id, req.body)
            .then(() => {
                req.flash('success_alert', true);
                req.flash('success_msg', 'Изменение прошло успешно.');
                res.redirect('/moderator');
            }).catch(err => {
            console.log(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect('/moderator');
        });
    }
});

router.delete('/delete-user/:id', function (req, res) {
    User.deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Удаление прошло успешно.');
            res.redirect('/moderator');
        })
        .catch(err => {
            console.warn(err);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при удалении.'});
            res.redirect('/moderator');
        });
});

module.exports = router;
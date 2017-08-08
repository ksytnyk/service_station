"use strict";

const User = require('../../models/User');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        User.getModeratorUsers()
            .then(users => {
                res.render('roles/moderator', {users: users, typeUser: req.session.passport.user.userTypeID});
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
    let userName = req.body.userName;
    let userSurname = req.body.userSurname;
    let userCompanyName = req.body.userCompanyName;
    let userAddress = req.body.userAddress;
    let userPhone = req.body.userPhone;
    let userLogin = req.body.userLogin;
    let userEmail = req.body.userEmail;
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
    req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

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
    let userName = req.body.userName;
    let userSurname = req.body.userSurname;
    let userCompanyName = req.body.userCompanyName;
    let userAddress = req.body.userAddress;
    let userPhone = req.body.userPhone;
    let userLogin = req.body.userLogin;
    let userEmail = req.body.userEmail;
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
    req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

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
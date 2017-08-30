"use strict";

const roles = require('../../constants/roles');

module.exports = {

    createAndUpdateUser: function () {

        return function (req, res, next) {

            function spaceCleaner(value) {
                return value.replace(/\s+/g, '');
            }

            for (let key in req.body) {
                req.body[key] = spaceCleaner(req.body[key]);
            }

            req.checkBody('userName', '"Ім\'я" - обов\'язкове поле.').notEmpty();
            req.checkBody('userSurname', '"Прізвище" - обов\'язкове поле.').notEmpty();
            req.checkBody('userCompanyName', '"Компанія" - обов\'язкове поле.').notEmpty();
            req.checkBody('userAddress', '"Адреса" - обов\'язкове поле.').notEmpty();
            req.checkBody('userPhone', '"Контактний номер" - обов\'язкове поле.').isLength({ min: 13 });
            req.checkBody('userLogin', '"Логін" - обов\'язкове поле.').notEmpty();
            req.checkBody('userEmail', '"Email" - обов\'язкове поле.').notEmpty();
            req.checkBody('userEmail', '"Email" - обов\'язкове поле.').isEmail();
            req.checkBody('userPassword', '"Пароль" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                req.flash('error_alert', true);
                req.flash('error_msg', errors);
                res.redirect(req.baseUrl + '/users');
            } else {
                next();
            }
        };
    },

    createAndUpdateRequest: function () {
        return function (req, res, next) {

            let name = req.body.name;
            let customerID = req.body.customerID;
            let startTime = req.body.startTime;
            let estimatedTime = req.body.estimatedTime;
            let carMarkk = req.body.carMarkk;
            let carModel = req.body.carModel;

            req.checkBody('name', '"Назва замовлення" - обов\'язкове поле.').notEmpty();
            req.checkBody('customerID', '"Клієнт" - обов\'язкове поле.').notEmpty();
            req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
            req.checkBody('estimatedTime', '"Запланований час" - обов\'язкове поле.').notEmpty();
            req.checkBody('carMarkk', '"Марка автомобіля" - обов\'язкове поле.').notEmpty();
            req.checkBody('carModel', '"Модель автомобіля" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);
                res.status(400).send({errors: errors});
            } else {
                next();
            }
        }
    },

    createAndUpdateTask: function () {
        return function (req, res, next) {

            if(req.baseUrl === '/executor' || req.baseUrl === '/admin' || req.baseUrl === '/moderator'){
                let cost = req.body.cost;
                let estimationTime = req.body.estimationTime;
                let startTime = req.body.startTime;

                req.checkBody('cost', '"Вартість" - обов\'язкове поле.').notEmpty();
                req.checkBody('cost', 'Поле "Вартість" може містити лише цифри.').isFloat();
                req.checkBody('estimationTime', '"Час виконання" - обов\'язкове поле.').notEmpty();
                req.checkBody('estimationTime', 'Поле "Час виконання" може містити лише цифри.').isFloat();
                req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
            }

            if(req.baseUrl === '/admin' || req.baseUrl === '/moderator') {
                let name = req.body.name;
                let planedExecutorID = req.body.planedExecutorID;
                let assignedUserID = req.body.assignedUserID;

                req.checkBody('name', '"Назва задачі" - обов\'язкове поле.').notEmpty();
                req.checkBody('planedExecutorID', '"Виконавець" - обов\'язкове поле.').notEmpty();
                req.checkBody('assignedUserID', '"Доручити задачу" - обов\'язкове поле.').notEmpty();
            }

            else if (req.baseUrl === '/store-keeper'){
                let needBuyParts = req.body.needBuyParts;

                req.checkBody('needBuyParts', '"Відсутні запчастини" - обов\'язкове поле.').notEmpty();
            }

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);
                res.status(400).send({errors: errors});
            } else {
                next();
            }
        }
    },

    createGlobalRequest: function () {
        return function (req, res, next) {

            req.checkBody('carMarkk', '"Марка автомобіля" - обов\'язкове поле.').notEmpty();
            req.checkBody('carModel', '"Модель автомобіля" - обов\'язкове поле.').notEmpty();
            req.checkBody('name', '"Назва замовлення" - обов\'язкове поле.').notEmpty();
            req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
            req.checkBody('estimatedTime', '"Запланований час" - обов\'язкове поле.').notEmpty();
            req.checkBody('cost', '"Вартість" - обов\'язкове поле.').notEmpty();
            req.checkBody('cost', 'Поле "Вартість" може містити лише цифри.').isFloat();
            req.checkBody('planedExecutorID', '"Виконавець" - обов\'язкове поле.').notEmpty();
            req.checkBody('assignedUserID', '"Доручити задачу" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);
                res.status(400).send({errors: errors});
            } else {
                next();
            }
        }
    }
};


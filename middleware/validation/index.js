"use strict";

const roles = require('../../constants/roles');

module.exports = {

    createAndUpdateUser: function () {

        return function (req, res, next) {

            let role = req.baseUrl;
            let userName = req.body.userName;
            let userSurname = req.body.userSurname;
            let userCompanyName = req.body.userCompanyName;
            let userAddress = req.body.userAddress;
            let userPhone = req.body.userPhone;
            let userLogin = req.body.userLogin;
            let userEmail = req.body.userEmail;
            let userPassword = req.body.userPassword;

            if (role === '/admin') {
                let userTypeID = req.body.userTypeID;
                req.checkBody('userTypeID', '"Роль" - обязательное поле.').notEmpty();
            }

            req.checkBody('userName', '"Имя" - обязательное поле.').notEmpty();
            req.checkBody('userSurname', '"Фамилия" - обязательное поле.').notEmpty();
            req.checkBody('userCompanyName', '"Компания" - обязательное поле.').notEmpty();
            req.checkBody('userAddress', '"Адрес" - обязательное поле.').notEmpty();
            req.checkBody('userPhone', '"Контактный номер" - обязательное поле.').notEmpty();
            req.checkBody('userLogin', '"Логин" - обязательное поле.').notEmpty();
            req.checkBody('userEmail', '"Email" - обязательное поле.').notEmpty();
            req.checkBody('userEmail', '"Email" - некорректное поле.').isEmail();
            req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

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
            let cost = +req.body.cost;
            let startTime = req.body.startTime;
            let estimatedTime = req.body.estimatedTime;

            req.checkBody('name', '"Имя заказа" - обязательное поле.').notEmpty();
            req.checkBody('customerID', '"Клиент" - обязательное поле.').notEmpty();
            req.checkBody('cost', '"Стоимость" - обязательное поле.').notEmpty();
            req.checkBody('cost', 'Неправильный формат цены в поле "Стоимость".').isFloat();
            req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
            req.checkBody('estimatedTime', '"Планируемове время" - обязательное поле.').notEmpty();

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

            if(req.baseUrl==='/executor' || req.baseUrl==='/admin' || req.baseUrl==='/moderator'){
                let description = req.body.description;
                let cost = req.body.cost;
                let estimationTime = req.body.estimationTime;
                let startTime = req.body.startTime;
                let endTime = req.body.endTime;

                req.checkBody('description', '"Описание задачи" - обязательное поле.').notEmpty();
                req.checkBody('cost', '"Цена" - обязательное поле.').notEmpty();
                req.checkBody('cost', 'Неправильный формат цены в поле "Стоимость".').isFloat();
                req.checkBody('estimationTime', '"Планируемове время" - обязательное поле.').notEmpty();
                req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
                req.checkBody('endTime', '"Конечное время" - обязательное поле.').notEmpty();
            }

            if(req.baseUrl==='/admin' || req.baseUrl==='/moderator') {
                let name = req.body.name;
                let planedExecutorID = req.body.planedExecutorID;
                let assignedUserID = req.body.assignedUserID;

                req.checkBody('name', '"Имя задачи" - обязательное поле.').notEmpty();
                req.checkBody('planedExecutorID', '"Исполнитель" - обязательное поле.').notEmpty();
                req.checkBody('assignedUserID', '"Поручить задачу" - обязательное поле.').notEmpty();
            }

            else if (req.baseUrl==='/store-keeper'){
                let needBuyParts = req.body.needBuyParts;

                req.checkBody('needBuyParts', 'Недостающие запчасти - обязательное поле.').notEmpty();
            }

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


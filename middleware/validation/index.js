"use strict";

const roles = require('../../constants/roles');

module.exports = {

    createAndUpdateTransportMarkk: function (value) {
        return function (req, res, next) {

            req.checkBody('transportMarkkName', '"Назва марки транспорту" - обов\'язкове поле.').notEmpty();
            req.checkBody('transportTypeID', '"Тип транспорту" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                if (value) {
                    console.warn(errors);
                    req.flash('error_alert', true);
                    req.flash('error_msg', errors);
                    res.redirect('back');
                } else {
                    res.status(400).send({
                        errors: errors
                    });
                }
            } else {
                next();
            }
        };
    },

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
            // req.checkBody('userAddress', '"Адреса" - обов\'язкове поле.').notEmpty();
            req.checkBody('userPhone', '"Контактний номер" - обов\'язкове поле.').isLength({min: 13});
            req.checkBody('userLogin', '"Логін" - обов\'язкове поле.').notEmpty();
            // req.checkBody('userEmail', '"Email" - обов\'язкове поле.').notEmpty();
            // req.checkBody('userEmail', '"Email" - помилковий формат.').isEmail();
            req.checkBody('userPassword', '"Пароль" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                res.status(400).send({
                    errors: errors
                });
            } else {
                next();
            }
        };
    },

    createAndUpdateRequest: function () {
        return function (req, res, next) {

            req.checkBody('name', '"Назва замовлення" - обов\'язкове поле.').notEmpty();
            req.checkBody('customerID', '"Клієнт" - обов\'язкове поле.').notEmpty();
            req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
            req.checkBody('estimatedTime', '"Орієнтовний час виконання" - обов\'язкове поле.').notEmpty();
            req.checkBody('transportMarkkID', '"Марка автомобіля" - обов\'язкове поле.').notEmpty();
            req.checkBody('transportModelID', '"Модель автомобіля" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);
                res.status(400).send({
                    errors: errors
                });
            } else {
                next();
            }
        }
    },

    createAndUpdateTask: function () {
        return function (req, res, next) {

            if (req.baseUrl === '/executor' || req.baseUrl === '/admin' || req.baseUrl === '/moderator') {
                req.checkBody('cost', '"Вартість" - обов\'язкове поле.').notEmpty();
                req.checkBody('cost', 'Поле "Вартість" може містити лише цифри.').isFloat();
                req.checkBody('estimationTime', '"Час виконання" - обов\'язкове поле.').notEmpty();
                req.checkBody('estimationTime', 'Поле "Час виконання" може містити лише цифри.').isFloat();
                req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
            }

            if (req.baseUrl === '/admin' || req.baseUrl === '/moderator') {
                req.checkBody('name', '"Назва задачі" - обов\'язкове поле.').notEmpty();
                req.checkBody('planedExecutorID', '"Виконавець" - обов\'язкове поле.').notEmpty();
                req.checkBody('assignedUserID', '"Доручити задачу" - обов\'язкове поле.').notEmpty();
            }

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);
                res.status(400).send({
                    errors: errors
                });
            } else {
                next();
            }
        }
    },

    // createGlobalRequest: function () {
    //     return function (req, res, next) {
    //
    //         req.checkBody('carMarkk', '"Марка автомобіля" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('carModel', '"Модель автомобіля" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('name', '"Назва замовлення" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('startTime', '"Час початку" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('estimatedTime', '"Запланований час" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('cost', '"Вартість" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('cost', 'Поле "Вартість" може містити лише цифри.').isFloat();
    //         req.checkBody('planedExecutorID', '"Виконавець" - обов\'язкове поле.').notEmpty();
    //         req.checkBody('assignedUserID', '"Доручити задачу" - обов\'язкове поле.').notEmpty();
    //
    //         let errors = req.validationErrors();
    //
    //         if (errors) {
    //             console.warn(errors);
    //             res.status(400).send({errors: errors});
    //         } else {
    //             next();
    //         }
    //     }
    // },

    createAndUpdateTaskType: function () {
        return function (req, res, next) {

            for (let key in req.body) {
                if (({}).hasOwnProperty.call(req.body, key) && req.body[key] === '') {
                    req.body[key] = null
                }
            }

            req.checkBody('typeName', '"Назва задачі" - обов\'язкове поле.').notEmpty();
            /*req.checkBody('cost', '"Вартість" - обов\'язкове поле.').notEmpty();
            req.checkBody('cost', 'Поле "Вартість" може містити лише цифри.').isFloat();*/

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);

                /*if (value) {
                    req.flash('error_alert', true);
                    req.flash('error_msg', errors);
                    res.redirect(req.baseUrl + '/task-type');
                } else {*/
                res.status(400).send({
                    errors: errors
                });
                //}
            } else {
                next();
            }
        }
    },

    createAndUpdateTransportType: function (value) {
        return function (req, res, next) {

            req.checkBody('transportTypeName', '"Назва типу транспорту" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);

                if (value) {
                    req.flash('error_alert', true);
                    req.flash('error_msg', errors);
                    res.redirect(req.baseUrl + '/transport-type');
                } else {
                    res.status(400).send({
                        errors: errors
                    });
                }
            } else {
                next();
            }
        }
    },

    createAndUpdateTransportModel: function (value) {
        return function (req, res, next) {

            req.checkBody('transportMarkkID', '"Назва марки транспорту" - обов\'язкове поле.').notEmpty();
            req.checkBody('transportModelName', '"Назва моделі транспорту" - обов\'язкове поле.').notEmpty();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);

                if (value) {
                    req.flash('error_alert', true);
                    req.flash('error_msg', errors);
                    res.redirect(req.baseUrl + '/transport-model');
                } else {
                    res.status(400).send({
                        errors: errors
                    });
                }
            } else {
                next();
            }
        }
    },

    createAndUpdateDetail: function (value) {
        return function (req, res, next) {

            req.checkBody('detailName', '"Назва деталі" - обов\'язкове поле.').notEmpty();
            req.checkBody('detailPrice', '"Вартість" - обов\'язкове поле.').notEmpty();
            req.checkBody('detailCode', '"Код деталі" - обов\'язкове поле.').notEmpty();
            req.checkBody('detailPrice', 'Поле "Вартість" може містити лише цифри.').isFloat();

            let errors = req.validationErrors();

            if (errors) {
                console.warn(errors);

                if (value) {
                    req.flash('error_alert', true);
                    req.flash('error_msg', errors);
                    res.redirect(req.baseUrl + '/details');
                } else {
                    res.status(400).send({
                        errors: errors
                    });
                }
            } else {
                next();
            }
        }
    },
};


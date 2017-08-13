"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const formatDate = require('../../helpers/formatDate');

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        Task
            .getTaskByExecutorId(req.session.passport.user.id)
            .then(result => {

                for (var i = 0; i < result.length; i++) {
                    result[i].dataValues.estimationTime = formatDate(result[i].dataValues.estimationTime);
                    result[i].dataValues.startTime = formatDate(result[i].dataValues.startTime);
                    result[i].dataValues.endTime = formatDate(result[i].dataValues.endTime);
                }

                res.render('roles/executor', {
                    typeUser: req.session.passport.user.userTypeID,
                    tasks: result
                });
            });
    } else {
        res.redirect('/');
    }
});

router.put('/update-task/:id', function (req, res) {
    let description = req.body.description;
    let cost = req.body.cost;
    let estimationTime = req.body.estimationTime;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;

    req.checkBody('description', '"Описание задачи" - обязательное поле.').notEmpty();
    req.checkBody('cost', '"Цена" - обязательное поле.').notEmpty();
    req.checkBody('estimationTime', '"Планируемове время" - обязательное поле.').notEmpty();
    req.checkBody('startTime', '"Время начала" - обязательное поле.').notEmpty();
    req.checkBody('endTime', '"Конечное время" - обязательное поле.').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.warn(errors);
        res.status(400).send({errors: errors});
    } else {

        let taskID = req.body.id;
        let params = req.body;

        Task
            .updateTask(taskID, params)
            .then(() => {
                Task
                    .getTaskById(taskID)
                    .then(task => {
                        res.status(200).send({task: task});
                    })
                    .catch(errors => {
                        console.warn(errors);
                        res.status(400).send({errors: errors});
                    });
            })
            .catch(errors => {
                console.warn(errors);
                res.status(400).send({errors: errors});
            });
    }
});

router.post('/set-status/:id', function (req, res) {
    Task
        .updateTask(req.params.id, req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Изменение прошло успешно.');
            res.redirect(req.baseUrl);
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении.'});
            res.redirect(req.baseUrl);
        });
});

module.exports = router;

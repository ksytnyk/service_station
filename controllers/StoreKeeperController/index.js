"use strict";

const express = require('express');
const router = express.Router();
const status = require('../../constants/status');
const Task = require('../../models/Task');
const formatDate = require('../../helpers/formatDate');
const validation = require('../../middleware/validation');

router.get('/', (req, res) => {
    Task
        .getAllTasksForStore(req.session.passport.user.id)
        .then(result => {

            for (var i = 0; i < result.length; i++) {
                result[i].dataValues.estimationTime = formatDate(result[i].dataValues.estimationTime);
                result[i].dataValues.startTime = formatDate(result[i].dataValues.startTime);
                result[i].dataValues.endTime = formatDate(result[i].dataValues.endTime);
            }

            res.render('roles/storekeeper', {
                typeUser: req.session.passport.user.userTypeID,
                tasks: result
            });
        })
        .catch(error => {
            console.warn(error);
        });
});

router.post('/task-hold', (req, res) => {
    Task
        .changeTaskStatus(req.body.taskID, status.HOLD)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Изменение статуса прошло успешно.');
            res.redirect('/store-keeper')
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Возникла ошибка при изменении статуса.'});
            res.redirect(req.baseUrl);
        });
});

router.post('/task-confirm', (req, res) => {
    Task
        .getTaskById(req.body.taskID)
        .then(result => {
            Task
                .changeTaskStatusWithPending(req.body.taskID, status.PENDING, result.planedExecutorID)
                .then(() => {
                    req.flash('success_alert', true);
                    req.flash('success_msg', 'Изменение статуса прошло успешно.');
                    res.redirect('/store-keeper');
                })
                .catch(error => {
                    console.warn(error);
                    req.flash('error_alert', true);
                    req.flash('error_msg', {msg: 'Возникла ошибка при изменении статуса.'});
                    res.redirect(req.baseUrl);
                });
        });
});


router.put('/update-task/:id', validation.createAndUpdateTask(), (req, res) => {
    Task
        .updateTask(req.body.id, req.body)
        .then(() => {
            Task
                .getTaskById(req.body.id)
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
});

module.exports = router;
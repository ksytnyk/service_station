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

router.post('/set-status/:id', (req, res) => {
    Task
        .updateTask(req.params.id, req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Статус успішно змінений.');
            res.redirect(req.baseUrl);
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при зміні статусу.'});
            res.redirect(req.baseUrl);
        });
});

module.exports = router;
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
            res.redirect('/store-keeper')
        })
});


router.post('/task-confirm', (req, res) => {
    Task
        .getTaskById(req.body.taskID)
        .then(result => {
            Task
                .changeTaskStatusWithPending(req.body.taskID, status.PENDING, result.planedExecutorID)
                .then(() => {
                    res.redirect('/store-keeper');
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
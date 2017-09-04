"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const formatDate = require('../../helpers/formatDate');
const countEndTime = require('../../helpers/countEndTime');
const validation = require('../../middleware/validation');

router.get('/', (req, res) => {
    Task
        .getTaskByExecutorId(req.session.passport.user.id)
        .then(result => {

            for (var i = 0; i < result.length; i++) {
                result[i].dataValues.startTime = formatDate(result[i].dataValues.startTime);
                result[i].dataValues.endTime = formatDate(result[i].dataValues.endTime);
            }
            res.render('roles/executor', {
                typeUser: req.session.passport.user.userTypeID,
                tasks: result
            });
        });
});

router.put('/update-task/:id', validation.createAndUpdateTask(), (req, res) => {
    req.body.endTime = countEndTime(req.body.startTime, +req.body.estimationTime);

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

router.put('/set-task-status/:id', (req, res) => {
    Task
        .changeTaskStatus(req.params.id, req.body.status)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

module.exports = router;

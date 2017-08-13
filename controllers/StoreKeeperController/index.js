"use strict";

const express = require('express');
const router = express.Router();
const status = require('../../constants/status');
const Task = require('../../models/Task');

router.get('/', (req, res) => {
    if (req.session.passport.user) {

        Task
            .getAllTasksForStore(req.session.passport.user.id)
            .then(tasks => {
                res.render('roles/storekeeper', {
                    typeUser: req.session.passport.user.userTypeID,
                    tasks: tasks
                });
            })
            .catch(error => {
                console.warn(error);
            });
    } else {
        res.redirect('/');
    }
});

router.post('/task-hold', (req, res) => {
    Task
        .changeTaskStatus(req.body.taskID, status.HOLD)
        .then(() => {
            res.redirect('/store-keeper')
        })
});


router.post('/task-done', (req, res) => {
    Task
        .getTaskById(req.body.taskID)
        .then(result => {
            console.log('========================================1', result);
            Task
                .changeTaskStatusWithPending(req.body.taskID, status.PENDING, result.planedExecutorID)
                .then(() => {
                    res.redirect('/store-keeper');
                });
        });
});


router.put('/update-task/:id', function (req, res) {

    
    let taskID = req.body.id;
    let params = req.body;
    // req.body.status = status.PENDING;
    // console.log('==========================================', req.body);
    //
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
});

module.exports = router;
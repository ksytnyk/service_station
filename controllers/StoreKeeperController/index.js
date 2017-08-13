"use strict";

const express = require('express');
const router = express.Router();

const Task = require('../../models/Task');

router.get('/', (req, res) => {
    if (req.session.passport.user) {

        Task
            .getAllTasksForStore()
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

module.exports = router;
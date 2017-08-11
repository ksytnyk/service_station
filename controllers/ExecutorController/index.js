"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        Task
            .getTaskByExecutorId(req.session.passport.user.id)
            .then(result => {
                console.log('===============================================================================', result);
                res.render('roles/executor', {typeUser: req.session.passport.user.userTypeID, task: result});        
            });
    } else {
        res.redirect('/');
    }
});

module.exports = router;

"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const requestsFactory = require('../../helpers/requestsFactory');

router.get('/', (req, res) => {
    Task
        .getAllTasksForCustomer(req.session.passport.user.id)
        .then(function (result) {
            res.render('roles/customer', {
                user: req.session.passport.user,
                requests: requestsFactory(result),
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/customer');
        });
});

module.exports = router;
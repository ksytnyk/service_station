"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const Request = require('../../models/Request');
const requestsFactory = require('../../helpers/requestsFactory');

router.get('/', (req, res) => {
    Request
        .getAllRequestsByCustomerId(req.session.passport.user.id)
        .then(requests => {
            Task
                .getAllTasks()
                .then(tasks => {
                    res.render('roles/customer', {
                        user: req.session.passport.user,
                        requests: requestsFactory(requests, tasks),
                        typeUser: req.session.passport.user.userTypeID
                    });
                })
                .catch(error => {
                    console.warn(error);
                    res.render('roles/customer');
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/customer');
        });
});

module.exports = router;
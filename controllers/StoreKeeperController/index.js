"use strict";

const express = require('express');
const router = express.Router();
const Task = require('../../models/Task');
const Request = require('../../models/Request');
const formatDate = require('../../helpers/formatDate');
const validation = require('../../middleware/validation');
const Models = require('../../models/TaskDetail/relations');

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
            Request
                .getRequestById(req.body.requestID)
                .then(request => {
                    Task
                        .getTaskById(req.body.id)
                        .then(task => {
                            Models.TaskDetail
                                .getTaskDetail(req.body.id)
                                .then(details => {
                                    res.status(200).send({
                                        request: request,
                                        task: task,
                                        details: details
                                    });
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
        .updateTask(req.params.id, req.body)
        .then(() => {
            res.status(200).send();
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

module.exports = router;
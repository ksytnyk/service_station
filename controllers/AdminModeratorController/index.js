"use strict";

const User = require('../../models/User');
const Task = require('../../models/Task');
const Request = require('../../models/Request');

const express = require('express');
const router = express.Router();

const roles = require('../../constants/roles');
const dataType = require('../../constants/dataType');
const validation = require('../../middleware/validation');
const requestsFactory = require('../../helpers/requestsFactory');
const countStatuses = require('../../helpers/countStatuses');
const nodemailer = require('../../helpers/nodemailer');
const status = require('../../constants/status');

router.get('/users', (req, res) => {
    User
        .getAllUsers()
        .then(users => {
            res.render('roles/admin_moderator/users', {
                users: users,
                typeUser: req.session.passport.user.userTypeID
            });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/users');
        });
});

router.post('/create-user', validation.createAndUpdateUser(), (req, res) => {
    if (req.baseUrl === '/moderator') {
        req.body.userTypeID = roles.CUSTOMER;
    }

    User
        .createUser(req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Додавання користувача пройшло успішно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при додаванні користувача.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.put('/update-user/:id', validation.createAndUpdateUser(), (req, res) => {
    User
        .updateUser(req.params.id, req.body)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Редагування користувача пройшло успішно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при редагуванні користувача.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.delete('/delete-user/:id', (req, res) => {
    User
        .deleteUser(req.params.id)
        .then(() => {
            req.flash('success_alert', true);
            req.flash('success_msg', 'Видалення користувача прийшло успішно.');
            res.redirect(req.baseUrl + '/users');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при видаленні користувача.'});
            res.redirect(req.baseUrl + '/users');
        });
});

router.get('/requests', (req, res) => {
    Request
        .getAllRequests()
        .then(requests => {
            Task
                .getAllTasks()
                .then(tasks => {
                    User
                        .getAllUsers()
                        .then(users => {
                            res.render('roles/admin_moderator/requests', {
                                assignedExecutorUsers: users,
                                requests: requestsFactory(requests, tasks),
                                typeUser: req.session.passport.user.userTypeID
                            });
                        })
                        .catch(error => {
                            console.warn(error);
                            res.render('roles/admin_moderator/requests');
                        });
                })
                .catch(error => {
                    console.warn(error);
                    res.render('roles/admin_moderator/requests');
                });
        })
        .catch(error => {
            console.warn(error);
            res.render('roles/admin_moderator/requests');
        });
});

router.get('/create-request', (req, res) => {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users =>
                    res.render('roles/admin_moderator/create_request', {
                        assignedExecutorUsers: users,
                        customers: usersCustomers,
                        typeUser: req.session.passport.user.userTypeID
                    }))
                .catch(err => {
                    console.warn(err);
                    res.render('roles/admin_moderator/create_request');
                });
        });
});

router.post('/create-request', validation.createAndUpdateRequest(), (req, res) => {
    req.body.createdBy = req.session.passport.user.id;
    Request
        .createRequest(req.body)
        .then((result) => {
            res.status(200).send({result: result});
        })
        .catch(errors => {
            res.status(400).send({errors: errors});
        });
});

router.get('/update-request/:id', (req, res) => {
    User
        .getCustomerUsers()
        .then(usersCustomers => {
            User
                .getAllUsers()
                .then(users => {
                    Request
                        .getRequestById(req.params.id)
                        .then(request => {
                            Task
                                .getAllTasksOfRequest(req.params.id)
                                .then(task => {
                                    res.render('roles/admin_moderator/update_request', {
                                        assignedExecutorUsers: users,
                                        customers: usersCustomers,
                                        typeUser: req.session.passport.user.userTypeID,
                                        request: requestsFactory(request, task)
                                    });
                                })
                                .catch(error => {
                                    console.warn(error);
                                    res.render('roles/admin_moderator/update_request');
                                });
                        });
                });
        });
});

router.put('/update-request/:id', validation.createAndUpdateRequest(), (req, res) => {
    Request
        .updateRequest(req.params.id, req.body)
        .then((result) => {
            res.status(200).send({result: result});
        })
        .catch(errors => {
            res.status(400).send({errors: errors});
        });
});

router.delete('/delete-request/:id', (req, res) => {
    Task
        .destroy({
            where: {
                request_id: Number(req.params.id)
            }
        })
        .then(() => {
            Request
                .deleteRequest(req.params.id)
                .then(() => {
                    req.flash('success_alert', true);
                    req.flash('success_msg', 'Видалення замовлення пройшло успішно.');
                    res.redirect(req.baseUrl + '/requests');
                })
                .catch(error => {
                    console.warn(error);
                    req.flash('error_alert', true);
                    req.flash('error_msg', {msg: 'Виникла помилка при видаленні замовлення.'});
                    res.redirect(req.baseUrl + '/requests');
                });
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при видаленні задачі.'});
            res.redirect(req.baseUrl + '/requests');
        });
});

router.post('/change-request-status/:id', (req, res) => {
    Request.changeStatus(req.params.id, req.body.statusID)
        .then(() => {
            if (+req.body.statusID === status.DONE) {
                Request
                    .getRequestById(req.params.id)
                    .then((result) => {
                        nodemailer(result[0].user.dataValues);
                    })
                    .catch(error => {
                        console.warn(error);
                    })
            }

            req.flash('success_alert', true);
            req.flash('success_msg', 'Статус успішно змінений.');
            res.redirect(req.baseUrl + '/requests');
        })
        .catch(error => {
            console.warn(error);
            req.flash('error_alert', true);
            req.flash('error_msg', {msg: 'Виникла помилка при зміні статусу.'});
            res.redirect(req.baseUrl + '/requests');
        })
});

router.post('/create-task', validation.createAndUpdateTask(), (req, res) => {
    Task
        .createTask(req.body)
        .then(result => {
            res.status(200).send({result: result});
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
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

router.delete('/delete-task/:id', (req, res) => {
    Task
        .destroy({
            where: {
                id: Number(req.params.id)
            }
        })
        .then(() => {
            res.status(200).send({id: req.params.id});
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

router.get('/chart', (req, res) => {
    res.render('roles/admin_moderator/chart', {typeUser: req.session.passport.user.userTypeID});
});

router.post('/chart/tasks', (req, res) => {
    Task
        .getAllTasksForChart(req.body)
        .then(tasks => {
            res.status(200).send({data: countStatuses(tasks, dataType.TASK)});
        })
        .catch(errors => {
            res.status(400).send({errors: errors});
        });
});

router.post('/chart/requests', (req, res) => {
    Request
        .getAllRequests(req.body)
        .then(requests => {
            res.status(200).send({data: countStatuses(requests, dataType.REQUEST)});
        })
        .catch(errors => {
            console.warn(errors);
            res.status(400).send({errors: errors});
        });
});

module.exports = router;
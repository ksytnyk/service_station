"use strict";

const roles = require("../../consts/roles");
const User = require('../../models/User');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('roles/admin/index');
});

router.get('/all-users', (req, res) => {
    User.getAllUsers()
        .then(users => {
            let newUsers = users.map(user => {
                return {
                    id_users: user.dataValues.id,
                    name: user.dataValues.loginUser,
                    name_type_user: user.dataValues.type_user.nameTypeUser
                };
            });
            res.render('roles/admin/all_users', {data: newUsers});
        })
        .catch(err => {
            console.warn(err);
            res.render('roles/admin/index');
        });
});

router.get('/create-user', function (req, res) {
    res.render('roles/admin/create_user');
});

router.post('/create-user', function (req, res) {
    User.createUser(req.body)
        .then(() => {
            res.redirect('/admin/all-users');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
});

router.all('/update-user/:id', function (req, res) {
    if (req.method === "GET") {
        let params = {id_user: req.params.id};
        User.getCurrentUser(params)
            .then(user => {
                res.render('roles/admin/update_user', {user: user});
            })
            .catch(err => {
                console.log(err);
                res.redirect('/');
            });
    } else if (req.method === "POST") {
        User.updateUser(req.params.id, req.body).then(() => {
            res.redirect('/admin/all-users');
        }).catch(err => {
            console.log(err);
            res.redirect('/');
        });
    }
});

router.post('/delete-user/:id', function (req, res) {
    if (req.body.method === "DELETE" && req.params.id) {
        User.deleteUser(req.params.id)
            .then(() => {
                res.redirect('/admin/all-users');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/');
            });
    }
});

module.exports = router;
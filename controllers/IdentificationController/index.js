"use strict";

const User = require('../../models/User');

const _checkIdentification = require("./_checkIdentification");

function identification(req, res) {

    let login = req.body.login, password = req.body.password;

    if (login && password) {
        let params = {login: String(login), password: String(password)};
        User.getCurrentUser(params)
            .then(user => {
                if (user) {
                    _checkIdentification(req, res, Number(user.type_user.id));
                } else {
                    res.redirect('/');
                }
            })
            .catch(err => {
                console.warn(err);
                res.redirect('/');
            });
    } else if (req.session.user) {
        _checkIdentification(req, res, Number(req.session.user));
    } else {
        res.redirect('/');
    }
};

module.exports = identification;
"use strict";

const _checkIdentification = require("./_checkIdentification");

function identification(req, res) {
    if(req.isAuthenticated) _checkIdentification(req, res, Number(req.session.passport.user.id_type_user));
    else res.redirect('/');
}

module.exports = identification;
"use strict";

const _checkIdentification = require("./_checkIdentification");

function identification(req, res) {
    if(req.isAuthenticated) _checkIdentification(req, res, Number(req.session.passport.user.userTypeID));
    else res.redirect('/');
}

module.exports = identification;
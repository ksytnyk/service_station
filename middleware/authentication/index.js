"use strict";

module.exports = function (role) {
    return function (req, res, next) {
        if (req.session && req.session.user === role)
            return next();
        else if(req.isAuthenticated()) return res.redirect('/auth');
        else res.redirect('/');
    };
};
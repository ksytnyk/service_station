"use strict";

module.exports = function (role) {
    return function (req, res, next) {
        if (req.session && req.session.user === role)
            return next();
        else
            return res.redirect('/');
    };
};




"use strict";

module.exports = function (role) {
    return function (req, res, next) {
        if (req.session && req.session.passport.user.id_type_user === role) return next();
        else if(req.isAuthenticated()) return res.redirect('/auth');
        else res.redirect('/')
    };
};
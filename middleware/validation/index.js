"use strict";

const roles = require('../../constants/roles');
const validationUserParams = require('../../helpers/validationUserParams');

module.exports = {

    createAndUpdateUser: function (role) {

        return function (req, res, next) {

            let errors = validationUserParams(req, role);

            if (errors) {
                req.flash('error_alert', true);
                req.flash('error_msg', errors);
                role == roles.ADMIN ? res.redirect('/admin/users') :
                    role == roles.MODERATOR ? res.redirect('/moderator/users') : "";
            } else {
                next();
            }
        };
    }

};


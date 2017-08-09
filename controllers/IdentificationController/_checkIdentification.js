"use strict";

const roles = require("../../constants/roles");

module.exports = function _checkIdentification(req, res, userTypeID) {
    switch (userTypeID) {
        case roles.ADMIN: {
            res.redirect('/admin/users');
            break;
        }
        case roles.MODERATOR: {
            res.redirect('/moderator/users');
            break;
        }
        case roles.EXECUTOR: {
            res.redirect('/executor');
            break;
        }
        case roles.STOREKEEPER: {
            res.redirect('/store-keeper');
            break;
        }
        case roles.CUSTOMER: {
            res.redirect('/customer');
            break;
        }
        default: {
            res.redirect('/');
        }
    }
};
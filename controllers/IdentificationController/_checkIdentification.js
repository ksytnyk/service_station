"use strict";

const roles = require("../../constants/roles");

module.exports = function _checkIdentification(req, res, userTypeID) {
    switch (userTypeID) {
        case roles.ADMIN: {
            res.redirect('/admin/requests/all');
            break;
        }
        case roles.MODERATOR: {
            res.redirect('/moderator/requests/all');
            break;
        }
        case roles.EXECUTOR: {
            res.redirect('/executor/tasks/all');
            break;
        }
        case roles.STOREKEEPER: {
            res.redirect('/store-keeper');
            break;
        }
        case roles.CUSTOMER: {
            res.redirect('/customer/active');
            break;
        }
        case roles.BOOKKEEPER: {
            res.redirect('/book-keeper/requests/all');
            break;
        }
        default: {
            res.redirect('/');
        }
    }
};
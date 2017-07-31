"use strict";

const roles = require("../../consts/roles");

module.exports = function _checkIdentification(req, res, typeUserID) {
    switch (typeUserID) {
        case roles.ADMIN: {
            req.session.user = roles.ADMIN;
            res.redirect('/admin');
            break;
        }
        case roles.MODERATOR: {
            req.session.user = roles.MODERATOR;
            res.redirect('/moderator');
            break;
        }
        case roles.EXECUTOR: {
            req.session.user = roles.EXECUTOR;
            res.redirect('/executor');
            break;
        }
        case roles.STOREKEEPER: {
            req.session.user = roles.STOREKEEPER;
            res.redirect('/store-keeper');
            break;
        }
        case roles.CUSTOMER: {
            req.session.user = roles.CUSTOMER;
            res.redirect('/customer');
            break;
        }
        default: {
            res.redirect('/');
        }
    }
};
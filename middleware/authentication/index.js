"use strict";

const roles = require("../../consts/roles");

exports.admin = function (req, res, next) {
    if (req.session && req.session.user === roles.ADMIN)
        return next();
    else
    //return res.sendStatus(401);
        return res.redirect('/');
};

exports.moderator = function (req, res, next) {
    if (req.session && req.session.user === roles.MODERATOR)
        return next();
    else
    //return res.sendStatus(401);
        return res.redirect('/');
};

exports.executor = function (req, res, next) {
    if (req.session && req.session.user === roles.EXECUTOR)
        return next();
    else
    //return res.sendStatus(401);
        return res.redirect('/');
};

exports.storeKeeper = function (req, res, next) {
    if (req.session && req.session.user === roles.STOREKEEPER)
        return next();
    else
    //return res.sendStatus(401);
        return res.redirect('/');
};

exports.customer = function (req, res, next) {
    if (req.session && req.session.user === roles.CUSTOMER)
        return next();
    else
    //return res.sendStatus(401);
        return res.redirect('/');
};
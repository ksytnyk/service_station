"use strict";

const identification = require('../controllers/IdentificationController');
const authentication = require('../middleware/authentication');

const admin = require('../controllers/AdminController');
const moderator = require('../controllers/ModeratorController');
const executor = require('../controllers/ExecutorController');
const storeKeeper = require('../controllers/StoreKeeperController');
const customer = require('../controllers/CustomerController');

module.exports = function (app) {

    app.route('/')
        .get(function (req, res) {
            if (req.session.user) {
                res.redirect('/auth');
            } else {
                res.render('main');
            }
        });

    app.route('/auth')
        .all(identification);

    app.route("/logout").get((req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });

    app.use('/admin', authentication.admin, admin);
    app.use('/moderator', authentication.moderator, moderator);
    app.use('/executor', authentication.executor, executor);
    app.use('/store-keeper', authentication.storeKeeper, storeKeeper);
    app.use('/customer', authentication.customer, customer);
};



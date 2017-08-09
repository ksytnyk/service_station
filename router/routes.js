"use strict";

const identification = require('../controllers/IdentificationController');
const authentication = require('../middleware/authentication');
const roles = require('../constants/roles');
const passport = require('passport');

const admin = require('../controllers/AdminController'),
    moderator = require('../controllers/ModeratorController'),
    executor = require('../controllers/ExecutorController'),
    storeKeeper = require('../controllers/StoreKeeperController'),
    customer = require('../controllers/CustomerController');

require('../models/Passport');

module.exports = function (app) {

    app.get('/', (req, res) => {
        if (req.isAuthenticated()) res.redirect('auth');
        else res.render('login');
    });

    app.post('/', passport.authenticate('local', {successRedirect: '/auth', failureRedirect: '/', failureFlash: true}));

    app.route('/auth').all(identification);

    app.route("/logout").get((req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });

    app.use('/admin', authentication(roles.ADMIN), admin);
    app.use('/moderator', authentication(roles.MODERATOR), moderator);
    app.use('/executor', authentication(roles.EXECUTOR), executor);
    app.use('/store-keeper', authentication(roles.STOREKEEPER), storeKeeper);
    app.use('/customer', authentication(roles.CUSTOMER), customer);

    app.use(authentication());
};
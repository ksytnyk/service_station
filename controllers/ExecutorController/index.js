"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        res.render('roles/executor', {typeUser: req.session.passport.user.userTypeID});
    } else {
        res.redirect('/');
    }
});

module.exports = router;

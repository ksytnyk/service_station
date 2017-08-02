"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        res.render('roles/customer');
    } else {
        res.redirect('/');
    }
});

module.exports = router;
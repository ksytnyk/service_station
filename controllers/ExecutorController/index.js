"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('roles/executor');
    } else {
        res.redirect('/');
    }
});

module.exports = router;

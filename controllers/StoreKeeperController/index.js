"use strict";

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.passport.user) {
        res.render('roles/storekeeper', {typeUser: req.session.passport.user.id_type_user});
    } else {
        res.redirect('/');
    }
});

module.exports = router;
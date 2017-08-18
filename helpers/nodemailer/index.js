"use strict";

const nodemailer = require('nodemailer');
const nodemailerConst = require('../../constants/nodemailer');

module.exports = function (user) {

    let subject = 'Service Station';
    let html = 'Ваше замовлення готове!';

    let transporter = nodemailer.createTransport({
        service: "gmail",
        secure: false,
        port: 25,
        auth: {
            user: nodemailerConst.EMAIL,
            pass: nodemailerConst.PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let HelperOptions = {
        from: '"Service Station"' + nodemailerConst.EMAIL,
        to: user.userEmail,
        subject: subject,
        html: html
    };

    transporter.sendMail(HelperOptions, (err) => {
        if (err) {
            console.log(err);
        }
    });

    return;
};
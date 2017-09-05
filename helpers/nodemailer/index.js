"use strict";

const nodemailer = require('nodemailer');
const nodemailerConst = require('../../constants/nodemailer');

module.exports = function (type, data) {
    let subject, html, to;

    if (type === 'create-user') {
        to = data.userEmail;
        subject = 'Успішна реєстрація користувача';
        html = data.userName + ' ' + data.userSurname + ', Вас успішно зареєстровано у системі "Service Station". Ваш логін: ' + data.userLogin + ', пароль: ' + data.userPassword + '.';
    }
    else if (type === 'done-request') {
        to = data.userEmail;
        subject = 'Замолвення готове';
        html = 'Ваше замовлення готове!';
    }
    else if (type === 'create-request') {
        to = data.userEmail;
        subject = 'Успішна реєстрація замолвення';
        html = 'Ваше замовлення успішно зареєстровано!';
    }

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
        to: to,
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
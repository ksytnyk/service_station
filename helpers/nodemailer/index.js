"use strict";

const nodemailer = require('nodemailer');
const nodemailerConst = require('../../constants/nodemailer');

module.exports = function (type, data, request) {
    let subject, html, to;

    if (type === 'create-user') {
        to = [data];
        subject = 'Успішна реєстрація користувача';
        html = data.userName + ' ' + data.userSurname + ', Вас успішно зареєстровано у системі "Service Station". Ваш логін: ' + data.userLogin + ', пароль: ' + data.userPassword + '.';
    }
    else if (type === 'done-request') {
        to = [data];
        subject = 'Замовлення готове';
        html = 'Ваше замовлення готове!';
    }
    else if (type === 'create-request') {
        to = [data.dataValues];
        subject = 'Успішна реєстрація замолвення';
        html = 'Ваше замовлення успішно зареєстровано!';
    }
    else if (type === 'set-payed') {
        to = data;
        subject = 'Здійснена оплата замовлення';
        html = request.user.userSurname + ' ' + request.user.userName + ' здійснив оплату розміром: ' + request.cost + ' грн.';
    }

    to.forEach(item => {

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
            to: item.userEmail,
            subject: subject,
            html: html
        };

        transporter.sendMail(HelperOptions, (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    return;
};
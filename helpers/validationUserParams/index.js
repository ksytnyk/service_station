const roles = require('../../constants/roles');

module.exports = function (req, role = null) {

    let userName = req.body.userName;
    let userSurname = req.body.userSurname;
    let userCompanyName = req.body.userCompanyName;
    let userAddress = req.body.userAddress;
    let userPhone = req.body.userPhone;
    let userLogin = req.body.userLogin;
    let userEmail = req.body.userEmail;
    let userPassword = req.body.userPassword;

    if (role === roles.ADMIN) {
        let userTypeID = req.body.userTypeID;
        req.checkBody('userTypeID', '"Роль" - обязательное поле.').notEmpty();
    }

    req.checkBody('userName', '"Имя" - обязательное поле.').notEmpty();
    req.checkBody('userSurname', '"Фамилия" - обязательное поле.').notEmpty();
    req.checkBody('userCompanyName', '"Компания" - обязательное поле.').notEmpty();
    req.checkBody('userAddress', '"Адрес" - обязательное поле.').notEmpty();
    req.checkBody('userPhone', '"Контактный номер" - обязательное поле.').notEmpty();
    req.checkBody('userLogin', '"Логин" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - обязательное поле.').notEmpty();
    req.checkBody('userEmail', '"Email" - некорректное поле.').isEmail();
    req.checkBody('userPassword', '"Пароль" - обязательное поле.').notEmpty();

    return req.validationErrors();
};
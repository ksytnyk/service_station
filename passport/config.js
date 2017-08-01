/**
 * Created by andrii on 01.08.17.
 */

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User/index');

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function (username, password, done) {
    console.info('usn:',username);
    console.info('pass',password);
        User.userModel
            .findOne({
                where: {
                    login_user: username
                }
            })
            .then(function (res) {
                if (res) {
                    if (res.passwordUser === password) {
                        console.info(res);
                        return done(null, res);

                    }
                    else{
                        console.info(res);
                        console.log('неверный пароль');
                        return done(null, false, {message: 'Неверный пароль'})
                    }
                }
                else {

                    return done(null, false, {message: 'Неверный логин'})
                }
            });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    User.userModel.findById(user.id)
        .then(function (res) {
            done(null, res);
        })
        .catch(function (err) {
            done(err, null);
        });
});
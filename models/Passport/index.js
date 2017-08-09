const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../User');

passport.use(new LocalStrategy({
        usernameField: 'login',
        passwordField: 'password'
    },
    function (login, password, done) {
        User.getCurrentUser(login, password)
            .then(function (res) {
                if (res) {
                    if (res.userPassword === password) {
                        return done(null, res);
                    } else {
                        return done(null, false, {message: 'Неверный пароль.'})
                    }
                } else {
                    return done(null, false, {message: 'Неизвестный пользователь.'})
                }
            });
    }));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    User
        .getUserById(user.id)
        .then(function (res) {
            done(null, res);
        })
        .catch(function (err) {
            done(err, null);
        });
});
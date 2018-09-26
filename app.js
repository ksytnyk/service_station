const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const consolidate = require('consolidate');
const dust = require('dustjs-helpers');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
require('./models/TaskDetail/relations');
require('./models/TaskTypeDetail/relations');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// view engine setup
app.engine('dust', consolidate.dust);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

//========= SESSION =========

app.use(session({
    secret: 'SkySoft',
    resave: true,
    saveUninitialized: true
}));

//===========================

// Express Validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.');
        let root = namespace.shift();
        let formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//========== ROUTES ==========

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.success_alert = req.flash('success_alert');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.error_alert = req.flash('error_alert');
    res.locals.user = req.user || null;
    next();
});

require("./router/routes")(app);

//============================

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.redirect('/');
});

module.exports = app;
const express = require('express');
const path = require('path');
var router = require('./routes');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const passport = require('passport');

var db = require('./db');

var app = express();

var Strategy = require('passport-local').Strategy;

passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    })
);

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'dist')));
app.use(favicon(path.join(__dirname, 'dist', 'imgs', 'auc.ico')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(require('morgan')('combined'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

module.exports = app;
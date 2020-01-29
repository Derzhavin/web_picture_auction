const express = require('express');
const path = require('path');
var router = require('./routes');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const passport = require('passport');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended: true}));

require('./passportSetup')(passport);

app.use(express.static(path.join(__dirname, 'dist')));
app.use(favicon(path.join(__dirname, 'dist', 'imgs', 'auc.ico')));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

app.use(require('morgan')('combined'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);

router.use(bodyParser.json());

module.exports = app;
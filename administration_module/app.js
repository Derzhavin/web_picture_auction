var express = require('express');
var path = require('path');
var router = require('./routes');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'imgs', 'auc.ico')));

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/', router);

module.exports = app;



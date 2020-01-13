var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();
router.use(bodyParser.json());

var arts_json = require('./public/jsons/arts');
var persons_json = require('./public/jsons/persons');
var settings = require('./public/jsons/settings');


router.get('/', function(req,res,next) {
    res.render('index', {title:'Главная страница', arts: arts_json});
});

router.get('/settings', function(req,res,next) {
    res.render('settings', {title:'Настройки', item: settings});
});

router.get('/cards', function(req,res,next) {
    res.render('cards', {title:'Участники', persons: persons_json});
});

module.exports = router;
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();
router.use(bodyParser.json());

var users = require('./dist/jsons/persons');
var arts = require('./dist/jsons/arts');
var settings = require('./dist/jsons/settings');

var name = "";

router.get('/', function(req,res,next) {
    res.render('index', {title:'Auction'});
});

router.get('/admin', function(req,res,next) {
    res.render('admin', {title:'Admin'});
});

router.get('/user', function(req,res,next) {
    res.render('user', {title:name});
});

module.exports = router;
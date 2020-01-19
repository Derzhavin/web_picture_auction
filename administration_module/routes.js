var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();
router.use(bodyParser.json());

var arts_json = require('./public/jsons/arts');
var persons_json = require('./public/jsons/persons');
var settings = require('./public/jsons/settings');


router.get('/main', function(req,res,next) {
    res.render('main', {title:'Main', arts: arts_json});
});

router.get('/settings', function(req,res,next) {
    res.render('settings', {title:'Auction settings', item: settings});
});

router.get('/participants', function(req,res,next) {
    res.render('participants', {title:'Participants', persons: persons_json});
});

module.exports = router;
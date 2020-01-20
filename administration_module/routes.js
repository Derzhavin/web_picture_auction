var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();
router.use(bodyParser.json());

var arts = require('./public/jsons/arts');
var participants = require('./public/jsons/participants');
var settings = require('./public/jsons/settings');


router.get('/main', function(req,res,next) {
    res.render('main', {title:'Main', arts: arts});
});

router.get('/settings', function(req,res,next) {
    if (!settings || Object.keys(settings).length === 0) {
        let date = new Date();

        let format = number => number / 10 >= 1 ? number : '0' + number;

        settings = {
            "date": date.getFullYear() + '-' + format(date.getMonth() + 1) + '-' + format(date.getDate()),
            "time": format(date.getHours())+ ':' + format(date.getMinutes()),
            "timeout": "05:00",
            "duration": "00:10",
            "pause": "00:05"
        }
    }
    res.render('settings', {title:'Auction settings', item: settings});
});

router.get('/participants', function(req,res,next) {
    res.render('participants', {title:'Participants', participants: participants});
});

module.exports = router;
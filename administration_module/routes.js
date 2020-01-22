var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.use(bodyParser.json());

var arts = require('./public/jsons/arts');
var participants = require('./public/jsons/participants');
var settings = require('./public/jsons/settings');


router.get('/arts', (req,res) => {
    res.render('arts', {title:'Arts', arts: arts});
});

router.get('/settings', (req,res) => {
    if (!settings || Object.keys(settings).length === 0) {
        let date = new Date();

        let format = number => number / 10 >= 1 ? number : '0' + number;

        settings = {
            "date": date.getFullYear() + '-' + format(date.getMonth() + 1) + '-' + format(date.getDate()),
            "time": format(date.getHours())+ ':' + format(date.getMinutes()),
            "timeout": "05:00",
            "duration": "00:10",
            "pause_time": "00:05"
        }
    }
    res.render('settings', {title:'Auction settings', item: settings});
});

router.get('/participants', (req,res) => {
    res.render('participants', {title:'Participants', participants: participants});
});

router.post('/change-settings', (req, res) => {
    settings.date = req.body.date;
    settings.time = req.body.time;
    settings.timeout = req.body.timeout;
    settings.duration = req.body.duration;
    settings.pause_time = req.body.pause_time;

    fs.writeFile(path.join(__dirname,'public','jsons','settings.json'), JSON.stringify(settings),err => {
        if(err) {
            throw err;
        }
    });

    res.redirect('/settings')
});

module.exports = router;
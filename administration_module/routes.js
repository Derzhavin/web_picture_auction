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

router.post('/arts', (req, res) => {
    console.log(req.body, "post");

    if (!req.body || req.body === undefined) {
        sendFailure(res, 'art', 'add');
    } else {
        sendSuccess(res, 'Art', 'added');
    }
});

router.delete('/arts', (req, res) => {
    console.log(req.body, "delete");

    if (!req.body || req.body === undefined) {
        sendFailure(res, 'art', 'remove');
    } else {
        sendSuccess(res, 'Art', 'removed');
    }
});

router.put('/arts', (req, res) => {
    console.log(req.body, "put");
    if (!req.body || req.body === undefined) {
        sendFailure(res, 'art', 'update');
    } else {
        sendSuccess(res, 'Art', 'updated');
    }
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

router.put('/settings', (req, res) => {
    console.log(req.body, "put");

    if (!req.body || req.body === undefined) {
        sendFailure(res, 'settings', 'update');
    } else {
        sendSuccess(res, 'Settings', 'updated');
    }
    // if (!req.body) {
    //     res.status = 400;
    // }
    // settings.date = req.body.date;
    // settings.time = req.body.time;
    // settings.timeout = req.body.timeout;
    // settings.duration = req.body.duration;
    // settings.pause_time = req.body.pause_time;
    //
    // fs.writeFile(path.join(__dirname,'public','jsons','settings.json'), JSON.stringify(settings),err => {
    //     if(err) {
    //         throw err;
    //     }
    // });
});

router.get('/participants', (req,res) => {
    res.render('participants', {title:'Participants', participants: participants});
});

router.post('/participants', (req, res) => {
    console.log(req.body, "post");
    if (!req.body || req.body === undefined) {
        sendFailure(res, 'participant', 'add');
    } else {
        sendSuccess(res, 'Participant', 'added');
    }
});

router.delete('/participants', (req, res) => {
    console.log(req.body, "delete");
    if (!req.body || req.body === undefined) {
        sendFailure(res, 'participant', 'remove');
    } else {
        sendSuccess(res, 'Participant', 'removed');
    }
});

router.put('/participants', (req, res) => {
    console.log(req.body, "put");
    if (!req.body || req.body === undefined) {
        sendFailure(res, 'participant', 'update');
    } else {
        sendSuccess(res, 'Participant', 'updated');
    }
});

function sendSuccess(res, entity, operation) {
    res.status(200);
    return res.json({msg:`${entity} was ${operation} succesfuly!`});
}

function sendFailure(res, entity, operation) {
    res.status(400);
    return res.json({msg:`Failed to ${operation} ${entity}!`});
}

module.exports = router;
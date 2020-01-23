var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();

router.use(bodyParser.json());


let pathToParticipants = path.join(__dirname,'public','jsons','participants.json');
let pathToArts = path.join(__dirname,'public','jsons','arts.json');
let pathToSettings = path.join(__dirname,'public','jsons','settings.json');

var arts = require(pathToArts);
var participants = require(pathToParticipants);
var settings = require(pathToSettings);


router.get('/arts', (req,res) => {
    console.log({title:'Arts', arts: arts}, "get", "/arts");

    res.render('arts', {title:'Arts', arts: arts});
});

router.post('/arts', (req, res) => {
    console.log(req.body, "post", "/arts");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'art', 'add');
        return;
    }

    for(art of arts) {
        if (art.artName === req.body.artName) {
            res.json({msg: 'Art exists!'});
            return;
        }
    }

    arts.push({
        artName: req.body.artName,
        artist: req.body.artist,
        price: req.body.price,
        minStep: req.body.minStep,
        maxStep: req.body.maxStep,
        way: req.body.way
    });

    fs.writeFile(pathToArts, JSON.stringify(arts), err => {
        if(err) {
            sendFailure(res, 'art', 'add');
            throw err;
        }
    });

    sendSuccess(res, 'Art', 'added');
});

router.delete('/arts', (req, res) => {
    console.log(req.body, "delete", "/arts");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'art', 'remove');
        return;
    }

    arts = arts.filter(art => art.artName != req.body.artName);
    fs.writeFile(pathToArts, JSON.stringify(arts), err => {
        if(err) {
            sendFailure(res, 'art', 'remove');
            throw err;
        }
    });

    sendSuccess(res, 'Art', 'removed');
});

router.put('/arts', (req, res) => {
    console.log(req.body, "put", "/arts");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'art', 'update');
        return;
    }

    for(art of arts) {
        if (art.artName === req.body.artName) {
            art.artist = req.body.artist;
            art.price = req.body.price;
            art.minStep = req.body.minStep;
            art.maxStep = req.body.maxStep;
            art.way = req.body.way;
            fs.writeFile(pathToArts, JSON.stringify(arts), err => {
                if(err) {
                    sendFailure(res, 'art', 'update');
                    throw err;
                }
            });
        }
    }

    sendSuccess(res, 'Art', 'updated');
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

    console.log({title:'Auction settings', item: settings}, "get", "/settings");

    res.render('settings', {title:'Auction settings', item: settings});
});

router.put('/settings', (req, res) => {
    console.log(req.body, "put", "/settings");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'settings', 'update');
    } else {
        settings.date = req.body.date;
        settings.time = req.body.time;
        settings.timeout = req.body.timeout;
        settings.duration = req.body.duration;
        settings.pause_time = req.body.pause_time;

        fs.writeFile(pathToSettings, JSON.stringify(settings),err => {
            if(err) {
                sendFailure(res, 'settings', 'update');
                throw err;
            }
        });
        sendSuccess(res, 'Settings', 'updated');
    }
});

router.get('/participants', (req,res) => {
    console.log({title:'Participants', participants: participants}, "get", "/participants");
    res.render('participants', {title:'Participants', participants: participants});
});

router.post('/participants', (req, res) => {
    console.log(req.body, "post", "/participants");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'participant', 'add');
        return;
    }

    for(participant of participants) {
        if (participant.username === req.body.username) {
            res.json({msg: 'Participant exists!'});
            return;
        }
    }

    participants.push({username: req.body.username, money: req.body.money});
    fs.writeFile(pathToParticipants, JSON.stringify(participants), err => {
        if(err) {
            sendFailure(res, 'participant', 'add');
            throw err;
        }
    });

    sendSuccess(res, 'Participant', 'added');
});

router.delete('/participants', (req, res) => {
    console.log(req.body, "delete", "/participants");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'participant', 'remove');
        return;
    }

    participants = participants.filter(participant => participant.username != req.body.username);
    fs.writeFile(pathToParticipants, JSON.stringify(participants), err => {
        if(err) {
            sendFailure(res, 'participant', 'remove');
            throw err;
        }
    });

    sendSuccess(res, 'Participant', 'removed');
});

router.put('/participants', (req, res) => {
    console.log(req.body, "put", "/participants");

    if (!req.body || req.body === undefined || Object.keys(req.body).length === 0) {
        sendFailure(res, 'participant', 'update');
        return;
    }

    for(participant of participants) {
        if (participant.username === req.body.username) {
            participant.money = req.body.money;
            fs.writeFile(pathToParticipants, JSON.stringify(participants), err => {
                if(err) {
                    sendFailure(res, 'participant', 'update');
                    throw err;
                }
            });
        }
    }

    sendSuccess(res, 'Participant', 'updated');
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
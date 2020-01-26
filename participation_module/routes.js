var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var router = express.Router();
router.use(bodyParser.json());

var users = require('./dist/jsons/participants');
var arts = require('./dist/jsons/arts');
var settings = require('./dist/jsons/settings');

var currentUser = null;

router.get('/index', (req, res) => {
    console.log(req.body, 'get', '/index');

    res.render('index');
});

router.post('/index', (req, res) => {
    console.log(req.body, 'post', '/index');

    if (req.body.username == null) {
        res.end('Request without username!');
        return;
    }

    if (req.body.username === 'admin') {
        res.redirect('/admin');
        return;
    }

    for(let user of users) {
        if (user.username === req.body.username) {
            currentUser = user;
            res.redirect('/user-bidding');
        }
    }

    res.end('There is no user with such name!');
});

router.get('/admin', (req, res) => {
    console.log(req.body, 'get', '/admin');

    res.render('admin');
});

router.get('/user-bidding', (req, res) => {
    console.log(req.body, 'get', '/user-bidding');

    res.render('user-bidding', {user: currentUser});
});

router.post('/user-purchases', (req, res) => {
    console.log(req.body, 'post', '/user-purchases');

    if (isBodyEmpty(req.body)) {
        res.send('Empty request!');
        return;
    }

    if (req.body.user == null) {
        res.send('Empty user!');
        return;
    }
    
    if (req.body.user.money == null || req.body.user.money == null) {
        res.send('Empty user item was sent!');
        return;
    }
    
    currentUser = req.body.user;

    res.redirect('/user-purchases');
});

router.get('/user-purchases', (req,res) => {
    console.log(req.body, 'get', '/user-purchases');

    res.render('user-purchases', {user: currentUser});
});

function isBodyEmpty(body) {
    return !body || body === undefined || Object.keys(body).length === 0;
}

module.exports = router;
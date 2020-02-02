const express = require('express');
var passport = require('passport');

var db = require('./db');
var adminKey = db.users.adminKey;

var router = express.Router();

router.get('/auth', (req, res) => {
    console.log(req.body, 'get', '/auth');

    res.render('auth');
});

router.post('/auth', passport.authenticate('local', { failureRedirect: '/auth' }), (req, res) => {
    console.log(req.body, 'post', '/auth');

    if (req.body.username === 'admin') {
        return res.redirect('/admin');
    }

    res.redirect('/user-bidding');
});

router.get('/admin', require('connect-ensure-login').ensureLoggedIn('/auth'), (req, res) => {
    console.log(req.user, 'get', '/admin');

    if (req.user.username !== 'admin' && req.user.password !== adminKey) {
        return res.send("It is admin page!");
    }

    let arts = db.arts.arts;
    arts.map(art => {if (!art.owner) art.owner = ""});

    res.render('admin', {arts: arts, participants: db.users.participants});
});

router.get('/user-bidding' , require('connect-ensure-login').ensureLoggedIn('/auth'), (req, res) => {
    console.log(req.body, 'get', '/user-bidding');

    if (req.user.username === 'admin' || req.user.password === adminKey) {
        return res.send("It is participant page!");
    }

    res.render('user-bidding', {user: req.user});
});

router.get('/user-purchases', require('connect-ensure-login').ensureLoggedIn('/auth'), (req,res) => {
    console.log(req.body, 'get', '/user-purchases');

    if (req.user.username === 'admin' || req.user.password === adminKey) {
        return res.send("It is participant page!");
    }

    res.render('user-purchases', {user: req.user, arts: getArtsBoughtByUser(req.user.username)});
});


function getArtsBoughtByUser(username) {
    let itemsPurchased = db.purchases.getArtsByUsername(req.user.username);
    return db.arts.arts.filter(art => itemsPurchased.includes(art.artName));
}

module.exports = router;
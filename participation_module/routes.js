const express = require('express');
const bodyParser = require('body-parser');

var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

router.get('/auth', (req, res) => {
    console.log(req.body, 'get', '/auth');

    res.render('auth');
});

router.post('/auth', passport.authenticate('local', { failureRedirect: '/auth' }), (req, res) => {
    console.log(req.body, 'post', '/auth');

    res.redirect('/user-bidding');
});

// router.get('/admin', (req, res) => {
//     console.log(req.body, 'get', '/admin');
//
//     res.render('admin');
// });

router.get('/user-bidding' , require('connect-ensure-login').ensureLoggedIn('/auth'), (req, res) => {
    console.log(req.body, 'get', '/user-bidding');

    res.render('user-bidding', {user: req.user});
});

router.get('/user-purchases', require('connect-ensure-login').ensureLoggedIn('/auth'), (req,res) => {
    console.log(req.body, 'get', '/user-purchases');

    res.render('user-purchases', {user: req.user});
});

module.exports = router;
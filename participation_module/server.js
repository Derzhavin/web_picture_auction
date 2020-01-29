#!/usr/bin/env node
var app = require('./app');
var https = require('https');
var path = require('path');
const fs = require('fs');

var key = fs.readFileSync(path.join(__dirname, 'keys', 'selfsigned.key'));
var cert = fs.readFileSync(path.join(__dirname, 'keys', 'selfsigned.crt'));
var options = {
    key: key,
    cert: cert
};

var server = https.createServer(options, app);
server.listen(3000,  ()  => {
    console.log('Listening on port 3000!');
});

var io = require('socket.io')(server);

var db = require('./db');
const {Auction} = require('./auction');

var connections = {};

var auction = new Auction(db.settings, db.arts);

auction.start(io.sockets, connections);

module.exports = server;
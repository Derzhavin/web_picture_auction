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
let port = 3000;
var server = https.createServer(options, app);
server.listen(port,  ()  => {
    console.log(`Listening on port ${port}!`);
});

var io = require('socket.io')(server);

var db = require('./db');

const {Auction} = require('./serverAuction/auction');
const {ConnectionNotifier} = require('./serverAuction/connectionNotifier');

var auction = new Auction(db);
var connectionNotifier = new ConnectionNotifier();

connectionNotifier.start(io);
auction.start(io, connectionNotifier);

module.exports = server;
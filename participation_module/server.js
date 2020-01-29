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

var connections = {};

io.sockets.on('connection', socket => {
    socket.on('new connection', data => {
        connections[socket.id] = data.username;
        io.sockets.emit('new connection', {username: data.username});
    });

    socket.on('disconnect', data => {
        io.sockets.emit('some user disconnected', {username: connections[socket.id]});
        delete connections[socket.id];
    });
});

module.exports = server;
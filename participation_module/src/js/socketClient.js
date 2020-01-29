$(() => {
    var socket = io();

    let username = $('#user').text();

    socket.emit('new connection', {username: username});

    socket.on('new connection', data => {
        sendMsg(`${data.username} joined chat!`);
    });

    socket.on('user disconnected', data => {
        console.log('some user disconnected')
        sendMsg(`${data.username} left chat!`);
    })
});

function sendMsg(msg) {
    $('#chat').append("<p>" + msg);
}
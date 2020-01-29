$(() => {
    var socket = io();
    var isNotifiedAboutNotStarted = false;

    let username = $('#user').text();

    socket.emit('new connection', {username: username});

    socket.on('new connection', data => {
        showMsg(data.username, `${data.username} joined chat!`);
    });

    socket.on('user disconnected', data => {
        showMsg(data.username, `${data.username} left chat!`);
    });

    socket.on('auction started', data => {
        showMsg('server', 'Auction started!');
    });
    
    socket.on('auction finished', data => {
        showMsg('server', 'Auction finished!');
    });

    socket.on('auction not started', data => {
        if (!isNotifiedAboutNotStarted) {
            showMsg('server', 'Auction not started!');
        }
    })
});

function showMsg(author, msg) {
    $('#chat').append("<p>" + author + ': ' + msg);
}
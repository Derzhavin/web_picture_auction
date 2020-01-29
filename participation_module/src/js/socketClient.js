$(() => {
    var socket = io();
    var startTime = null,
        endTime = null;

    let username = $('#user').text();

    socket.emit('new connection', {username: username});

    socket.on('new connection', data => {
        showMsg(data.username, `${data.username} joined chat!`);
    });

    socket.on('some user disconnected', data => {
        showMsg(data.username, `${data.username} left chat!`);
    });
    
    socket.on('auction finished', data => {
        showMsg('server', 'Auction finished!');
        document.getElementById("auction-clocks").innerText = "00:00:00";
    });

    
    socket.on('auction start time', data => {
        startStopwatch(data.startTime - Date.now(), 1000, (currentTimeTimer) => {
               document.getElementById("auction-clocks").innerText = getCountDown(currentTimeTimer);
        });
    });

    socket.on('auction started', data => {
        startStopwatch(data.endTime - Date.now(), 1000, (currentTimeTimer) => {
            document.getElementById("auction-clocks").innerText = getCountDown(currentTimeTimer);
        });
    });
});

function showMsg(author, msg) {
    $('#chat').append("<p>" + author + ': ' + msg);
}

function getCountDown(ms) {
    let time = ms / 1000;
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 60 * 60) / 60);
    let seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
    let format = (number) => {
        return (number / 10 >= 1) ? number : '0' + number
    };
    return format(hours) + ':' + format(minutes) + ':' + format(seconds);
}

function startStopwatch(timer, freq, callback) {
    let currentTimeTimer = timer;

    let intervalId = setInterval(() => {
        callback(currentTimeTimer);
        currentTimeTimer -= freq;
    }, freq);

    setTimeout(() => {
        clearInterval(intervalId)
    }, timer);
}
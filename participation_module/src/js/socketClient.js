$(() => {
    var socket = io();

    setupEvents(socket);

    let username = $('#user').text();

    socket.emit('new connection', {username: username});

    socket.on('new connection', data => {
        showMsg(data.username, `${data.username} joined chat!`);
    });

    socket.on('some user disconnected', data => {
        showMsg(data.username, `${data.username} left chat!`);
    });

    socket.on('auction before', data => {
        visualizeAuctionClocks(data.startTime - Date.now());
    });

    socket.on('auction started', data => {
        showMsg('server', 'Auction started!');
        visualizeAuctionClocks(data.endTime - Date.now());
        $('button[name="offer"]').attr('disabled', false);
    });

    socket.on('auction inProgress', data => {
        visualizeAuctionClocks(data.endTime - Date.now());
        $('button[name="offer"]').attr('disabled', false);
    });

    socket.on('auction finished', data => {
        showMsg('server', 'Auction finished!');
        document.getElementById("auction-clocks").innerText = "00:00:00";
        $('button[name="offer"]').attr('disabled', true);
    });

    socket.on('new item acquaintance', data => {
        showMsg('server', 'new art acquaintance!');
        $("#art-dialog").find("label[name='count-down']").val("00:00:00");
        setArtInfo(data);
        startStopwatch(data.pause, 1000, (currentTimeTimer) => {
            $("#art-dialog").find("label[name='time-to-acquaintance']").val(getCountDown(currentTimeTimer));
        });
    });

    socket.on('new item sale', data => {
        showMsg('server', 'new art sale!');
        $("#art-dialog").find("label[name='time-to-acquaintance']").val("00:00:00");
        setArtInfo(data);
        startStopwatch(data.pause, 1000, (currentTimeTimer) => {
            $("#art-dialog").find("label[name='count-down']").val(getCountDown(currentTimeTimer));
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

function visualizeAuctionClocks(timer) {
    startStopwatch(timer, 1000, (currentTimeTimer) => {
        document.getElementById("auction-clocks").innerText = getCountDown(currentTimeTimer);
    });
}

function setupEvents(socket) {
    $("button[name='offer']").click(() => offer(socket));
}

function offer(socket) {
    console.log($("input[name='raising-sum']"));
    socket.emit('offer', {raisingSum: parseInt($("input[name='raising-sum']").val()), money: parseInt($("#balance").text())});
}

function setArtInfo(data) {
    $("#art-dialog").find("img").get()[0].src = data.item.way;
    $("#art-dialog").find("label[name='name']").get()[0].innerText = data.item.artName;
    $("#art-dialog").find("label[name='artist']").get()[0].innerText = data.item.artist;
    $("#art-dialog").find("label[name='start-price']").get()[0].innerText = data.item.price;
    $("#art-dialog").find("label[name='current-price']").get()[0].innerText = data.item.price;
    $("#art-dialog").find("label[name='min-step']").get()[0].innerText = data.item.minStep;
    $("#art-dialog").find("label[name='max-step']").get()[0].innerText = data.item.maxStep;
}
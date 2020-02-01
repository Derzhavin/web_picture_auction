import {Stopwatch} from './stopwatch.js';

$(() => {
    var socket = io();
    var itemSaleStopwatch = null;
    var itemAcquaintanceStopWatch = null;

    setupEvents(socket);

    let username = $('#user').text();

    socket.emit('new connection', {username: username});
    socket.emit('bring up to date');

    socket.on('about connection', data => {showMsg("", data.msg);});
    socket.on('chat history', data => data.chat.forEach(line => showMsg(line.username, line.msg)));
    socket.on('auction before', data => {visualizeAuctionClocks(data.startTime - Date.now());});
    socket.on('auction stage', data => {showMsg('', data.msg);});
    socket.on('knock me', () => socket.emit('bring up to date'));

    socket.on('auction inProgress', data => {
        visualizeAuctionClocks(data.endTime - Date.now());
        $('button[name="offer"]').attr('disabled', false);
    });

    socket.on('auction finished', data => {
        document.getElementById("auction-clocks").innerText = "00:00:00";
        $('button[name="offer"]').attr('disabled', true);
    });

    socket.on('new item acquaintance', data => {
        showMsg('', 'new art acquaintance!');
        setArtInfo(data);

        itemAcquaintanceStopWatch = new Stopwatch(data.endTimeAcquaintanceItem - Date.now(), 1000, (currentTimeTimer) => {
            $("#art-dialog").find("label[name='time-to-acquaintance']").get()[0].innerText = getCountDown(currentTimeTimer);
        }, () => {});
        itemAcquaintanceStopWatch.start();
    });

    socket.on('new item sale', data => {
        showMsg('', 'new art sale!');
        setArtInfo(data);
        itemSaleStopwatch = new Stopwatch(data.endTimeSaleItem - Date.now(), 1000, (currentTimeTimer) => {
            $("#art-dialog").find("label[name='count-down']").get()[0].innerText = getCountDown(currentTimeTimer);
        }, () => {});
        itemSaleStopwatch.start();
    });

    socket.on('some user raised sum', data => {
        showMsg(data.username, data.msg);
        itemSaleStopwatch.addExtraTime(data.endTimeSaleItem - Date.now());
        setArtInfo(data);
    });

    socket.on('not enough money', () => {alert('Not enough money!');});

    socket.on('some user bought item', data => {showMsg(data.username, data.msg);})
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
        callback(currentTimeTimer);
        clearInterval(intervalId)
    }, timer);

    return intervalId;
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
    let item = data.item;

    $("#art-dialog").find("img").get()[0].src = data.item.way;
    $("#art-dialog").find("label[name='name']").get()[0].innerText = item.artName;
    $("#art-dialog").find("label[name='artist']").get()[0].innerText = item.artist;
    $("#art-dialog").find("label[name='start-price']").get()[0].innerText = item.price;
    $("#art-dialog").find("label[name='current-price']").get()[0].innerText = (item.newPrice) ? item.newPrice: item.price;
}
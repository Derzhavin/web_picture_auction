import {Stopwatch} from './stopwatch.js';

$(() => {
    var socket = io();
    var itemSaleStopwatch = null;
    var itemAcquaintanceStopWatch = null;
    var auctionStopWatch = null;
    var $countDown = $("#art-dialog").find("label[name='count-down']").get()[0];
    var $timeToAcquaintance = $("#art-dialog").find("label[name='time-to-acquaintance']").get()[0];
    var auctionClocksId = document.getElementById("auction-clocks");
    var username = $('#user').text();

    setupEvents(socket);
    
    socket.emit('new connection', {username: username});
    socket.emit('bring up to date');
    socket.on('about connection', data => {showMsg("", data.msg);});
    socket.on('chat history', data => data.chat.forEach(line => showMsg(line.username, line.msg)));
    socket.on('auction before', data => {auctionStopWatch = makeVisualizedClock(auctionClocksId, data.startTime - Date.now());});
    socket.on('auction stage', data => {showMsg('', data.msg);});
    socket.on('knock me', () => socket.emit('bring up to date'));
    socket.on('auction inProgress', data => {
        auctionStopWatch = makeVisualizedClock(auctionClocksId, data.endTime - Date.now());
        setOffer(true);
    });
    socket.on('auction finished', data => {
        [auctionStopWatch, itemSaleStopwatch, itemAcquaintanceStopWatch].forEach(e => {if (e) {e.stop();}});
        setOffer(false);
    });
    socket.on('new item acquaintance', data => {
        showMsg('', 'new art acquaintance!');
        setArtInfo(data);
        setOffer(false);
        itemAcquaintanceStopWatch = makeVisualizedClock($timeToAcquaintance, data.endTimeAcquaintanceItem - Date.now());
    });
    socket.on('new item sale', data => {
        showMsg('', 'new art sale!');
        setArtInfo(data);
        setOffer(true);
        itemSaleStopwatch = makeVisualizedClock($countDown, data.endTimeSaleItem - Date.now());
    });
    socket.on('some user raised sum', data => {
        showMsg(data.username, data.msg);
        itemSaleStopwatch.addExtraTime(data.endTimeSaleItem - Date.now());
    });
    socket.on('not enough money', () => alert('Not enough money!'));
    socket.on('purchase result', data => showMsg(data.username, data.msg));
    socket.on('you bought', data => {$("#balance").innerText = (parseInt($("#balance").innerText) - data.newPrice).toString();});
    socket.on('update admin info', data => {
        // $("#participants").empty();
        // data.participants.forEach(p => {
        //     let instanceParticipantDiv = $("#instanceParticipantDiv").clone();
        //     instanceParticipantDiv.find("label[name='participant']").get()[0].innerText = p.username;
        //     instanceParticipantDiv.find("label[name='money']").get()[0].innerText = p.username;
        //     instanceParticipantDiv.show();
        //     instanceParticipantDiv.removeAttr('id');
        //     $("#participants").append(instanceParticipantDiv);
        // });
        //
        // $("#arts").empty();
        // data.arts.forEach(a => {
        //     let instanceArtDiv = $("#instanceArtDiv").clone();
        //     instanceArtDiv.find("img").get()[0].src = a.way;
        //     instanceArtDiv.find("label[name='name']").get()[0].innerText = a.artName;
        //     instanceArtDiv.find("label[name='artist']").get()[0].innerText = a.artist;
        //     instanceArtDiv.find("label[name='start-price']").get()[0].innerText = a.price;
        //     instanceArtDiv.find("label[name='sold-for']").get()[0].innerText = (a.newPrice) ? a.newPrice: '-';
        //     instanceArtDiv.find("label[name='owner']").get()[0].innerText = a.owner;
        //
        //     instanceArtDiv.show();
        //     instanceArtDiv.removeAttr('id');
        //     $("#arts").append(instanceArtDiv);
        // });
    });
});

function setOffer(state) {$('button[name="offer"]').attr('disabled', !state);}

function makeVisualizedClock(objId, timer) {
    let stopwatch  = new Stopwatch(timer, 1000, currentTimeTimer => {objId.innerText = getCountDown(currentTimeTimer);}, () => objId.innerText = "00:00:00");
    stopwatch.start();
    return stopwatch;
}

function showMsg(author, msg) {$('#chat').append("<p>" + author + ': ' + msg);}

function getCountDown(ms) {
    let time = ms / 1000;
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - hours * 60 * 60) / 60);
    let seconds = Math.floor(time - hours * 60 * 60 - minutes * 60);
    let format = (number) => {return (number / 10 >= 1) ? number : '0' + number};
    return format(hours) + ':' + format(minutes) + ':' + format(seconds);
}

function setupEvents(socket) {$("button[name='offer']").click(() => offer(socket));}

function offer(socket) {return socket.emit('offer', {raisingSum: parseInt($("input[name='raising-sum']").val())});}

function setArtInfo(data) {
    let item = data.item;

    $("#art-dialog").find("img").get()[0].src = item.way;
    $("#art-dialog").find("label[name='name']").get()[0].innerText = item.artName;
    $("#art-dialog").find("label[name='artist']").get()[0].innerText = item.artist;
    $("#art-dialog").find("label[name='start-price']").get()[0].innerText = item.price;
    $("#art-dialog").find("label[name='min-step']").get()[0].innerText = item.minStep;
    $("#art-dialog").find("label[name='max-step']").get()[0].innerText = item.maxStep;
    $("#art-dialog").find("label[name='current-price']").get()[0].innerText = (item.newPrice) ? item.newPrice: item.price;
}
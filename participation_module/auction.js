const EventEmitter = require('events');

const stage = {
    before: 0x0,
    inProgress: 0x1,
    finished: 0x2
};

const state = {
    acquaintance: 0x0,
    sale: 0x1
};

function Auction(settings, items) {
    let initStartTime = (date, time) => {
        let timeArr = time.split(':');
        return Date.parse(date) + parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000 - 3 * 60 * 60 * 1000;
    };

    let initEndTime = (startTime, duration) => {
        let timeArr = duration.split(':');
        return startTime + parseInt(timeArr[0]) * 60 * 60 * 1000 + parseInt(timeArr[1]) * 60 * 1000;
    };

    let initInSecHoursTime = (pauseTime) => {
        let timeArr = pauseTime.split(':');
        return parseInt(timeArr[0]) * 60 * 1000 + parseInt(timeArr[1]) * 1000;
    };

    let createItemIterator = (sockets) => {
        const itemIterator = new EventEmitter();
        itemIterator.on('sell item', () => {
            this.currentItemInd++;
            this.state = state.acquaintance;

            sockets.emit('new item acquaintance', {item: this.items[this.currentItemInd], pause: this.pause});
            setTimeout(() => {
                this.state = state.sale;
                sockets.emit('new item sale', {item: this.items[this.currentItemInd], timeout: this.timeout});
            }, this.pause);
        });
    
        return itemIterator;
    };
    
    this.startTime = initStartTime(settings.date, settings.time);
    this.endTime = initEndTime(this.startTime, settings.duration);
    this.programStartedTime = Date.now();
    this.pause = initInSecHoursTime(settings.pause_time);
    this.timeout = initInSecHoursTime(settings.timeout);

    this.stage = stage.before;
    this.state = state.acquaintance;
    this.currentItemInd = -1;
    this.items = items;
    
    this.planStages = (sockets) => {
        this.stage = stage.before;
        setTimeout(() => {
            this.stage = stage.inProgress;
            sockets.emit('auction started', {endTime: this.endTime});

            this.itemIterator.emit('sell item');

            setTimeout(() => {
                this.stage = stage.finished;
                sockets.emit('auction finished');
            }, this.endTime - this.startTime);
        }, this.startTime - this.programStartedTime);
    };

    this.start = (sockets, connections) => {
        this.planStages(sockets);

        this.itemIterator = createItemIterator(sockets);

        sockets.on('connection', socket => {
            socket.on('new connection', data => {
                connections[socket.id] = data.username;
                sockets.emit('new connection', {username: data.username});

                if (this.stage === stage.before) {
                    socket.emit('auction before', {startTime: this.startTime});
                }

                if (this.stage === stage.inProgress) {
                    socket.emit('auction inProgress', {endTime: this.endTime});
                }

                if (this.stage === stage.finished) {
                    socket.emit('auction finished');
                }
            });

            socket.on('offer', data => {
                console.log('OFFER', data);
            });

            socket.on('disconnect', data => {
                sockets.emit('some user disconnected', {username: connections[socket.id]});
                delete connections[socket.id];
            });
        });

    };
}

module.exports.Auction = Auction;
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

    let initPauseTime = (pauseTime) => {
        let timeArr = pauseTime.split(':');
        return parseInt(timeArr[0]) * 60 * 1000 + parseInt(timeArr[1]) * 1000;
    };

    this.startTime = initStartTime(settings.date, settings.time);
    this.endTime = initEndTime(this.startTime, settings.duration);
    this.programStartedTime = Date.now();

    this.pause = initPauseTime(settings.pause_time);

    this.stage = stage.before;
    this.state = state.acquaintance;
    this.currentItem = items[0];
    this.items = items;

    this.nextItem = () => {
        this.state = state.acquaintance;
        setTimeout(() => {
            this.state = state.sale;
        }, this.pause);
    };

    console.log((this.startTime - this.programStartedTime) / 1000 / 60)
    console.log((this.endTime - this.startTime) / 1000 / 60)

    this.start = (sockets, connections) => {
        this.stage = stage.before;
        setTimeout(() => {
            this.stage = stage.inProgress;
            sockets.emit('auction started', {endTime: this.endTime});

            setTimeout(() => {
                this.stage = stage.finished;
                sockets.emit('auction finished');
            }, this.endTime - this.startTime);
        }, this.startTime - this.programStartedTime);

        sockets.on('connection', socket => {
            socket.on('new connection', data => {
                connections[socket.id] = data.username;
                sockets.emit('new connection', {username: data.username});
            });

            if (this.stage === stage.before) {
                socket.emit('auction start time', {startTime: this.startTime});
            }

            if (this.stage === stage.inProgress) {
                socket.emit('auction started', {endTime: this.endTime});
            }

            if (this.stage === stage.finished) {
                socket.emit('auction finished');
            }

            socket.on('disconnect', data => {
                sockets.emit('some user disconnected', {username: connections[socket.id]});
                delete connections[socket.id];
            });
        });

    };
}

module.exports.Auction = Auction;
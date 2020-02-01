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

    let createItemIterator = (io) => {
        const itemIterator = new EventEmitter();
        itemIterator.on('sell item', () => {
            this.currentItemInd++;
            this.state = state.acquaintance;

            io.sockets.emit('new item acquaintance', {item: this.items[this.currentItemInd], pause: this.pause});
            setTimeout(() => {
                this.state = state.sale;
                io.sockets.emit('new item sale', {item: this.items[this.currentItemInd], timeout: this.timeout});
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
    
    this.planStages = (io, connectionNotifier) => {
        let msg = "";

        let goToBefore = () => {
            this.stage = stage.before;
            setTimeout(() => goToInProgress(), this.startTime - this.programStartedTime);
        };

        let goToFinished = () => {
            this.stage = stage.finished;

            msg = 'Auction finished!';
            io.sockets.emit('auction finished', {msg: msg});
            connectionNotifier.saveMsg("", msg);
        };

        let goToInProgress = () => {
            this.stage = stage.inProgress;

            msg = 'Auction started!';
            io.sockets.emit('auction started', {endTime: this.endTime, msg: msg});
            connectionNotifier.saveMsg("", msg);

            this.itemIterator.emit('sell item');
            setTimeout(() => goToFinished(), this.endTime - this.startTime);
        };

        if (this.startTime > this.programStartedTime) {
            goToBefore();
        } else if (this.endTime > this.programStartedTime) {
            goToInProgress();
        } else {
            goToFinished();
        }

    };

    this.bringUpToDateUser = (io) => {
        io.sockets.on('connection', socket => {
            socket.on('new connection', data => {
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
        });
    };

    this.doBidding = (io, connectionNotifier) => {
        io.sockets.on('connection', socket => {
            socket.on('offer', data => {
                console.log('OFFER', data);
            });
        });
    };

    this.start = (io, connectionNotifier) => {
        this.itemIterator = createItemIterator(io);

        console.log(this.startTime - this.programStartedTime);
        console.log(this.endTime - this.startTime);
        this.planStages(io, connectionNotifier);
        this.bringUpToDateUser(io);
        this.doBidding(io, connectionNotifier);
    };
}

module.exports.Auction = Auction;
const EventEmitter = require('events');
const {Stopwatch} = require('../stopwatch');

const stage = {
    before: 0x0,
    inProgress: 0x1,
    finished: 0x2
};

const state = {
    acquaintance: 0x0,
    sale: 0x1
};

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

function Auction(db) {
    let createItemIterator = (io, connectionNotifier) => {
        const itemIterator = new EventEmitter();
        itemIterator.on('sell item', () => {
            this.currentPurchaser = null;
            this.currentItemInd++;
            this.state = state.acquaintance;
            this.endTimeAcquaintanceItem = Date.now() + this.pause;

            io.sockets.emit('knock me');
            setTimeout(() => {
                this.stopwatch = new Stopwatch(this.timeout, 1000, () => {}, () => {
                    let msg = "";
                    if (this.currentPurchaser) {
                        msg = this.currentPurchaser + ' bought art!';
                        this.tmpParticipants = db.users.cloneUsers();
                        let art = this.items[this.currentItemInd];
                        db.purchases.giveArtToUser(this.currentPurchaser, art);
                        db.users.setUserMoney(this.currentPurchaser, db.users.getMoneyByUsername(this.currentPurchaser) - art.newPrice);
                        db.arts.updateArtPrice(art.artName, art.newPrice);
                        db.arts.setArtOwner(art.artName, this.currentPurchaser);
                        io.sockets.sockets[connectionNotifier.getSocketIdByUsername(this.currentPurchaser)].emit('you bought', {price: art.newPrice});
                    } else {
                        this.tmpParticipants = db.users.cloneUsers();
                        this.currentPurchaser = "";
                        msg = "nobody bought art!";
                    }
                    connectionNotifier.saveMsg(this.currentPurchaser, msg);
                    io.sockets.emit('purchase result', {username: this.currentPurchaser, msg: msg});
                    let id = connectionNotifier.getSocketIdByUsername('admin');

                    if (id) {
                        io.sockets.sockets[id].emit('update admin info', {arts: db.arts.arts, participants: db.users.participants});
                    }

                    if (this.currentItemInd < this.items.length) {
                        itemIterator.emit('sell item');
                    }
                });
                this.stopwatch.start();

                this.state = state.sale;
                this.endTimeSaleItem = Date.now() + this.timeout;
                io.sockets.emit('knock me');
            }, this.pause);
        });

        return itemIterator;
    };

    this.startTime = initStartTime(db.settings.date, db.settings.time);
    this.endTime = initEndTime(this.startTime, db.settings.duration);
    this.programStartedTime = Date.now();
    this.pause = initInSecHoursTime(db.settings.pause_time);
    this.timeout = initInSecHoursTime(db.settings.timeout);
    this.endTimeAcquaintanceItem = 0;
    this.endTimeSaleItem = 0;
    this.stage = stage.before;
    this.state = state.acquaintance;
    this.currentItemInd = -1;
    this.items = db.arts.arts;
    this.currentPurchaser = null;
    this.tmpParticipants = db.users.cloneUsers();

    this.updateTmpParticipant = (username, raisingSum) => {
        this.tmpParticipants.filter(p => p.username === username)[0].money -= raisingSum;
    };

    this.planStages = (io, connectionNotifier) => {
        let msg = "";

        let goToBefore = () => {
            this.stage = stage.before;
            setTimeout(() => goToInProgress(), this.startTime - this.programStartedTime);
        };

        let goToFinished = () => {
            this.stage = stage.finished;
            io.sockets.emit('auction stage', {msg: 'Auction finished!'});
            io.sockets.emit('knock me');
            if (this.stopwatch) {
                this.stopwatch.stop();
            }

            this.itemIterator.removeAllListeners();
            connectionNotifier.saveMsg("", 'Auction finished!');
        };

        let goToInProgress = () => {
            this.stage = stage.inProgress;
            io.sockets.emit('auction stage', {msg: 'Auction started!'});
            io.sockets.emit('knock me');
            connectionNotifier.saveMsg("", 'Auction started!');
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
            socket.on('bring up to date', () => {
                if (this.stage === stage.before) {
                    socket.emit('auction before', {startTime: this.startTime});
                }

                if (this.stage === stage.inProgress) {
                    socket.emit('auction inProgress', {endTime: this.endTime});

                    if (this.state === state.acquaintance) {
                        socket.emit('new item acquaintance', {item: this.items[this.currentItemInd], endTimeAcquaintanceItem: this.endTimeAcquaintanceItem});
                    }

                    if (this.state === state.sale) {
                        socket.emit('new item sale', {item: this.items[this.currentItemInd], endTimeSaleItem: this.endTimeSaleItem});
                    }
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
                console.log(data);
                if (data.raisingSum) {
                    let username = connectionNotifier.getUserBySocketId(socket.id);
                    let raisingSum = data.raisingSum;
                    let userMoney = db.users.getMoneyByUsername(username);
                    let item = this.items[this.currentItemInd];
                    let newPrice = item.price + raisingSum;

                    if (userMoney >= newPrice) {
                        this.updateTmpParticipant(username, raisingSum);
                        this.currentPurchaser = username;
                        let msg = `${username} raised sum by ${raisingSum}`;
                        connectionNotifier.saveMsg(username, msg);
                        io.sockets.emit('some user raised sum', {
                            username: username,
                            item: item,
                            msg: msg,
                            endTimeSaleItem: this.endTimeSaleItem + this.timeout
                        });

                        this.stopwatch.addExtraTime(this.timeout);
                    } else {
                        socket.emit('not enough money');
                    }
                }
            });
        });
    };

    this.start = (io, connectionNotifier) => {
        this.itemIterator = createItemIterator(io, connectionNotifier);
        this.planStages(io, connectionNotifier);
        this.bringUpToDateUser(io);
        this.doBidding(io, connectionNotifier);
    };
}

module.exports.Auction = Auction;
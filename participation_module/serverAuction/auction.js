const enums = require('./enums');
const utilities = require('./utilities');
const {Vendor} = require('./vendor');

function Auction(db) {
    this.startTime = utilities.initStartTime(db.settings.date, db.settings.time);
    this.endTime = utilities.initEndTime(this.startTime, db.settings.duration);
    this.programStartedTime = Date.now();
    this.stage = enums.stage.before;
    this.vendor = new Vendor(db);

    this.planStages = (io, connectionNotifier) => {
        let goToBefore = () => {
            this.stage = enums.stage.before;
            setTimeout(() => goToInProgress(), this.startTime - this.programStartedTime);
        };

        let goToFinished = () => {
            this.stage = enums.stage.finished;
            io.sockets.emit('auction stage', {msg: 'Auction finished!'});
            io.sockets.emit('knock me');
            this.vendor.stopSell();
            connectionNotifier.saveMsg("", 'Auction finished!');
        };

        let goToInProgress = () => {
            this.stage = enums.stage.inProgress;
            io.sockets.emit('auction stage', {msg: 'Auction started!'});
            io.sockets.emit('knock me');

            connectionNotifier.saveMsg("", 'Auction started!');

            this.vendor.startTrade(io, connectionNotifier);
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
                if (this.stage === enums.stage.before) {
                    socket.emit('auction before', {startTime: this.startTime});
                }
                if (this.stage === enums.stage.inProgress) {
                    socket.emit('auction inProgress', {endTime: this.endTime});

                    if (this.vendor.state === enums.state.acquaintance) {
                        socket.emit('new item acquaintance', {item: this.vendor.getCurrentItem(), endTimeAcquaintanceItem: this.vendor.endTimeAcquaintanceItem});
                    }
                    if (this.vendor.state === enums.state.sale) {
                        socket.emit('new item sale', {item: this.vendor.getCurrentItem(), endTimeSaleItem: this.vendor.endTimeSaleItem});
                    }
                }
                if (this.stage === enums.stage.finished) {
                    socket.emit('auction finished');
                }
            });
        });
    };

    this.start = (io, connectionNotifier) => {
        this.vendor.init(io, connectionNotifier);
        this.planStages(io, connectionNotifier);
        this.bringUpToDateUser(io);
    };
}

module.exports.Auction = Auction;
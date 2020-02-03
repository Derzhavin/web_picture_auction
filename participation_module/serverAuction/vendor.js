const EventEmitter = require('events');
const {Stopwatch} = require('../stopwatch');
const utilities = require('./utilities');
const enums = require('./enums');

function Vendor(db) {
    this.pause = utilities.initInSecHoursTime(db.settings.pause_time);
    this.timeout = utilities.initInSecHoursTime(db.settings.timeout);
    this.currentItemInd = -1;
    this.items = db.arts.arts;
    this.itemIterator = new EventEmitter();
    this.updateTmpParticipant = (username, raisingSum) => {this.tmpParticipants.filter(p => p.username === username)[0].money -= raisingSum;};

    this.initSellOneItem = () => {
        this.currentPurchaser = null;
        this.state = enums.state.acquaintance;
        this.endTimeAcquaintanceItem = Date.now() + this.pause;
        this.tmpParticipants = db.cloneRecords(db.users.participants);
    };

    this.updateDb = () => {
        let userMoneyBefore = db.getMoneyByUsername(db.users.participants, this.currentPurchaser);
        let boughtArt = this.getCurrentItem();
        db.purchases.giveArtToUser(this.currentPurchaser, boughtArt.artName);
        db.setUserMoney(db.users.participants, this.currentPurchaser, userMoneyBefore - parseInt(boughtArt.newPrice));
        db.arts.updateArtPrice(boughtArt.artName, parseInt(boughtArt.newPrice));
        db.arts.setArtOwner(boughtArt.artName, this.currentPurchaser);
    };

    this.init = (io, connectionNotifier) => {
        this.doBidding(io, connectionNotifier);
    };

    this.startTrade = (io, connectionNotifier) => {
        this.itemIteratorStart(io, connectionNotifier);
    };

    this.itemIteratorStart = (io, connectionNotifier) => {
        this.itemIterator.on('sell item', () => {
            this.initSellOneItem();
            this.currentItemInd++;
            io.sockets.emit('knock me');

            setTimeout(() => {
                this.stopwatch = new Stopwatch(this.timeout, 1000, () => {}, () => {
                    let msg = "";

                    if (this.currentPurchaser) {
                        msg = this.currentPurchaser + ' bought art!';
                        this.updateDb();
                        let purchaserId = connectionNotifier.getSocketIdByUsername(this.currentPurchaser);
                        io.sockets.sockets[purchaserId].emit('you bought', {price: this.getCurrentItem().newPrice});
                    } else {
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
                        this.itemIterator.emit('sell item');
                    }
                });
                this.stopwatch.start();

                this.state = enums.state.sale;
                this.endTimeSaleItem = Date.now() + this.timeout;
                io.sockets.emit('knock me');
            }, this.pause);
        });

        this.itemIterator.emit('sell item');
    };

    this.stopSell = () => {
        if (this.stopwatch) {
            this.stopwatch.stop();
        }
        this.itemIterator.removeAllListeners();
    };

    this.getCurrentItem = () => {return this.items[this.currentItemInd];};
    this.doBidding = (io, connectionNotifier) => {
        io.sockets.on('connection', socket => {
            socket.on('offer', data => {
                console.log('BIDDING!', data);

                if (data.raisingSum) {
                    let username = connectionNotifier.getUserBySocketId(socket.id);
                    let userMoney = db.getMoneyByUsername(this.tmpParticipants, username);
                    let item = this.getCurrentItem();

                    let newPrice = parseInt(item.price) + parseInt(data.raisingSum);
                    if (userMoney >= newPrice) {
                        item.newPrice = newPrice.toString();
                        this.updateTmpParticipant(username, data.raisingSum);
                        this.currentPurchaser = username;
                        let msg = `${username} raised sum by ${data.raisingSum}`;
                        connectionNotifier.saveMsg(username, msg);
                        io.sockets.emit('some user raised sum', {
                            username: username,
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
}

module.exports.Vendor = Vendor;
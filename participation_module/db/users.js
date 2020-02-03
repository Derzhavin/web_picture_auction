let pathToParticipants = './jsons/participants.json';

const fs = require('fs');
const path = require('path');

var records = require(pathToParticipants);

var adminKey = 'admin';

records.forEach((record, index) => {
    record.id = index + 1;
    record.password = '1234';
});

records.push({username: 'admin', id: records.length + 1, password: adminKey});
exports.adminKey = adminKey;

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
}

exports.setUserMoney = (username, money) => {
    let participant = records.filter(participant => participant.username === username)[0];

    if (!participant) {
        throw `no user with this username ${username}!`;
    } else {
        participant.money = money;

        fs.writeFile(path.join('db', pathToParticipants), JSON.stringify(records), err => {if(err) {throw err;}});
    }
};

exports.getMoneyByUsername = (username) => {
    let participant = records.filter(participant => participant.username === username)[0];

    if (!participant) {
        throw 'no user with this username!';
    } else {
        return participant.money;
    }
};

exports.cloneUsers = () => {return JSON.parse(JSON.stringify(records));}

exports.participants = records;
let pathToParticipants = './jsons/participants.json';

const fs = require('fs');
const path = require('path');

var records = require(pathToParticipants);

var adminKey = 'admin';

admin = {username: 'admin', id: records.length + 1, password: adminKey}

records.forEach((record, index) => {
    record.id = index + 1;
    record.password = '1234';
});
console.log(records, admin);
exports.adminKey = adminKey;

exports.findById = function(id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            if (idx === records.length) {
                return cb(null, admin);
            }
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }

        if (username === 'admin') {
            return cb(null, admin);
        }

        return cb(null, null);
    });
};

exports.participants = records;
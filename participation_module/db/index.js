exports.settings = require('./jsons/settings');
exports.users = require('./users');
exports.arts = require('./arts');
exports.participants = require('./jsons/participants');
exports.purchases = require('./purchases');

const fs = require('fs');
const path = require('path');
let pathToParticipants = './jsons/participants.json';


exports.setUserMoney = (records, username, money) => {
    let participant = records.filter(participant => participant.username === username)[0];

    if (!participant) {
        throw `no user with this username ${username}!`;
    } else {
        participant.money = money.toString();

        fs.writeFile(path.join('db', pathToParticipants), JSON.stringify(records), err => {if(err) {throw err;}});
    }
};

exports.getMoneyByUsername = (records, username) => {
    let participant = records.filter(participant => participant.username === username)[0];

    if (!participant) {
        throw `no user with this username ${username}!`;
    }

    return parseInt(participant.money);
};

exports.cloneRecords = (records) => {return JSON.parse(JSON.stringify(records));}



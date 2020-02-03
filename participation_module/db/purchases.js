const pathToPurchases= './jsons/purchases.json';

const fs = require('fs');
const path = require('path');

var records = require(pathToPurchases);

if ( Object.keys(records).length === 0) {
    records = [];
}

exports.giveArtToUser = (username, artName) => {
    let record =  records.filter(record => record.username === username)[0];

    if (!record) {
        records.push({username: username, arts: [artName]});
    } else {
        records.arts.push(artName);
    }

    fs.writeFile(path.join('db', pathToPurchases), JSON.stringify(records), err => {if(err) {throw err;}});
};

exports.getArtsByUsername = (username) => {return records[username];};

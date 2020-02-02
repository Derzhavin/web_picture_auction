const pathToPurchases= './jsons/purchases';

const fs = require('fs');
var records = require(pathToPurchases);

exports.giveArtToUser = (username, artName) => {
    if (!records[username]) {
        records.push({username: username, arts: [artName]});
    } else {
        records[username].push(artName);
    }

    fs.writeFile(pathToPurchases, JSON.stringify(records), err => {if(err) {throw err;}});
};

exports.getArtsByUsername = (username) => {return records[username];};

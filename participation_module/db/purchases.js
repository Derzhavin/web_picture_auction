const pathToPurchases= './jsons/purchases';

const fs = require('fs');
var records = require(pathToPurchases);

exports.giveArtToUser = (username, art) => {
    if (!records[username]) {
        records.push({username: username, arts: [art]});
    } else {
        records[username].push(art);
    }

    fs.writeFile(pathToPurchases, JSON.stringify(records), err => {if(err) {throw err;}});
};

exports.getArtsByUsername = (username) => {return records[username];};

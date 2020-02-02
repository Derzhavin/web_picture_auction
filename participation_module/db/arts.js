const pathToArts = './jsons/arts';

var records = require(pathToArts);

const fs = require('fs');

exports.updateArtPrice = (artName, newPrice) => {
    let art = records.filter(art => art.artName === artName)[0];

    if (!art) {
        throw 'no art with such name!';
    } else {
        art.newPrice = newPrice;
        fs.writeFile(pathToArts, JSON.stringify(records), err => {if(err) {throw err;}});
    }
};

exports.setArtOwner = (artName, owner) => {
    records.filter(art => art.artName === artName)[0].owner = owner;
    fs.writeFile(pathToArts, JSON.stringify(records), err => {if(err) {throw err;}});
};

module.exports.arts = records;

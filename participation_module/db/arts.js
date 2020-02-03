const pathToArts = './jsons/arts.json';
const pathToUpdatedArts = './jsons/updatedArts.json';

var records = require(pathToArts);

const fs = require('fs');
const path = require('path');

exports.updateArtPrice = (artName, newPrice) => {
    let type = typeof newPrice;
    if (type !== 'number')  {
        throw `new Price must be number, not ${type}`;
    }
    let art = records.filter(art => art.artName === artName)[0];

    if (!art) {
        throw 'no art with such name!';
    } else {
        art.newPrice = newPrice.toString();
        fs.writeFile(path.join('db', pathToArts), JSON.stringify(records), err => {if(err) {throw err;}});
    }
};

exports.setArtOwner = (artName, owner) => {
    records.filter(art => art.artName === artName)[0].owner = owner;
    fs.writeFile(path.join('db', pathToArts), JSON.stringify(records), err => {if(err) {throw err;}});
};

module.exports.arts = records;

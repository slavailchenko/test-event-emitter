const express = require('express');
const fs = require('fs');
const stream = require('stream');
const JSONStream = require('JSONStream');
const jsonToCsv = require("json-to-csv-stream");
const Converter=require("csvtojson").Converter;
const csvConverter=new Converter({});
const crypto = require('crypto');

// Timer on use memory

const scheduleGc = () => {
    const limitMemory = 15000000;
    console.log('Memory usage', process.memoryUsage());
    if (process.memoryUsage().heapUsed > limitMemory) {
        console.log('Exit....');
        process.exit(-1);
    }
};

const isTimeUsedMemory = setInterval(scheduleGc, 500);

// check and remove file

const fileRemove = (file) => {
    fs.unlink(file, (error) => {
        if (!error) {
            console.log(`File ${file} removed`);
        } else {
            console.log ('Error deleting the file');
        }
    });
};

let i;

// functions of transform

const readTransformJSON = (chunk, encode, callback) => {
    i = ++i || 1;
    const { make, model, displayName, dealershipId } = chunk;
    chunk.hash = crypto.createHash('md5').update(make + model + displayName + dealershipId).digest('hex');
    // console.log (i);
    callback(null, JSON.stringify(chunk));
};

const readTransformCSV = (chunk, encode, callback) => {
    let buff = JSON.parse(chunk.toString());
    this.count = ++this.count || 1;
    buff.id = this.count;
    buff.vehicleId = Array(8).join().replace(/(.|$)/g, () => {
        return ((Math.random()*36)|0).toString(36)
    });
    let str = (buff.id === 1) ? '['+'\r\n'+JSON.stringify(buff)+','+'\r\n' :
        (buff.id === i) ? JSON.stringify(buff)+'\r\n'+']' :
            JSON.stringify(buff)+','+'\r\n';
    callback(null, str);
};

fileRemove('cars.csv');

// streams

fs.createReadStream('cars.json', {highWaterMark: 4096}).
pipe(JSONStream.parse('*')).
pipe(
    new stream.Transform ({
      objectMode: true,
      highWaterMark: 4,
        transform: readTransformJSON
    })
).
pipe(jsonToCsv()).
pipe(fs.createWriteStream('cars.csv', {highWaterMark: 4096})).
on('finish', () => fileRemove('cars2.json')).
on('finish', () => {
    fs.createReadStream('cars.csv', {highWaterMark: 2048}).
    pipe(csvConverter).
    pipe(
        new stream.Transform ({
            objectMode: true,
            highWaterMark: 4,
            transform: readTransformCSV
        })
    ).
    pipe(fs.createWriteStream ('cars2.json', {highWaterMark: 2048})).
    on('finish', () => {
        clearInterval (isTimeUsedMemory);
        console.log ('All completed');
    })
});
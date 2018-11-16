const express = require('express');
const fs = require('fs');
const stream = require('stream');
const JSONStream = require('JSONStream');
const jsonToCsv = require("json-to-csv-stream");
const Converter=require("csvtojson").Converter;
const csvConverter=new Converter({output: "csv", });
// const csvToJSON = require('csvtojson');
const crypto = require('crypto');

function scheduleGc () {
	const limitMemory = 157286400;
	console.log('Memory usage', process.memoryUsage());
	if (process.memoryUsage().heapUsed > limitMemory) {
		console.log('Exit....');
		process.exit(-1);
	}
};

const isTimeUsedMemory = setInterval(scheduleGc, 500);

const fileRemove = (file) => {
	fs.unlink(file, (error) => {
		if (!error) {
			console.log(`File ${file} removed`);
		} else {
			console.log ('Error deleting the file');
		}
	});
};

fileRemove('cars.csv');

fs.createReadStream('cars.json', { highWaterMark: 4096 }).
pipe(JSONStream.parse('*')).
pipe(
	new stream.Transform ({
		objectMode: true,
		highWaterMark: 4,
		transform: (chunk, encode, callback) => {
			const { make, model, displayName, dealershipId } = chunk;
			chunk.hash = crypto.createHash('md5').update(make + model + displayName + dealershipId).digest('hex');
			callback(null, JSON.stringify(chunk));
			// console.log(chunk);
		}
	})
	).pipe(jsonToCsv()).
pipe(
	fs.createWriteStream('cars.csv', { highWaterMark: 4096 })
	).
on('finish', () => fileRemove('cars2.json')).
on('finish', () => {
	fs.createReadStream('cars.csv', { highWaterMark: 2048 }).
	pipe(csvConverter).
	pipe(
        new stream.Transform ({
        	objectMode: true,
        	highWaterMark: 4,
        	transform: (chunk, encode, callback) => {
        		let buff = JSON.parse(chunk.toString());
        		this.count = ++this.count || 1;
        		buff.id = this.count;
        		buff.vehicleId = Array(8).join().replace(/(.|$)/g, () => {
        			return ((Math.random()*36)|0).toString(36)
        		});
        		callback(null, JSON.stringify(buff))
        	}
        })
      ).pipe(
      fs.createWriteStream('cars2.json', {
      	highWaterMark: 2048
      })
      ).
      on('finish', () => {
      	clearInterval (isTimeUsedMemory);
        console.log ('All completed');
      });
  });
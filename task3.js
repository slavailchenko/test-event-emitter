const express = require('express');
const fs = require('fs');
const {Transform} = require('stream');
const JSONStream = require('JSONStream');
const es = require('event-stream');
const csv = require('csv');

// const oppressor = require('oppressor');
// const bodyparser = require('body-parser');
const crypto = require('crypto');

function scheduleGc () {
	
	if (!global.gc) {
		console.log('Garbage collection is not exposed');
		return;
	}

	const limitMemory = 15728640;

	setTimeout(() => {
		global.gc();
		console.log('Memory usage', process.memoryUsage());
		if (process.memoryUsage().heapUsed < limitMemory) {
			scheduleGc();
		} else {
			console.log('Exit....');
			process.exit(-1);
		}
	}, 500);
};

fs.stat('cars.csv', ((err, stat) => {
	if (err == null) {
		console.log('File cars.csv exists');
		fs.unlink('cars.csv', (error) => {
			if (!error) {
				console.log('File cars.csv removed');
			} else {
				console.log ('Error deleting the file');
			}
		})
	} else {
		console.log('File cars.csv not exists');
	}
})
);

es.pipeline(
	fs.createReadStream('cars1.json'),
	JSONStream.parse(),
	es.map((data, next) => {

		data.hash = 33333;
		console.log(data);
		console.log(next);

		next(null, [data])
	}),
	csv().to('cars1.csv')
	);

// const stream = fs.createReadStream('cars.json', {bufferSize: 64 * 1024})
// let data = stream.pipe(process.stdout);
// console.log(stream);

scheduleGc ();



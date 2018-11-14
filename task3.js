const fs = require('fs');
// const bodyparser = require('body-parser');
const crypto = require('crypto');
// const jsonfile = require('jsonfile');
// const json2csv = require('json2csv');

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

const readFile = (fileName, type) => {
	return new Promise((res, rej) => {
		fs.readFile(fileName, type, (err, data) => {
			if (err) throw new err;
			let dataJSON = JSON.parse(data);
			console.log (dataJSON);
			res(dataJSON);
		});
	});
};

scheduleGc ();
readFile('cars.json', 'utf8');



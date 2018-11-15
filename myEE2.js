"use strict";
const EventEmitter = require('events');

class ValueChanger extends EventEmitter {

	constructor (name, isInc, min, max, winVal) {
		super ();
		this.name = name;
		this.isInc = isInc;
		this.min = min;
		this.max = max;
	    this.winVal = winVal;
	    this.opponent = {};

	    this.on('dataEvent', this.receiveData);
	    this.on('endProcess', this.onEnd);
  }

  //methods

  setOpp (opp) {
  	try {
  		this.opponent = opp;
  		// console.log (this.opponent);
    } catch (e) {
    	console.log (e);
    }
  }

  start (startValue) {
  	this.emit('dataEvent', startValue);
  }

  processData (data) {
  	return data + (Math.floor(Math.random() * (this.max - this.min)) + this.min) * (this.isInc ? 1 : -1);
  }

  receiveData (data) {
  	setImmediate(() => this.sendData(this.processData(data)));
  }

  sendData (data) {
  	console.log (`Random number ${data}`);
  	if ((this.isInc && data >= this.winVal) || (!this.isInc && data <= this.winVal)) {
    	this.emit('endProcess');
    };
    this.opponent.emit('dataEvent', data);
	}

  onEnd () {
	console.log(`${this.name} is winner`);
	this.removeAllListeners('dataEvent');
	this.opponent.removeAllListeners('dataEvent');
  }

}

// Let's go

const opp1 = new ValueChanger('Ping', false, 1, 160, 10);
const opp2 = new ValueChanger('Pong', true, 1, 160, 9);

opp1.setOpp(opp2);
opp2.setOpp(opp1);

opp1.start(10);
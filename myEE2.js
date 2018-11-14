"use strict";
const EventEmitter = require('events');

class ValueChanger extends EventEmitter {

	constructor (name, isInc, min, max) {
		super ();
		this.name = name;
		this.isInc = isInc;
		this.min = min;
		this.max = max;
	}
}
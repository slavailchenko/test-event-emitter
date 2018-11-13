class myEE {

	constructor() {
		this.listeners = new Map();
	}

	addListener (label, cb) {
		this.listeners.has(label) || this.listeners.set(label, []);
		this.listeners.get(label).push(cb);
		console.log (this.listeners);
	}

	removeListener (label, cb) {
		let listeners = this.listeners.get(label),
		index;
		
		let isFunction = function(obj) {
			return typeof obj == 'function' || false;
		};

		if (listeners && listeners.length) {
			index = listeners.reduce((i, listener, index) => {
				return (isFunction(listener) && listener === cb) ?
				i = index : i;
			}, -1);
          
          if (index > -1) {
          	listeners.splice(index, 1);
          	console.log (`${cb} from ${label} is now removed`);
          	this.listeners.set(label, listeners);
          	return true;
          }
      }
      console.log (`${cb} from ${label} is not founded`);
      return false;
  	}

  	emit(label, ...args) {
  		let listeners = this.listeners.get(label);

  		if (listeners && listeners.length) {
  			listeners.forEach((listener) => {
  				listener(...args); 
  			});
  			return true;
  		}
  		return false;
  	}

}

let events = new myEE ();
let cb1 = () => console.log ('Added event1 in Listener');
events.addListener ('Event 1', cb1);
let cb2 = () => console.log ('Added event2 in Listener');
events.addListener ('Event 1', cb2);
events.addListener ('Event 2', cb2);
events.removeListener ('Event 1', cb2);
events.removeListener ('Event 3', (() => console.log('Hello World')));
events.emit ('Event 1');
events.emit ('Event 2');

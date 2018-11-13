class myEE {

	constructor() {
		this.listeners = new Map();
		this.maxListeners = 3;
	}

	addListener (label, cb) {
		cb.listenerEvent = false;
		(this.listeners.has(label) || this.listeners.set(label, [])) && 
		(this.maxListeners > this.listenerCount(label)) ? 
		this.listeners.get(label).push(cb) || this.listeners.set(label, []) : 
		console.log(`Number of handlers exceeded`);
	}

	on (label, cb) {
		this.addListener(label, cb);
	}

	once (label, cb) {
		(this.listeners.has(label) || this.listeners.set(label, [])) && 
		(this.maxListeners > this.listenerCount(label)) ? 
		(cb.listenerEvent = true) && 
		(this.listeners.get(label).push(cb)) || this.listeners.set(label, []) : 
		console.log(`Number of handlers exceeded`);
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

  	removeAllListeners ([...labels]) {

  		for (let i=0; i<labels.length; i++) {
  			if (this.listeners.has(labels[i])) {
  				this.listeners.delete(labels[i]);
  				console.log (`Removed listeners from ${labels[i]}`);
  			} else {
  				console.log (`${labels[i]} not founded`);
  			}
  		}
	}

	eventNames() {
		let arr = [...this.listeners.keys()];
		console.log(`Array of events ${arr}`);
		return [...this.listeners.keys()];
     }

    listenersArr (label) {
        return this.listeners.get(label);
    }

    listenerCount(label) {
    	if (this.listenersArr(label)) return this.listenersArr(label).length
    		else return 0;
    }

    setMaxListeners(n) {
        this.maxListeners = n;
    }

    getMaxListeners() {
        return this.maxListeners;
    }

  	emit(label, ...args) {
  		let listeners = this.listeners.get(label);

  		if (listeners && listeners.length) {
  			listeners.forEach((listener) => {

  			if (listener.listenerEvent == true) {
  				this.removeListener (label, listener)	
  			};

  			listener(...args);
  		});
  			return true;
  		}
  		return false;
  	}

}

let events = new myEE ();
let cb1 = () => console.log ('Added cb1 in Listener');
events.addListener ('Event 1', cb1);
let cb2 = () => console.log ('Added cb2 in Listener');
let cb3 = () => console.log ('Added cb3 in Listener');
let cb4 = () => console.log ('Added cb4 in Listener');
events.addListener ('Event 1', cb2);
events.addListener ('Event 2', cb2);
events.addListener ('Event 2', cb3);
events.addListener ('Event 2', cb4);
events.addListener ('Event 2', cb1);
events.once ('Event 3', cb3);
events.addListener ('Event 3', cb1);
events.removeAllListeners(['Event 4', 'Event 5']);
events.removeListener ('Event 1', cb2);
events.removeListener ('Event 3', (() => console.log('Hello World')));
events.eventNames();
events.emit ('Event 1');
events.emit ('Event 2');
events.emit ('Event 3');
events.listenersArr ('Event 3');
events.emit ('Event 2');
events.emit ('Event 3');
events.listenersArr ('Event 3');
events.listenerCount ('Event 3');
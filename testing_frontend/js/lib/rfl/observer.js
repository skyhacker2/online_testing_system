define(function(require) {
	var Observer = function () {
		this._subscribers = [];
	};
	
	Observer.prototype = {
		subscribe: function(subscriber) {
			for(var i = 0, l = this._subscribers.length; i < l; i++) {
				if(subscriber == this._subscribers[i]) {
					return null;
				}
			}
			this._subscribers.push(subscriber);
			return subscriber;
		},
		
		remove: function(subscriber) {
			var res = [];
			if(subscriber) {
				for(var i = this._subscribers.length - 1; i >= 0; i--) {
					if(subscriber == this._subscribers[i]) {
						res = res.concat(this._subscribers.splice(i, 1));
					}
				}
			} else {
				res = this._subscribers;
				this._subscribers = [];
			}
			return res;
		},
		
		dispatch: function(e) {
			var res, tmp, subscriber;
			for(var i = this._subscribers.length - 1; i >= 0; i--) {
				subscriber = this._subscribers[i];
				if(!subscriber) {
					continue;
				}
				tmp = subscriber.call(null, e);
				res = tmp === false || res === false ? false : tmp;
			}
			return res;
		},
		
		constructor: Observer
	}
	
	return Observer;
});

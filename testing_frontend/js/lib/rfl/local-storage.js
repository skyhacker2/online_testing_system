define(function(require) {
	var _DB_NAME = 'RFL_LOCAL_STORAGE';
	var _PROXY = require.toUrl('./local-storage-proxy.html', true);
	
	var _db = {
		name: 'default',
		noProxy: true,
		db: {},

		set: function(key, val) {
			this.db[key] = val;
		},

		get: function(key) {
			return this.db[key];
		},

		remove: function(key) {
			delete this.db[key];
		},

		clear: function() {
			this.db = {};
		}
	};
	
	var _dbs = [
		{
			name: 'localStorage',
			isSupported: !!window.localStorage,
			
			set: function(key, val) {
				localStorage.setItem(key, val);
			},
			
			get: function(key) {
				return localStorage.getItem(key);
			},

			remove: function(key) {
				localStorage.removeItem(key);
			},

			clear: function() {
				localStorage.clear();
			},

			init: function() {}
		},

		{
			name: 'globalStorage',
			isSupported: !!window.globalStorage,
			db: null,

			set: function(key, val) {
				try {
					this.db.setItem(key, val);
					return 1;
				} catch(e) {
					return 0;
				}
			},
			
			get: function(key) {
				var res;
				try {
					res = this.db.getItem(key);
					res = res && res.value || res;
				} catch(e) {}
				return res;
			},

			remove: function(key) {
				try {
					db.removeItem(key);
				} catch(e) {}
			},

			clear: function() {
				try {
					for(var key in this.db) {
						this.db.removeItem(key);
					}
				} catch(e) {}
			},

			init: function() {
				this.db = globalStorage[document.domain];
			}
		},

		{
			name: 'userData',
			isSupported: !!window.ActiveXObject,
			db: null,
			
			set: function(key, val) {
				var expires = this.db.expires.toString();
				if(expires !== '' && expires.indexOf('1983') !== -1) {//fix for clear
					this.db.expires = new Date(+new Date() + 365 * 86400000).toUTCString();
				}
				try {
					this.db.setAttribute(key, val);
					this.db.save(_DB_NAME);
					return 1;
				} catch(e) {
					return 0;
				}
			},
			
			get: function(key) {
				this.db.load(_DB_NAME);
				return this.db.getAttribute(key);
			},

			remove: function(key) {
				this.db.removeAttribute(key);
				this.db.save(_DB_NAME);
			},

			clear: function() {
				this.db.expires = new Date(417628800000).toUTCString();//Sun, 27 Mar 1983 16:00:00 GMT
				this.db.save(_DB_NAME);
			},

			init: function() {
				this.db = document.documentElement || document.body;
				this.db.addBehavior('#default#userdata');
				this.db.load(_DB_NAME);
			}
		}
	];

	for(i = 0; i < _dbs.length; i++) {
		if(_dbs[i].isSupported) {
			_db = _dbs[i];
			_db.init();
			break;
		}
	}

	var _facade = {
		set: function(opts) {
			var res = _db.set(opts.key, opts.val, opts.life);
			if(opts.cb) {
				return opts.cb(res);
			} else {
				return res;
			}
		},

		get: function(opts) {
			var res;
			var keys = opts.key.split(' ');
			if(keys.length > 1) {
				res = {};
				$.each(keys, function(i, key) {
					res[key] = _db.get(key);
				});
			} else {
				res = _db.get(keys[0]);
			}
			if(opts.cb) {
				return opts.cb(res);
			} else {
				return res;
			}
		},

		remove: function(opts) {
			var keys = opts.key.split(' ');
			if(keys.length > 1) {
				$.each(keys, function(i, key) {
					_db.remove(key);
				});
			} else {
				_db.remove(keys[0]);
			}
			if(opts.cb) {
				opts.cb();
			}
		},

		clear: function(opts) {
			_db.clear();
			if(opts.cb) {
				opts.cb();
			}
		}
	};

	function _do(action, proxy, opts) {
		var frameId = 'yomLocalStorageProxy';
		var frame;
		opts = opts || {};
		if(proxy !== null && _db.name == 'cookie') {
			proxy = proxy || _PROXY;
		}
		if(proxy && !_db.noProxy) {
			frame = document.getElementById(frameId);
			if(frame) {
				frame._queue.push([action, opts]);
				if(frame._inited) {
					frame.contentWindow.localStorageProxyPull();
				}
			} else {
				proxy = typeof proxy == 'object' && proxy.src || _PROXY;
				frame = document.createElement('iframe');
				frame.id = frameId;
				frame.src = proxy;
				frame.style.display = 'none';
				frame._queue = [[action, opts]];
				$(frame).on('load', function() {
					if(!frame._loaded) {
						$.each(frame._queue, function(i, p) {
							if(p[1] && p[1].cb) {
								setTimeout(function() {
									p[1].cb(null, -1);
								}, 0);
							}
						});
					}
				});
				frame = document.body.appendChild(frame);
			}
			return undefined;
		}
		return _facade[action](opts);
	};

	function _getWithExpires(val, key, proxy) {
		var rmKeys = [];
		if(val && typeof val == 'object') {
			$.each(val, function(k, v) {
				val[k] = getOne(v, k);
			});
		} else {
			val = getOne(val, key);
		}
		if(rmKeys.length) {
			remove(rmKeys.join(' '), {proxy: proxy});
		}
		function getOne(val, key) {
			var m;
			if(val) {
				m = val.match(/(.*)\[expires=(\d+)\]$/);
				if(m) {
					if(m[2] < new Date().getTime()) {
						val = undefined;
						rmKeys.push(key);
					} else {
						val = m[1];
					}
				}
			} else {
				val = undefined;
			}
			return val;
		}
		return val;
	};

	function set(key, val, opts) {
		opts = opts || {};
		if(opts.life && _db.name != 'cookie') {//hour
			val = val + ('[expires=' + (new Date().getTime() + opts.life * 3600000) + ']');
		}
		return _do('set', opts.proxy, {key: key, val: val, cb: opts.callback, life: opts.life});
	};

	function get(key, opts) {
		var cb, res;
		opts = opts || {};
		if(opts.callback) {
			cb = function(res) {
				opts.callback(_getWithExpires(res, key, opts.proxy));
			}
			return _do('get', opts.proxy, {key: key, cb: cb});
		} else {
			res = _do('get', opts.proxy, {key: key});
			return _getWithExpires(res, key, opts.proxy);
		}
	};

	function remove(key, opts) {
		opts = opts || {};
		return _do('remove', opts.proxy, {key: key});
	};

	function clear(opts) {
		opts = opts || {};
		return _do('clear', opts.proxy, {});
	};

	return {
		_db: _db,
		_do: _do,
		set: set,
		get: get,
		remove: remove,
		clear: clear
	};
});

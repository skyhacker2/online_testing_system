define('./instance-manager', ['require', 'exports', 'module', 'jquery', './util'], function(require) {
	var $ = require('jquery');
	var util = require('./util');
		
	var InstanceManager = function() {
		this._init();
	};
	
	InstanceManager.prototype = {
		_init: function() {
			this._pool = [];
		},
		
		add: function(inst) {
			var id = util.getUniqueId();
			this._pool.push({id: id, inst: inst});
			return id;
		},
		
		get: function(id) {
			var res;
			$.each(this._pool, function(i, item) {
				if(item.id == id) {
					res = item.inst;
					return false;
				}
				return true;
			});
			return res;
		},
		
		remove: function(id) {
			var i, item;
			for(var i = this._pool.length - 1; i >= 0; i--) {
				item = this._pool[i];
				if(item.id == id) {
					this._pool.splice(i, 1);
					return item.inst;
				}
			}
		},
		
		count: function() {
			return this._pool.length;
		},
		
		each: function(cb, bind) {
			$.each(this._pool, function(i, item) {
				if(item) {
					return cb.call(bind, item.inst, item.id);
				}
				return true;
			});
		},
		
		clear: function() {
			this._init();
		},
		
		constructor: InstanceManager
	}
	
	return InstanceManager;
});


define('./delegator', ['require', 'exports', 'module', 'jquery', './array', './util', './instance-manager'], function(require) {
	var $ = require('jquery');
	var array = require('./array');
	var util = require('./util');
	var InstanceManager = require('./instance-manager');
	
	var _im = new InstanceManager();
	
	/**
	 * @class
	 */
	function Delegator(ele, opt) {
		opt = opt || {};
		this._ele = $(ele);
		this._delegatedTypes = {};
		this._handlers = {};
		this._anonymousHandlers = {};
		this._eventHook = opt.eventHook;
		this._id = _im.add(this);
		this._ele.data('rfl-delegator-id', this._id);
	};
	
	Delegator._im = _im;
	
	Delegator.getDelegator = function(ele) {
		ele = $(ele);
		var delegator = _im.get(ele.data('rfl-delegator-id'));
		if(!delegator) {
			delegator = new Delegator(ele);
		}
		return delegator;
	};
	
	Delegator.getPageDelegator = function() {
		return Delegator.getDelegator(document.body);
	};
	
	Delegator.prototype = {
		_delegateEvent: function(type, maxBubble) {
			var that = this;
			var flag = this._delegatedTypes[type];
			if(flag) {
				flag.maxBubble = Math.max(flag.maxBubble, maxBubble);
				return;
			} else {
				var listener = function() {
					return that._eventListener.apply(that, array.getArray(arguments));
				};
				this._ele.on(type, listener);
				this._handlers[type] = {};
				this._anonymousHandlers[type] = [];
				this._delegatedTypes[type] = {maxBubble: maxBubble, listener: listener};
			}
		},
		
		_eventListener: function(evt) {
			var target, $target, type, flag, handler, maxBubble, bubbleTimes, cancelBubbleEl;
			var root = this._ele.get(0);
			target = evt.target;
			type = evt.type.toLowerCase();
			if(this._eventHook && this._eventHook(target, evt, type) === false) {
				return;
			}
			maxBubble = this._delegatedTypes[type].maxBubble;
			bubbleTimes = 0;
			while(target && target != root) {
				$target = $(target);
				if(new RegExp('(^|\\s+)' + type + '(\\s+|$)').test($target.data('rfl-cancel-bubble'))) {
					return;
				}
				if(target.disabled || $target.attr('disabled')) {
					break;
				}
				flag = $target.data('rfl-' + type);
				if(flag) {
					flag = flag.split(' ');
					handler = this._handlers[type][flag.shift()];
					flag.unshift(evt);
					if(handler && handler.apply(target, flag) === false) {
						break;
					}
				}
				if(bubbleTimes >= maxBubble) {
					break;
				}
				target = target.parentNode;
				bubbleTimes++;
			}
			if(this._anonymousHandlers[type]) {
				if($target) {
					cancelBubbleEl = $target.closest('[data-rfl-cancel-bubble]')[0];
					if(cancelBubbleEl && $.contains(root, cancelBubbleEl) && new RegExp('(^|\\s+)' + type + '(\\s+|$)').test($(cancelBubbleEl).data('rfl-cancel-bubble'))) {
						return;
					}
				}
				$.each(this._anonymousHandlers[type], function(i, handler) {
					handler.call(evt.target, evt);
				});
			}
		},
		
		getId: function() {
			return this._id;
		},
		
		delegate: function(type, handlerName, handler, opt) {
			var hasSameAnonymous = false;
			var maxBubble;
			if(typeof opt == 'number') {
				maxBubble = opt;
				opt = {};
			} else {
				opt = opt || {};
				maxBubble = opt.maxBubble || 0;
			}
			type = type.toLowerCase();
			this._delegateEvent(type, maxBubble);
			this._handlers[type][handlerName] = handler;
			return this;
		},
		
		delegateAnonymous: function(type, handler) {
			var hasSameAnonymous = false;
			type = type.toLowerCase();
			this._delegateEvent(type, 0);
			$.each(this._anonymousHandlers[type], function(h) {
				if(handler == h) {
					hasSameAnonymous = true;
					return false;
				}
			})
			if(!hasSameAnonymous) {
				this._anonymousHandlers[type].push(handler);
			}
			return this;
		},
		
		remove: function(type, handlerName) {
			if(!this._delegatedTypes[type]) {
				return this;
			}
			if(handlerName) {
				delete this._handlers[type][handlerName];
			} else {
				this._ele.off(type, this._delegatedTypes[type].listener);
				delete this._handlers[type];
				delete this._anonymousHandlers[type];
				delete this._delegatedTypes[type];
			}
			return this;
		},

		removeAnonymous: function(type, handler) {
			var that = this;
			if(!this._delegatedTypes[type]) {
				return this;
			}
			if(handler) {
				if(this._anonymousHandlers[type]) {
					$.each(this._anonymousHandlers[type], function(i, h) {
						if(h == handler) {
							that._anonymousHandlers[type].splice(i, 1);
							return false;
						}
					});
				}
			} else {
				delete this._anonymousHandlers[type];
			}
			return this;
		},
		
		destroy: function() {
			for(var type in this._delegatedTypes) {
				this.remove(type);
			}
			_im.remove(this.getId());
		},
		
		constructor: Delegator
	}
	
	return Delegator;
});


define("./dialog.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
    function $encodeHtml(str) {
        return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    }
    exports.render = function($data, $opt) {
        $data = $data || {};
        var _$out_ = [];
        var $print = function(str) {
            _$out_.push(str);
        };
        (function() {
            with ($data) {
                _$out_.push('<div class="modal ', fade ? "fade" : "", '" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content">');
                if (title) {
                    _$out_.push('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">', title || "", "</h4></div>");
                }
                _$out_.push('<div class="modal-body">', content, "</div>");
                if (btns) {
                    _$out_.push('<div class="modal-footer">', btns, "</div>");
                }
                _$out_.push("</div></div></div>");
            }
        })();
        return _$out_.join("");
    };
});

define('./observer', ['require', 'exports', 'module'], function(require) {
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


define('./alerts', ['require', 'exports', 'module', 'jquery', 'lang/' + G.LANG + '/common'], function(require) {
	var $ = require('jquery');
	var langResourceCommon = require('lang/' + G.LANG + '/common');
	
	var _container;
	var _alertObj;
	
	var alerts = {};
	
	alerts.show = function(content, opt, timeout) {
		var type;
		if(_alertObj) {
			_alertObj.alert('close');
		}
		if(typeof opt == 'string') {
			type = opt;
			opt = {};
		} else {
			opt = opt || {};
			type = opt.type;
		}
		timeout = timeout || opt.timeout;
		type = ({
			info: 'info',
			success: 'success',
			error: 'danger'
		})[type];
		var block = opt.block;
		var btns = opt.btns;
		var btnsHtml = [];
		if(btns && btns.length) {
			block = true;
			$.each(btns, function(i, btn) {
				btnsHtml.push([
					'<button class="btn ', btn.className || 'btn-default', '" ',
					btn.dismiss ? 'data-dismiss="alert">' : '>',
					btn.text,
					'</button>'
				].join(''));
			});
		}
		content = [
			'<div class="alert' + (type ? ' alert-' + type : ' alert-warning') + (block ? ' alert-block' : '') + '" style="display: none;">',
				opt.noCloseBtn ? '' : '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>',
				content,
				btnsHtml.length ? '<p class="btns-container" data-type="btns-container">' + btnsHtml.join(' ') + '</p>' : '',
			'</div>'
		].join('');
		var alertObj;
		if(opt.container) {
			alertObj = $(content).appendTo($(opt.container)).fadeIn();
		} else {
			if(!_container) {
				_container = $('.alerts-container');
				if(!_container.length) {
					_container = $('<div class="alerts-container"></div>').appendTo(document.body);
				}
			}
			alertObj = $(content).appendTo(_container).fadeIn();
		}
		if(btns && btns.length) {
			alertObj.find('[data-type="btns-container"] button').each(function(i, btnEl) {
				if(i === 0) {
					btnEl.focus();
				}
				if(btns[i] && btns[i].click) {
					$(btnEl).on('click', btns[i].click);
				}
			});
		}
		alertObj.on('closed.bs.alert', function() {
			if(btns && btns.length) {
				alertObj.find('[data-type="btns-container"] button').each(function(i, btnEl) {
					if(btns[i] && btns[i].click) {
						$(btnEl).off('click', btns[i].click);
					}
				});
			}
			alertObj.remove();
		});
		if(timeout !== 0) {
			setTimeout(function() {
				alertObj.alert('close');
			}, timeout || 10000);
		}
		_alertObj = alertObj;
		return alertObj;
	};
	
	alerts.confirm = function(content, callback, opt) {
		opt = opt || {};
		if(opt.makeSure) {
			content = content + '<div class="section-sm"><label class="mockup-checkbox-label"><label class="mockup-checkbox"><input type="checkbox" data-rfl-type="confirm-make-sure" /><span><i class="icon-ok"></i></span></label><span>' + langResourceCommon.label.iAmSure + '</span></label></div>';
		}
		var btnClassName = ({
			info: 'info',
			success: 'success',
			error: 'danger'
		})[opt.type] || 'warning';
		var alertObj = alerts.show(content, $.extend(opt, {
			type: opt.type,
			noCloseBtn: true,
			btns: [
				{
					text: langResourceCommon.label.ok,
					className: 'btn-' + btnClassName,
					click: function() {
						var makeSure = $('[data-rfl-type="confirm-make-sure"]', alertObj)[0];
						if(!makeSure || makeSure.checked) {
							alertObj.alert('close');
							callback();
						} else if(makeSure) {
							$(makeSure).closest('.mockup-checkbox-label').animate({opacity: '0.5'}, 100).animate({opacity: '1'}, 100).animate({opacity: '0.5'}, 100).animate({opacity: '1'}, 100);
						}
					}
				},
				{
					text: langResourceCommon.label.cancel,
					dismiss: true,
					click: function() {
						opt.cancelCallback && opt.cancelCallback();
					}
				}
			],
			timeout: 0
		}));
	};
	
	return alerts;
});

define('./events', ['require', 'exports', 'module', './observer'], function(require) {
	var Observer = require('./observer');
	
	var events = {};

	events._addObservers = function(observerNames) {
		var self = this;
		this.__observers = this.__observers || {};
		$.each(observerNames, function(i, name) {
			self.__observers[name] = new Observer();
		});
	};

	events._dispatchEvent = function(type, evt) {
		var observer = this.__observers && this.__observers[type];
		if(observer) {
			return observer.dispatch(evt);
		}
		return true
	};

	events.on = function(type, handler) {
		var observer = this.__observers && this.__observers[type];
		if(!observer) {
			return null;
		}
		return observer.subscribe(handler);
	};

	events.off = function(type, handler) {
		var observer = this.__observers && this.__observers[type];
		if(!observer) {
			return null;
		}
		return observer.remove(handler);
	};
	
	return events;
});


define('./login', ['require', 'exports', 'module', 'jquery', './cookie', './util', './alerts', './ajax'], function(require) {
	var $ = require('jquery');
	var cookie = require('./cookie');
	var util = require('./util');
	var alerts = require('./alerts');
	
	var login = {};
	
	login.getSid = function() {
		return cookie.get('JSESSIONID');
	};
	
	login.validate = function() {
		return login.getSid() && true;
	};
	
	login.gotoLoginPage = function(jumpUrl) {
		if((/\/login\/login\-/).test(location.pathname)) {
			return;
		}
		var G = top.G;
		var url = [G.ORIGIN, G.BASE, 'html/login/login-', G.LANG, '.html'].join('');
		jumpUrl = typeof jumpUrl != 'undefined' ? jumpUrl : top.location.href;
		if(url != util.getOrigin() + location.pathname) {
			top.location.href = [url, jumpUrl ? '?jump=' + encodeURIComponent(jumpUrl) : ''].join('');
		}
	};
	
	login.logout = function() {
		require('./ajax').post({
			queueName: 'logout',
			url: 'j_spring_security_logout',
			data: {},
			success: function(res) {
				if(res.code === 0) {
					login.gotoLoginPage();
				} else {
					alerts.show({content: res.message, type: 'error'});
				}
			},
			error: function() {
				alerts.show({content: langResourceCommon.msg.serverBusy, type: 'error'});
			}
		});
	};
	
	return login;
});

define('./ajax', ['require', 'exports', 'module', 'jquery', './config', './alerts', './history', './json', './util', './events', 'lang/' + G.LANG + '/common', './login'], function(require) {
	var $ = require('jquery');
	var config = require('./config');
	var alerts = require('./alerts');
	var history = require('./history');
	var json = require('./json');
	var util = require('./util');
	var events = require('./events');
	var langResourceCommon = require('lang/' + G.LANG + '/common');

	var _PROXY_PATH = ('{{CGI_BASE}}static/js/lib/rfl/ajax-proxy.html').replace('{{CGI_BASE}}', G.CGI_BASE);
	
	var _postQueue = {};
	var _proxyQueue = [];
	var _proxyFrame = null;
	
	var ajax = {};
	
	/**
	 * cross domain proxy
	 * @param {Object} opt  
	 */
	function _proxyCall(opt) {
		var xhr;
		var complete = opt.complete;
		opt.complete = function() {
			opt.loading === false || ajax.hideLoading();
			complete && complete();
		};
		if(opt.getXhr) {
			try {
				xhr = new _proxyFrame.contentWindow.XMLHttpRequest()
			} catch(e) {
				xhr = new _proxyFrame.contentWindow.ActiveXObject('MSXML2.XMLHTTP')
			}
			opt.getXhr(xhr);
		} else {
			opt.loading === false || ajax.showLoading();
			_proxyFrame.contentWindow.require(['rfl'], function(rfl) {
				if(opt.type == 'GET') {
					rfl.ajax.get(opt);
				} else {
					rfl.ajax.post(opt);
				}
			}, function() {
				opt.loading === false || ajax.hideLoading();
			});
		}
	};
	
	/**
	 * cross domain proxy
	 * @param {Object} opt  
	 */
	function _proxy(opt) {
		if(!_proxyFrame) {
			opt.urlObj = opt.urlObj || util.url2obj(opt.url);
			_proxyFrame = document.createElement('iframe');
			_proxyFrame.style.display = 'none';
			_proxyFrame.src = opt.urlObj.origin + _PROXY_PATH;
			$(_proxyFrame).on('load', function onload(evt) {
				if(_proxyFrame._loaded) {
					while(_proxyQueue.length) {
						_proxyCall(_proxyQueue.shift());
					}
				} else {
					$(_proxyFrame).off('load', onload).remove();
					_proxyFrame = null;
					while(_proxyQueue.length) {
						opt = _proxyQueue.shift();
						opt.error && opt.error();
						opt.complete && opt.complete();
					}
				}
			});
			_proxyFrame = document.body.appendChild(_proxyFrame);
		}
		if(_proxyFrame._loaded) {
			_proxyCall(opt);
		} else {
			_proxyQueue.push(opt);
		}
	};
	
	/**
	 * returns the full url according to backend service name and data type
	 * @private
	 * @param {String} url 
	 * @param {String} dataType 
	 * @returns {String} the full url
	 */
	ajax.getDataTypeUrl = function(url, dataType) {
		if(!(/^https?:/).test(url)) {
			url = G.CGI_ORIGIN + G.CGI_BASE + url;
		}
		return url.replace(/[^\/]+$/, function(m) {
			return m.replace(/^[\w\-\.]+/, function(m) {
				return m.split('.')[0] + '.' + dataType;
			});
		});
	};
	
	/**
	 * show the loading icon
	 */
	ajax.showLoading = function() {
		if(!document.getElementById('ajax-loading')) {
			$('<div id="ajax-loading" class="ajax-loading"></div>').appendTo(document.body);
		}
		$('#ajax-loading').show();
	};
	
	/**
	 * hide the loading icon
	 */
	ajax.hideLoading = function() {
		$('#ajax-loading').hide();
	};
	
	/**
	 * take action to some common code
	 * @param {Number} code 
	 * @returns {Boolean} whether common code has been dealt
	 */
	ajax.dealCommonCode = function(code) {
		var res = true;
		if(code === config.RES_CODE.NEED_LOGIN && !(/\/login\/login\-/).test(location.pathname)) {
			require('./login').gotoLoginPage();
		} else {
			res = false;
		}
		return res;
	};
	
	/**
	 * ajax get wrapper for jquery ajax
	 * @param {Object} opt  
	 */
	ajax.get = function(opt) {
		var jqXHR, success;
		opt = opt || {};
		opt.type = opt._method = 'GET';
		opt.headers = opt.headers || {};
		opt.headers['X-Requested-With'] = 'XMLHttpRequest';
		success = opt.success;
		opt.success = function(res, textStatus, jqXHR) {
			if(!ajax.dealCommonCode(res.code) && success) {
				success(res, textStatus, jqXHR);
			}
		}
		opt.url = ajax.getDataTypeUrl(opt.url, 'json');
		opt.urlObj = util.url2obj(opt.url);
		if(G.ORIGIN != opt.urlObj.origin && opt.dataType == 'json') {
			_proxy(opt);
			return;
		} else {
			opt.dataType = opt.dataType || (G.ORIGIN == opt.urlObj.origin ? 'json' : 'jsonp');
			if(opt.dataType == 'jsonp') {
				opt.url = ajax.getDataTypeUrl(opt.url, 'jsonp');
				opt.urlObj = util.url2obj(opt.url);
				opt.scriptCharset = opt.scriptCharset || opt.charset || 'UTF-8';
				if(!opt.jsonpCallback) {
					opt.url.split('/').pop().replace(/^[a-zA-Z_]\w*/, function(m) {
						opt.jsonpCallback = m;
					});
					opt.jsonpCallback = opt.jsonpCallback || 'jsonpCallback';
				}
				opt.jsonp = opt.jsonp || 'callback';
			}
		}
		jqXHR = $.ajax(opt);
		opt.loading === false || ajax.showLoading();
		jqXHR.always(function() {
			opt.loading === false || ajax.hideLoading();
		});
	};
	
	/**
	 * ajax post wrapper for jquery ajax
	 * @param {Object} opt  
	 */
	ajax.post = function(opt) {
		var jqXHR, success, data;
		opt = opt || {};
		opt.type = opt._method = opt._method || 'POST';
		opt.dataType = 'json';
		opt.url = ajax.getDataTypeUrl(opt.url, opt.dataType);
		opt.urlObj = util.url2obj(opt.url);
		if(G.ORIGIN != opt.urlObj.origin) {
			_proxy(opt);
			return;
		}
		data = opt.data || {};
		opt.charset = opt.charset || 'UTF-8';
		opt.headers = opt.headers || {};
		opt.headers['X-Requested-With'] = 'XMLHttpRequest';
		if(!opt.notJsonParamData) {
			opt.contentType = 'application/json; charset=' + opt.charset;
			opt.data = typeof data == 'string' ? data : json.stringify(data);
		}
		success = opt.success;
		opt.success = function(res, textStatus, jqXHR) {
			if(!ajax.dealCommonCode(res.code) && success) {
				success(res, textStatus, jqXHR);
			}
		}
		if(opt.queueName) {
			if(_postQueue[opt.queueName]) {
				return;
			}
			_postQueue[opt.queueName] = true;
		}
		//for prototype
		if(G.IS_PROTOTYPE) {
			opt.type = 'POST';
			opt.url = util.appendQueryString(opt.url, {_method: (opt._method || 'POST').toLowerCase()});
		}
		jqXHR = $.ajax(opt);
		opt.loading === false || ajax.showLoading();
		jqXHR.always(function() {
			if(opt.queueName) {
				_postQueue[opt.queueName] = false;
			};
			opt.loading === false || ajax.hideLoading();
		});
	};
	
	/**
	 * ajax put wrapper for jquery ajax
	 * @param {Object} opt  
	 */
	ajax.put = function(opt) {
		opt = opt || {};
		opt._method = 'PUT';
		ajax.post(opt);
	};
	
	/**
	 * ajax delete wrapper for jquery ajax
	 * @param {Object} opt  
	 */
	ajax.del = function(opt) {
		opt = opt || {};
		opt._method = 'DELETE';
		ajax.post(opt);
	};
	
	/**
	 * get FileUploader options
	 * @param {String} url  
	 * @param {String} dataType  
	 */
	ajax.getUploadOpt = function(url, dataType, callback) {
		url = ajax.getDataTypeUrl(url, dataType);
		if(G.ORIGIN == G.CGI_ORIGIN) {
			callback({
				url: url
			});
		} else {
			callback({
				url: url,
				data: {domain: G.DOMAIN || ''},
				xhrGetter: function(getXhr) {
					_proxy({
						url: url,
						getXhr: getXhr,
						error: function() {
							alerts.show(langResourceCommon.msg.serverBusy, 'error');
						}
					});
				}
			});
		}
	};
	
	/**
	 * ajax history support
	 * @namespace
	 */
	ajax.history = (function() {
		var _markRegExp = /^#!\/?/;
		var _handlers = {};
		var _fallbackHandler;

		function _getDefaultHandlers(count, callback) {
			var res = {};
			var i, key, tmp;
			count = parseInt(count);
			if(!(count > 0)) {
				return res;
			}
			for(i = 1; i <= count; i++) {
				tmp = [];
				for(j = 0; j < i; j++) {
					tmp.push('([^/]*)');
				}
				key = '^' + tmp.join('/') + (i == count ? '' : '$');
				res[key] = callback;
			}
			return res;
		};
		
		function setHandler(key, handler) {
			_handlers[key] = handler;
		};
		
		function setMark(mark, title) {
			mark && history.setMark(mark, title);
		};
		
		function getMark() {
			return history.getMark();
		};
		
		function dispatch(mark) {
			var m, h;
			if(typeof mark == 'function') {
				h = mark;
				mark = getMark();
			}
			$.each(_handlers, function(key, handler) {
				m = mark.match(new RegExp(key));
				if(m) {
					m[0] = mark;
					h = h || handler;
					return false;
				}
				return true;
			});
			m = m || [mark];
			h = h || _fallbackHandler;
			if(h && h.apply(null, m) !== false) {
				setMark(mark);
			}
		};

		function _init(handlers, fallbackHandler) {
			if(typeof handlers == 'function') {
				_fallbackHandler = handlers;
			} else if(typeof handlers == 'number' & handlers > 0 && typeof fallbackHandler == 'function') {
				_handlers = _getDefaultHandlers(handlers, fallbackHandler);
				_fallbackHandler = fallbackHandler;
			} else if(typeof handlers == 'object' && handlers) {
				_handlers = handlers;
				if(typeof fallbackHandler == 'function') {
					_fallbackHandler = fallbackHandler;
				}
			}
			history.setListener(function(mark) {
				var res = ajax.history._dispatchEvent('change', {
					fromMark: history.getPrevMark() || '',
					toMark: mark
				});
				res === false || dispatch(mark);
			});
			history.init();
			_init = function() {};
		};
		
		function init(handlers, fallbackHandler) {
			_init(handlers, fallbackHandler);
		};
		
		var ajaxHistory = $.extend({
			setHandler: setHandler,
			setMark: setMark,
			getMark: getMark,
			dispatch: dispatch,
			init: init
		}, events);

		ajaxHistory._addObservers(['change']);

		return ajaxHistory;
	})();
	
	return ajax;
});


define("./confirm.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
    function $encodeHtml(str) {
        return (str + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/`/g, "&#96;").replace(/'/g, "&#39;").replace(/"/g, "&quot;");
    }
    exports.render = function($data, $opt) {
        $data = $data || {};
        var _$out_ = [];
        var $print = function(str) {
            _$out_.push(str);
        };
        (function() {
            with ($data) {
                if (typeof body !== "undefined") {
                    _$out_.push('<div style="border-bottom: 1px solid #000000;">', body, "</div>");
                }
                _$out_.push('<div class="form-group" style="margin-top: 20px;"><label>', message, '</label><input type="text" id="confirm-input" /><span class="help-inline"></span></div>');
            }
        })();
        return _$out_.join("");
    };
});

define('./auth', ['require', 'exports', 'module', './ajax', './alerts'], function(require) {
	var ajax = require('./ajax');
	var alerts = require('./alerts');
	var langResourceCommon = require('../../lang/' + G.LANG + '/common');
	
	var _data;
	var _hasPerm = {};
	
	var auth = {};
	
	auth.init = function(data, callback) {
		if(!ajax.dealCommonCode(data.code)) {
			if(data.code === 0) {
				_data = data.data;
				$.each(_data.authorities, function(i, k) {
					_hasPerm[k] = 1;
				});
				G["ROLE"] = _data.role;
				callback && callback();
			} else {
				alerts.show(data.message, 'error');
			}
		}
	};

	auth.getData = function(type) {
		if(type) {
			return _data[type];
		} else {
			return _data;
		}
	};
	
	auth.hasPerm = function(perm) {
		return true;
		return !!_hasPerm[perm];
	};

	auth.canAccessGroup = function(groupId) {
		var currentGroup = auth.getData('currentGroup');
		return currentGroup.superGroup || groupId == currentGroup.id;
	};

	auth.checkAndWarn = function(perm, checkGroup, groupId) {
		if(perm && !auth.hasPerm(perm) || checkGroup && !auth.canAccessGroup(groupId)) {
			alerts.show(langResourceCommon.msg.noPerm, {type: 'error', timeout: 0});
			return false;
		}
		return true;
	};
	
	return auth;
});

define('./dialog', ['require', 'exports', 'module', 'jquery', './dialog.tpl.html', './util'], function(require) {
	var $ = require('jquery');
	var dialogTpl = require('./dialog.tpl.html');
	var dialog = {};
	
	dialog.create = function(opt) {
		opt = opt || {};
		var hidden = false;
		var btnsHtml = [];
		var btns = opt.btns;
		opt.backdrop = typeof opt.backdrop != 'undefined' ? opt.backdrop : 'static';
		opt.fade = typeof opt.fade != 'undefined' ? opt.fade : true;
		if(btns && btns.length) {
			$.each(btns, function(i, btn) {
				btnsHtml.push([
					'<button class="btn ', btn.className || 'btn-default', '" ',
					btn.dismiss ? 'data-dismiss="modal">' : '>',
					btn.text,
					'</button>'
				].join(''));
			});
		}
		var dialogObj = $(dialogTpl.render({
			fade: opt.fade,
			title: opt.title,
			content: opt.content,
			btns: btnsHtml.join('')
		})).on('hide.bs.modal', function() {
			hidden = true;
		}).on('hidden.bs.modal', function(evt) {
			$(document.body).removeClass('modal-shown');
			if(btns && btns.length) {
				dialogObj.find('.modal-footer button').each(function(i, btnEl) {
					if(btns[i] && btns[i].click) {
						$(btnEl).off('click', btns[i].click);
					}
				});
			}
			dialogObj.remove();
			$(document.body).css('padding-right', 0);
			$('.app-top-bar').css('margin-right', 0);
		}).on('show.bs.modal', function() {
			if ($(document.body).hasClass('modal-shown')) {
				return;
			}
			$(document.body).addClass('modal-shown');
			if (document.body.clientHeight < window.innerHeight) {
				return;
			}
			var scrollbarWidth = require('./util').getScrollBarWidth();
			if (scrollbarWidth){
		  		$(document.body).css('padding-right', scrollbarWidth);
		    	$('.app-top-bar').css('margin-right', scrollbarWidth);
		  	}
		}).on('shown.bs.modal', function() {
			var focusEl = dialogObj.find(opt.focus || 'input:visible, textarea:visible')[0];
			try {
				focusEl && focusEl.focus();
			} catch(e) {}
		});
		dialogObj.modal(opt);
		if(!hidden && btns && btns.length) {
			dialogObj.find('.modal-footer button').each(function(i, btnEl) {
				if(btns[i] && btns[i].click) {
					$(btnEl).on('click', btns[i].click);
				}
			});
		}
		return dialogObj;
	};
	
	return dialog;
});

define('./config', ['require', 'exports', 'module'], function(require) {
	return {
		debug: location.href.indexOf('yom-debug=1') > 0,

		RES_CODE: {
			RESOURCE_NOT_EXIST: 2,
			NEED_LOGIN: 10
		},

		MAX_LENGTH: {
			NAME: 80
		},

		CAMPAIGN_CONTENT_EDITOR: {
			CKEDITOR: 1,
			DESIGNER: 2
		},

		CAMPAIGN_NAVIGATORS: [
			'${LINK@FORWARD}',
			'${LINK@VIEW_MESSAGE}',
			'${LINK@UNSUBSCRIBE}'
		],

		BASIC_PROPERTY_TYPE: {
			'EMAIL': 1,
			'MOBILE': 1,
			'FIRSTNAME': 1,
			'LASTNAME': 1,
			'MANGGISID': 1,
			'EXTERNALID': 1
		},

		CONTACT_PROPERTY_TYPE: {
			'EMAIL': 1,
			'MOBILE': 1
		},

		ID_PROPERTY_TYPE: {
			'MANGGISID': 1,
			'EXTERNALID': 1
		}
	};
});

define('./array', ['require', 'exports', 'module', 'jquery'], function(require) {
	var $ = require('jquery');
	
	var array = {};

	array.isArray = Array.isArray || function(obj) {
		return Object.prototype.toString.call(obj) == '[object Array]';
	};
	
	array.getArray = function(arr) {
		return Array.prototype.slice.call(arr);
	};
	
	array.difference = function(arr1, arr2, fun) {
		var res = [];
		$.each(arr1, function(i, item1) {
			var same = false;
			$.each(arr2, function(j, item2) {
				if(item1 === item2 || fun && !fun(item1, item2)) {
					same = true;
					return false;
				}
				return true;
			});
			if(!same) {
				res.push(item1);
			}
		});
		return res;
	};
	
	return array;
});

define('./json', ['require', 'exports', 'module', 'jquery', './array'], function(require) {
	var $ = require('jquery');
	var array = require('./array');
	
	var _escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var _meta = {
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};
	
	function _quote(str) {
		_escapable.lastIndex = 0;
		return _escapable.test(str) ? '"' + str.replace(_escapable, function(c) {
			return _meta[c] || '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + str + '"';
	};
	
	return {
		parse: function(str) {
			return typeof JSON != 'undefined' ? JSON.parse(str) : eval('(' + str + ')');
		},
		
		stringify: function(obj, prettify, objIndentLevel) {
			if(typeof JSON != 'undefined') {
				return JSON.stringify(obj);
			}
			var self = this;
			var res, tmp, indent, newLine, colon, comma;
			if(prettify) {
				objIndentLevel = objIndentLevel || 1;
				newLine = '\n';
				colon = ': ';
				comma = ', ';
			} else {
				objIndentLevel = 0;
				newLine = '';
				colon = ':';
				comma = ',';
			}
			switch(typeof obj) {
			case 'string':
				res = _quote(obj);
				break;
			case 'boolean':
				res = obj.toString();
				break;
			case 'number':
				if(isNaN(obj)) {
					throw new Error('NaN not supported.');
				} else if(!isFinite(obj)) {
					throw new Error('Infinite number not supported.');
				} else {
					res = obj.toString();
				}
				break;
			case 'object':
				if(!obj) {
					res = 'null';
					break;
				}
				tmp = [];
				if(obj.__RFL_JSON_STRINGIFY_MARKED__) {
					throw new Error('rfl.json.stringify can not deal with circular reference.');
				}
				obj.__RFL_JSON_STRINGIFY_MARKED__ = 1;
				if(array.isArray(obj)) {
					$.each(obj, function(key, val) {
						var s = self.stringify(val, prettify, objIndentLevel);
						s && tmp.push(s);
					})
					res = '[' + tmp.join(comma) + ']';
				} else {
					indent = [];
					for(var i = 0; i < objIndentLevel; i++) {
						indent.push('    ');
					}
					$.each(obj, function(key, val) {
						if(key == '__RFL_JSON_STRINGIFY_MARKED__') {
							return;
						}
						if(obj.hasOwnProperty(key)) {
							var s = self.stringify(val, prettify, objIndentLevel + 1);
							s && tmp.push(indent.join('') + _quote(key) + colon + s);
						}
					})
					indent.pop();
					if(tmp.length) {
						res = '{' + newLine + tmp.join(comma + newLine) + newLine + indent.join('') + '}';
					} else {
						res = '{}';
					}
				}
				delete obj.__RFL_JSON_STRINGIFY_MARKED__;
				break
			default:
				throw new Error(typeof obj + ' type not supported.');
			}
			return res;
		}
	}
});


define('./css', ['require', 'exports', 'module', 'jquery'], function(require) {
	var $ = require('jquery');
	
	var _linkCount = 0;
	var _hrefIdMap = {};
	
	function load(href, force) {
		var id, el;
		if($.isArray(href)) {
			id = [];
			$.each(href, function(i, item) {
				id.push(load(item, force));
			});
			return id;
		} else if(!(/^https?:|^\//).test(href)) {
			href = G.CDN_ORIGIN + G.CDN_BASE + href;
		}
		id = _hrefIdMap[href];
		el = $('#' + id)[0];
		if(id && el) {
			if(force) {
				unload(href);
			} else {
				return id;
			}
		}
		id = 'rfl-css-link-' + _linkCount++;
		el = $('<link id="' + id + '" rel="stylesheet" type="text/css" media="screen" href="' + href + '" />');
		$($(document.head || 'head').children()[0]).before(el);
		return _hrefIdMap[href] = id;
	};
	
	function unload(href) {
		var el;
		if($.isArray(href)) {
			el = [];
			$.each(href, function(i, item) {
				el.push(unload(item));
			});
			return el;
		} else if(!(/^https?:|^\//).test(href)) {
			href = G.CDN_ORIGIN + G.CDN_BASE + href;
		}
		el = $('#' + _hrefIdMap[href])[0];
		if(el) {
			delete _hrefIdMap[href];
			return el.parentNode.removeChild(el);
		}
		return null;
	};

	return {
		load: load,
		unload: unload
	};
});


define('./cookie', ['require', 'exports', 'module'], function(require) {
	var _DOMAIN = G.DOMAIN;
	
	return {
		set: function(name, value, domain, path, hour) {
			var expire;
			if(hour) {
				expire = new Date();
				expire.setTime(expire.getTime() + 3600000 * hour);
			}
			document.cookie = (name + '=' + value + '; ') + (expire ? ('expires=' + expire.toGMTString() + '; ') : '') + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || _DOMAIN) + ';');
		},
		
		get: function(name) {
			var r = new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'), m = document.cookie.match(r);
			return m && m[1] || '';
		},
		
		del: function(name, domain, path) {
			document.cookie = name + '=; expires=Mon, 26 Jul 1997 05:00:00 GMT; ' + ('path=' + (path || '/') + '; ') + ('domain=' + (domain || _DOMAIN) + ';');
		}
	}
});

define('./history', ['require', 'exports', 'module'], function(require) {
	var _INTERVAL = 100;
	
	var _ua = navigator.userAgent.toLowerCase();
	var _ieFrameSrc = require.toUrl('./history-blank.html', true);
	var _domain = document.domain;
	var _ieFrame = null;
	var _markCacheIndexHash = {};
	var _cache = [];
	var _cacheEnabled = true;
	var _cacheSize = 100;
	var _previousMark;
	var _currentMark;
	var _listener = null;
	var _listenerBind = null;
	var _isSupportHistoryState = false && !!history.pushState;
	var _isFrameNeeded = (/msie/).test(_ua) && !(/opera/).test(_ua) && (!document.documentMode || document.documentMode < 8);
	var _isSupportHashChange = !_isFrameNeeded && ('onhashchange' in window);
	
	function _updateCurrentMark(mark) {
		if(mark == _currentMark) {
			return;
		}
		_previousMark = _currentMark;
		_currentMark = mark;
		_isFrameNeeded && _setIeFrameSrc(mark);
	};
	
	function _checkMark() {
		if(!_isSupportHistoryState && !_isSupportHashChange) {
			setTimeout(arguments.callee, _INTERVAL);
		}
		var mark = getMark();
		if(mark == _currentMark || !_isValidMark(mark)) {
			return;
		}
		_updateCurrentMark(mark);
		_listener && _listener.call(_listenerBind, mark);
	};
	
	function _setCache(mark, data) {
		if(!_cacheEnabled) {
			return;
		}
		delete _cache[_markCacheIndexHash[mark]];
		_cache.push(data);
		_markCacheIndexHash[mark] = _cache.length - 1;
		delete _cache[_markCacheIndexHash[mark] - _cacheSize];
	};
	
	function _setIeFrameSrc(mark) {
		if(_ieFrame) {
			if(_ieFrame.contentWindow && _ieFrame.contentWindow.document) {
				var doc = _ieFrame.contentWindow.document;
				var markEl = doc.getElementById('mark');
				if(markEl && mark == markEl.value) {
					return;
				}
				doc.open();
				doc.write([
					'<html>',
						'<head><title>' + document.title + '</title></head>',
						'<body>',
							'<textarea id="mark">' + mark + '</textarea>',
							'<script type="text/javascript">',
								_domain ? 'document.domain = "' + _domain + '"' : '',
								'var mark = document.getElementById("mark").value',
								'if(mark || parent.location.hash) {',
									'parent.location.hash = "!" + mark',
								'}',
							'</s' + 'cript>',
						'</body>',
					'</html>'
				].join('\n'));
				doc.close();
			} else {
				setTimeout(function() {
					_setIeFrameSrc(mark);
				}, 100);
			}
		} else {
			var src = _domain ? _ieFrameSrc + '#' + mark : 'about:blank';
			_ieFrame = document.createElement('iframe');
			_ieFrame.src = src;
			_ieFrame.style.display = 'none';
			_ieFrame = document.body.appendChild(_ieFrame);
			_domain || _setIeFrameSrc(mark);
		}
	};
	
	function _isValidMark(mark) {
		return typeof mark == 'string' && !(/^[#!]/).test(mark);
	}
	
	//Public
	function init(opt) {
		opt = opt || {};
		_ieFrameSrc = opt.ieFrameSrc || _ieFrameSrc;
		_domain = opt.domain || _domain;
		_cacheEnabled = typeof opt.cacheEnabled != 'undefined' ? opt.cacheEnabled : _cacheEnabled;
		_cacheSize = opt.cacheSize || _cacheSize;
		if(_isSupportHistoryState) {
			$(window).on('popstate', _checkMark);
		} else if(_isSupportHashChange) {
			$(window).on('hashchange', _checkMark);
		}
		_checkMark();
		init = function() {};
	};
		
	function setListener(listener, bind) {
		_listener = typeof listener == 'function' ? listener : null;
		_listenerBind = bind || null;
	};
	
	function setCache(mark, data) {
		if(!_isValidMark(mark)) {
			return;
		}
		_setCache(mark, data);
	};
	
	function getCache(mark) {
		return _cache[_markCacheIndexHash[mark]];
	};
	
	function clearCache() {
		_markCacheIndexHash = {};
		_cache = [];
	};
	
	function setMark(mark, title, stateObj) {
		if(title) {
			document.title = title;
		}
		if(mark == _currentMark || !_isValidMark(mark)) {
			return;
		}
		_updateCurrentMark(mark);
		if(_isSupportHistoryState) {
			history.pushState(stateObj, title || document.title, '/' + mark);
		} else {
			location.hash = '!' + mark;
		}
	};
	
	function getMark() {
		if(_isSupportHistoryState) {
			return location.pathname.replace(/^\//, '');
		} else if((/^#!/).test(location.hash)) {
			return location.hash.replace(/^#!/, '');
		} else {
			return '';
		}
	};
	
	function getPrevMark() {
		return _previousMark;
	};
	
	function needFrame() {
		return _isFrameNeeded;
	};
	
	function isSupportHistoryState() {
		return _isSupportHistoryState;
	};
	
	return {
		init: init,
		setListener: setListener,
		setCache: setCache,
		getCache: getCache,
		clearCache: clearCache,
		setMark: setMark,
		getMark: getMark,
		getPrevMark: getPrevMark,
		needFrame: needFrame,
		isSupportHistoryState: isSupportHistoryState
	};
});


define('./local-storage', ['require', 'exports', 'module'], function(require) {
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


define('./page-storage', ['require', 'exports', 'module', 'jquery'], function(require) {
	var $ = require('jquery');

	var _pathname = location.pathname;
	var _data = {};

	function set(key, val) {
		if(typeof val == 'undefined') {
			val = key;
			key = _pathname;
		}
		if(val && typeof val == 'object') {
			_data[key] = $.extend(_data[key] || {}, val);
		} else {
			_data[key] = val;
		}
	};

	function del(key) {
		_data[typeof key == 'undefined' ? _pathname : key] = undefined;
	};

	function get(key) {
		return _data[typeof key == 'undefined' ? _pathname : key];
	};

	return {
		set: set,
		get: get
	};
});

define('./util', ['require', 'exports', 'module', 'jquery', './json', './local-storage', './confirm.tpl.html', './auth', './dialog'], function(require) {
	var $ = require('jquery');
	var json = require('./json');
	var localStorage = require('./local-storage');
	var confirmTpl = require('./confirm.tpl.html');
	var langResourceCommon = require('lang/' + G.LANG + '/common');
	
	var _uniqueIdCount = 0;
	
	var util = {};
	
	function _getUrl(url, param) {
		if(!(/^https?:/).test(url)) {
			url = G.ORIGIN + G.BASE + 'html/' + url.replace(/((?:#|\?).*$|$)/, '-' + G.LANG + '.html$1');
		}
		return util.appendQueryString(url, param);
	};

	util.url2obj = function(str) {
		if(typeof str != 'string') {
			return str;
		}
		var m = str.match(/([^:]*:)?(?:\/\/)?([^\/:]+)?(:)?(\d+)?([^?#]+)(\?[^?#]*)?(#[^#]*)?/);
		m = m || [];
		uri = {
			href: str,
			protocol: m[1] || 'http:',
			host: (m[2] || '') + (m[3] || '') + (m[4] || ''),
			hostname: m[2] || '',
			port: m[4] || '',
			pathname: m[5] || '',
			search: m[6] || '',
			hash: m[7] || ''
		};
		uri.origin = uri.protocol + '//' + uri.host;
		return uri;
	};

	util.cloneObject = function(obj, deep, _level) {
		var res = obj;
		deep = deep || 0;
		_level = _level || 0;
		if(_level > deep) {
			return res;
		}
		if(typeof obj == 'object' && obj) {
			if($.isArray(obj)) {
				res = [];
				$.each(obj, function(i, item) {
					res.push(item);
				})
			} else {
				res = {};
				for(var p in obj) {
					if(Object.prototype.hasOwnProperty.call(obj, p)) {
						res[p] = deep ? util.cloneObject(obj[p], deep, ++_level) : obj[p];
					}
				}
			}
		}
		return res;
	};
	
	util.getUniqueId = function() {
		return 'RFL_UNIQUE_ID_' + _uniqueIdCount++;
	};
	
	util.getOrigin = function(loc) {
		loc = loc || window.location;
		return loc.origin || [
			loc.protocol, '//', loc.host
		].join('');
	};

	util.getByteLength = function(str) {
		return str.replace(/[^\x00-\xff]/g, 'xx').length;
	};
	
	util.headByByte = function(str, len, postFix) {
		str = new String(str).toString();
		if(util.getByteLength(str) <= len) {
			return str;
		}
		postFix = postFix || '';
		var l;
		if(postFix) {
			l = len = len - util.getByteLength(postFix);
		} else {
			l = len;
		}
		do {
			str = str.slice(0, l--);
		} while(util.getByteLength(str) > len);
		return str + postFix;
	};
	
	util.encodeHtml = function(str) {
		return (str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\x60/g, '&#96;').replace(/\x27/g, '&#39;').replace(/\x22/g, '&quot;');
	};
	
	util.decodeHtml = function(str) {
		return (str + '').replace(/&quot;/g, '\x22').replace(/&#0*39;/g, '\x27').replace(/&#0*96;/g, '\x60').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
	};
	
	util.getUrlParam = function(name, loc) {
		loc = loc || window.location;
		var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(&|#|$)');
		var m = (loc.href || '').match(r);
		return (m ? decodeURIComponent(m[2]) : '');
	};
	
	util.getUrlParams = function(loc) {
		loc = loc || window.location;
		var raw = loc.search, res = {}, p, i;
		if(raw) {
			raw = raw.slice(1);
			raw = raw.split('&');
			for(i = 0, l = raw.length; i < l; i++) {
				p = raw[i].split('=');
				res[p[0]] = decodeURIComponent(p[1] || '');
			}
		}
		raw = loc.hash;
		if(raw) {
			raw = raw.slice(1);
			raw = raw.split('&');
			for(i = 0, l = raw.length; i < l; i++) {
				p = raw[i].split('=');
				res[p[0]] = res[p[0]] || decodeURIComponent(p[1] || '');
			}
		}
		return res;
	};
	
	util.appendQueryString = function(url, param, isHashMode) {
		if(typeof param == 'object') {
			param = $.param(param, true);
		} else if(typeof param == 'string') {
			param = param.replace(/^&/, '');
		} else {
			param = '';
		}
		if(!param) {
			return url;
		}
		if(isHashMode) {
			if(url.indexOf('#') == -1) {
				url += '#' + param;
			} else {
				url += '&' + param;
			}
		} else {
			if(url.indexOf('#') == -1) {
				if(url.indexOf('?') == -1) {
					url += '?' + param;
				} else {
					url += '&' + param;
				}
			} else {
				var tmp = url.split('#');
				if(tmp[0].indexOf('?') == -1) {
					url = tmp[0] + '?' + param + '#' + (tmp[1] || '');
				} else {
					url = tmp[0] + '&' + param + '#' + (tmp[1] || '');
				}
			}
		}
		return url;
	};
	
	util.gotoUrl = function(url, param) {
		location.href = _getUrl(url, param);
	};
	
	util.replaceUrl = function(url, param) {
		location.replace(_getUrl(url, param));
	};
	
	util.formatMsg = function(msg, data) {
		msg = msg + '';
		if(data) {
			$.each(data, function(key, val) {
				msg = msg.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), val);
			});
		}
		return msg;
	};

	util.toBase64 = function(str, callback) {
		if(!str) {
			callback('');
			return;
		}
		require(['base64'], function(base64) {
			if(typeof str != 'string') {
				str = json.stringify(str);
			}
			callback(base64.toBase64(str, true));
		});
	};

	util.fromBase64 = function(str, callback, parseJson) {
		if(!str) {
			callback(parseJson ? null : '');
			return;
		}
		require(['base64'], function(base64) {
			var res;
			try {
				res = base64.fromBase64(str);
			} catch(e) {
				callback(parseJson ? null : '');
				return;
			}
			if(parseJson) {
				try {
					res = json.parse(res);
				} catch(e) {
					res = null;
				}
			}
			callback(res);
		});
	};

	util.formatDecimal = function(decimal, format, opt) {
		function formatInteger(integer) {
			var res = [], count = 0;
			integer = integer.split('');
			while(integer.length) {
				if(count && !(count % 3)) {
					res.unshift(',');
				}
				res.unshift(integer.pop());
				count++;
			}
			return res.join('');
		};
		opt = opt || {};
		var res = '';
		var decimalMatchRes, formatMatchRes, fLen, dLen, tmp;
		decimal += '';
		decimalMatchRes = decimal.match(/^(\-?)(\w*)(.?)(\w*)/);
		formatMatchRes = format.match(/^(\-?)(\w*)(.?)(\w*)/);
		if(formatMatchRes[2]) {
			res += decimalMatchRes[2];
		}
		if(formatMatchRes[3] && formatMatchRes[4]) {
			res += formatMatchRes[3];
		} else {
			if(opt.round) {
				res = Math.round(decimal) + '';
			} else if(opt.ceil) {
				res = Math.ceil(decimal) + '';
			}
			res = formatInteger(res);
			return res;
		}
		fLen = Math.min(formatMatchRes[4].length, 4);
		dLen = decimalMatchRes[4].length;
		res += decimalMatchRes[4].slice(0, fLen);
		if(fLen > dLen) {
			res += new Array(fLen - dLen + 1).join('0');
		}
		if(dLen > fLen && (opt.round && decimalMatchRes[4].charAt(fLen) >= 5 || opt.ceil && decimalMatchRes[4].charAt(fLen) > 0)) {
			return util.formatDecimal((res * Math.pow(10, fLen) + 1) / Math.pow(10, fLen), format);
		}
		res = res.split('.');
		res[0] = formatInteger(res[0]);
		res = res.join('.');
		if(decimalMatchRes[1] && res != '0') {
			res = decimalMatchRes[1] + res;
		}
		return res;
	};

	util.formatDateTime = function(date, format) {
		if(!date) {
			return '';
		}
		var res = format, tt = '';
		date = new Date(date);
		res = res.replace(/yyyy|yy/, function($0) {
			if($0.length === 4) {
				return date.getFullYear();
			} else {
				return (date.getFullYear() + '').slice(2, 4);
			}
		}).replace(/MM|M/, function($0) {
			if($0.length === 2 && date.getMonth() < 9) {
				return '0' + (date.getMonth() + 1);
			} else {
				return date.getMonth() + 1;
			}
		}).replace(/dd|d/, function($0) {
			if($0.length === 2 && date.getDate() < 10) {
				return '0' + date.getDate();
			} else {
				return date.getDate();
			}
		}).replace(/HH|H/, function($0) {
			if($0.length === 2 && date.getHours() < 10) {
				return '0' + date.getHours();
			} else {
				return date.getHours();
			}
		}).replace(/hh|h/, function($0) {
			var hours = date.getHours();
			if(hours > 11) {
				tt = 'PM';
			} else {
				tt ='AM';
			}
			hours = hours > 12 ? hours - 12 : hours;
			if($0.length === 2 && hours < 10) {
				return '0' + hours;
			} else {
				return hours;
			}
		}).replace(/mm/, function($0) {
			if(date.getMinutes() < 10) {
				return '0' + date.getMinutes();
			} else {
				return date.getMinutes();
			}
		}).replace(/ss/, function($0) {
			if(date.getSeconds() < 10) {
				return '0' + date.getSeconds();
			} else {
				return date.getSeconds();
			}
		}).replace('tt', tt);
		return res;
	};

	util.formatLeftTime = function(ms, hh, mm, ss) {
		var s = m = h = 0;
		s = parseInt(ms / 1000);
		s = s || 1;
		if(s >= 60) {
			m = parseInt(s / 60);
			s = s % 60;
		}
		if(m >= 60) {
			h = parseInt(m / 60);
			m = m % 60;
		}
		return [h ? h + (hh || 'h') : '', m ? m + (mm || 'm') : '', s ? s + (ss || 's') : ''].join('');
	};

	util.formatFileSize = function(bytes) {
		var k, m, g;
		if(bytes < 100) {
			return util.formatDecimal(bytes, '0.00' , {ceil: 1}) + 'B';
		}
		k = bytes / 1024;
		if(k < 1000) {
			return util.formatDecimal(k, '0.00', {ceil: 1}) + 'KB';
		}
		m = k / 1024;
		if(m < 1000) {
			return util.formatDecimal(m, '0.00', {ceil: 1}) + 'MB';
		}
		g = m / 1024;
		return util.formatDecimal(g, '0.00', {ceil: 1}) + 'GB';
	};

	util.getLocalStoredList = function(listName) {
		var res = localStorage.get(listName);
		if(res) {
			res = json.parse(res);
		}
		return res || [];
	};

	util.unshiftLocalStoredList = function(listName, item, opt) {
		if(!item) {
			return;
		}
		var i, l, tmp, size, comparer;
		var list = util.getLocalStoredList(listName);
		opt = opt || {};
		size = opt.size || 10;
		comparer = opt.comparer || function(a, b) {return a === b};
		if(list && list.length) {
			if(list.length && comparer(item, list[0])) {
				return;
			}
			tmp = [];
			for(i = 0, l = list.length; i < l; i++) {
				if(!comparer(item, list[i]) && tmp.length < size - 1) {
					tmp.push(list[i]);
				}
			}
			tmp.unshift(item);
			list = tmp;
		} else {
			list = [item];
		}
		localStorage.set(listName, json.stringify(list));
	};

	util.removeFromLocalStoredList = function(listName, item, opt) {
		if(!item) {
			return;
		}
		var i, l, comparer;
		var list = util.getLocalStoredList(listName);
		opt = opt || {};
		comparer = opt.comparer || function(a, b) {return a === b};
		if(list && list.length) {
			for(i = list.length - 1; i >= 0; i--) {
				if(comparer(item, list[i])) {
					list.splice(i, 1);
				}
			}
			localStorage.set(listName, json.stringify(list));
		}
	};

	util.getSvrTime = function() {
		return require('./auth').getData('now') || new Date().getTime();
	};

	util.typeConfirm = function(type, body, callback){
		var message = "This action CANNOT be undone. Type <strong>" + type + "</strong> to confirm:";

		var confirm = require('./dialog').create({
			title: "Are you ABSOLUTELY sure?",
			content: confirmTpl.render({message: message, body: body}),
			btns: [
				{
					text: type,
					className: 'btn-primary',
					click: _update
				},
				{
					text: langResourceCommon.label.cancel,
					dismiss: true
				}
			]
		});
		confirm.on('keyup', '#confirm-input', function(evt){
			if(evt.which === 13){
				_update();
			}
		})

		function _update(){
			if($("#confirm-input", confirm).val() === type){
				callback();
				confirm.modal('hide');
			}else{
				$('.help-inline', confirm).html("<br>Sorry, please enter the text exactly as displayed to confirm.").show();
				$('.control-group', confirm).addClass('error');
			}
		}
	}

	util.getScrollBarWidth = function() {
		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild (outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 == w2) w2 = outer.clientWidth;

		document.body.removeChild (outer);

		return (w1 - w2);
	}

	util.delay = function(ms, func) {
		return setTimeout(func, ms);
	}
	
	return util;
});

define('./ui', ['require', 'exports', 'module', 'jquery'], function(require) {
	var $ = require('jquery');
	var langResourceCommon = require('lang/' + G.LANG + '/common');
	
	var ui = {};

	ui.renderPageLoadError = function(container, opt) {
		opt = opt || {};
		$(container).html([
			'<div class="guiding error page-load-error off-screen off-top">',
				'<div class="icon-part">',
					'<i class="icon-frown"></i>',
				'</div>',
				'<div class="text-part">',
					'<h1>',
						opt.title || langResourceCommon.label.sorry,
					'</h1>',
					'<p class="desc">',
						opt.content || langResourceCommon.msg.pageLoadError,
					'</p>',
					opt.btn != undefined ? opt.btn : '<a class="btn btn-danger btn-lg" href="javascript:void(0);" onclick="location.reload();">' + langResourceCommon.label.refresh + ' <i class="icon-refresh"></i></a>',
				'</div>',
			'</div>'
		].join(''));
		setTimeout(function() {
			$('.off-screen', container).removeClass('off-top');
		}, 0);
	};

	ui.renderInvalidUrl = function(container) {
		ui.renderPageLoadError(container, {
			content: langResourceCommon.msg.invalidUrl,
			btn: ''
		});
	};
	
	return ui;
});


define('./mockup-form-control', ['require', 'exports', 'module', 'jquery', './events'], function(require) {
	var $ = require('jquery');
	var events = require('./events');
	
	var mockupFormControl = {};
	
	mockupFormControl.setCheckbox = function(name, checked) {
		var item = $('input[name="' + name + '"], input[data-name="' + name + '"]')[0];
		if(checked) {
			item.checked = true;
			$(item.parentNode).addClass('on');
		} else {
			item.checked = false;
			$(item.parentNode).removeClass('on');
		}
	};
	
	mockupFormControl.setRadio = function(name, value) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		items.parent().removeClass('on');
		items.each(function(i, item) {
			if(item.value == value) {
				item.checked = true;
				$(item.parentNode).addClass('on');
			} else {
				item.checked = false;
			}
		});
	};
	
	mockupFormControl.isCheckboxOn = function(name) {
		var item = $('input[name="' + name + '"], input[data-name="' + name + '"]')[0];
		return item && item.checked;
	};
	
	mockupFormControl.getRadioValue = function(name) {
		var value;
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		items.each(function(i, item) {
			if(item.checked) {
				value = item.value;
				return false;
			}
		});
		return value;
	};

	mockupFormControl.toggleCheckAll = function (checkbox, name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		if (checkbox.checked) {
			items.parent().addClass('on');
		} else {
			items.parent().removeClass('on');
		}
		
		items.each(function(i, item) {
			item.checked = checkbox.checked;
		});
	}

	mockupFormControl.getSelectedCheckboxCount = function (name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		var count = 0;
		items.each(function(i, item) {
			if (item.checked) {
				count += 1;
			}
		});
		return count;
	}

	mockupFormControl.getSelectedCheckboxValue = function (name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		var values = [];
		items.each(function(i, item) {
			if (item.checked) {
				values.push(item.value);
			}
		});
		return values;
	}

	$.extend(mockupFormControl, events);

	mockupFormControl._addObservers(['toggle-checkbox', 'toggle-radio']);

	//Init mockup checkbox
	$(document).delegate('.mockup-checkbox input', 'click', function(evt) {
		if(this.checked) {
			$(this.parentNode).addClass('on');
		} else {
			$(this.parentNode).removeClass('on');
		}
		mockupFormControl._dispatchEvent('toggle-checkbox', evt);
	});
	//Init mockup radio
	$(document).delegate('.mockup-radio input', 'click', function(evt) {
		$('input[name="' + this.name + '"], input[data-name="' + this.name + '"]').parent().removeClass('on');
		if(this.checked) {
			$(this.parentNode).addClass('on');
		} else {
			$(this.parentNode).removeClass('on');
		}
		mockupFormControl._dispatchEvent('toggle-radio', evt);
	});
	
	return mockupFormControl;
});

define('./data-table', ['require', 'exports', 'module', 'jquery', './observer', './delegator'], function(require) {
	var $ = require('jquery');
	var Observer = require('./observer');
	var Delegator = require('./delegator');

	var _observers = {};
	
	var dataTable = {};
	
	dataTable.bindRowSelectionEvent = function() {
		Delegator.getPageDelegator().delegate('click', 'toggleDataTableAllRows', function(evt, container) {
			if(!container) {
				return;
			}
			var checked = this.checked;
			$(decodeURIComponent(container)).find('[data-toggle="data-table-row"]').each(function(i, item) {
				if(checked) {
					item.checked = true;
					$(item).closest('.mockup-checkbox').addClass('on');
				} else {
					item.checked = false;
					$(item).closest('.mockup-checkbox').removeClass('on');
				}
			});
			var observer = _observers['select'];
			observer && observer.dispatch({});
		}).delegate('click', 'toggleDataTableRow', function(evt, container) {
			if(!container) {
				return;
			}
			var checked = this.checked;
			var allChecked = true;
			var checkbox;
			if(checked) {
				$(decodeURIComponent(container)).find('[data-toggle="data-table-row"]').each(function(i, item) {
					if(!item.checked) {
						allChecked = false;
					}
				});
				if(allChecked) {
					checkbox = $(decodeURIComponent(container)).find('[data-toggle="data-table-all-rows"]');
					checkbox[0].checked = true;
					checkbox.closest('.mockup-checkbox').addClass('on');
				}
			} else {
				checkbox = $(decodeURIComponent(container)).find('[data-toggle="data-table-all-rows"]');
				checkbox[0].checked = false;
				checkbox.closest('.mockup-checkbox').removeClass('on');
			}
			var observer = _observers['select'];
			observer && observer.dispatch({});
		});
		dataTable.bindRowSelectionEvent = function() {};
	};

	dataTable.getSelectedList = function(container) {
		var res = [];
		$(decodeURIComponent(container)).find('[data-toggle="data-table-row"]').each(function(i, item) {
			if(item.checked) {
				res.push({checkbox: item, data: item.getAttribute('data-row-data')});
			}
		});
		return res;
	};

	dataTable.getSelectedDataList = function(container) {
		var res = [];
		$(decodeURIComponent(container)).find('[data-toggle="data-table-row"]').each(function(i, item) {
			if(item.checked) {
				res.push(item.getAttribute('data-row-data'));
			}
		});
		return res;
	};

	dataTable.on = function(type, handler) {
		var observer = _observers[type] = _observers[type] || new Observer();
		observer.subscribe(handler);
	};
	
	return dataTable;
});

define('./service', ['require', 'exports', 'module', 'jquery', './util', './ajax', './alerts'], function(require) {
	var $ = require('jquery');
	var util = require('./util');
	var ajax = require('./ajax');
	var alerts = require('./alerts');
	var langResourceCommon = require('lang/' + G.LANG + '/common');

	var service = {};
	
	_getListResources = function(resouceName, listId, callback, opt) {
		opt = opt || {};
		require(['ajax!' + G.getAjaxLoadUrl('lists/' + listId + '/' + resouceName + '@noCahce=' + (opt.noCahce ? 'true' : ''))], function(res) {
			if(ajax.dealCommonCode(res.code)) {
				return;
			}
			if(res.code === 0) {
				callback(res.data[resouceName]);
			} else {
				if(opt.error) {
					opt.error(res);
				} else {
					alerts.show(res.message, 'error');
				}
			}
		}, function() {
			if(opt.error) {
				opt.error({});
			} else {
				alerts.show(langResourceCommon.msg.serverBusy, 'error');
			}
		});
	};
	
	service.unshiftProperty = function(id) {
		util.unshiftLocalStoredList('FREQUENTLY_USED_PROPERTY_IDS', id);
	};
	
	service.getFrequencyOrderProperties = function(listId, callback, opt) {
		return _getListResources('propertys', listId, function(propertys) {
			var ids = util.getLocalStoredList('FREQUENTLY_USED_PROPERTY_IDS');
			var order = {};
			if(!(propertys && propertys.length && ids && ids.length)) {
				callback(propertys);
				return;
			}
			$.each(ids, function(i, id) {
				order[id] = ids.length - i;
			});
			propertys = propertys.concat();
			propertys.sort(function(a, b) {
				return (order[b.id] || 0) - (order[a.id] || 0);
			});
			callback(propertys);
		}, opt);
	};
	
	service.getProperties = function(listId, callback, opt) {
		return _getListResources('propertys', listId, callback, opt);
	};
	
	service.getCustomerGroups = function(listId, callback, opt) {
		return _getListResources('groups', listId, callback, opt);
	};

	return service;
});


define('./section', ['require', 'exports', 'module', 'jquery', './events'], function(require) {
	var $ = require('jquery');
	var events = require('./events');
	
	var section = {};
	
	section.collapse = function(id) {
		if(id) {
			$('#' + id).addClass('collapse');
		} else {
			$('.section-collapse').addClass('collapse');
		}
	};
	
	section.expand = function(id) {
		if(id) {
			$('#' + id).removeClass('collapse');
		} else {
			$('.section-collapse').removeClass('collapse');
		}
	};

	$.extend(section, events);

	section._addObservers(['toggle']);

	$(document).delegate('[data-toggle="section"]', 'click', function(evt) {
		$(this).closest('.section-collapse').toggleClass('collapse');
		section._dispatchEvent('toggle', evt);
	});
	
	return section;
});

define(['require', 'exports', 'module', './config', './array', './json', './css', './cookie', './history', './local-storage', './page-storage', './util', './ui', './ajax', './login', './auth', './dialog', './alerts', './mockup-form-control', './data-table', './events', './service', './section', './instance-manager', './delegator', './observer'], function(require) {
	return {
		config: require('./config'),
		array: require('./array'),
		json: require('./json'),
		css: require('./css'),
		cookie: require('./cookie'),
		history: require('./history'),
		localStorage: require('./local-storage'),
		pageStorage: require('./page-storage'),
		util: require('./util'),
		ui: require('./ui'),
		ajax: require('./ajax'),
		login: require('./login'),
		auth: require('./auth'),
		dialog: require('./dialog'),
		alerts: require('./alerts'),
		mockupFormControl: require('./mockup-form-control'),
		dataTable: require('./data-table'),
		events: require('./events'),
		service: require('./service'),
		section: require('./section'),
		InstanceManager: require('./instance-manager'),
		Delegator: require('./delegator'),
		Observer: require('./observer'),
		empty: function() {}
	};
});
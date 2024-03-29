// Generated by CoffeeScript 1.6.3
(function() {
  var $, Ajax, Base, Collection, Extend, Include, Model, Singleton, Spine,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Spine = this.Spine || require('spine');

  $ = Spine.$;

  Model = Spine.Model;

  Ajax = {
    PROXY_PATH: '{{CGI_BASE}}static/js/lib/rfl/ajax-proxy.html'.replace('{{CGI_BASE}}', G.CGI_BASE),
    getDataTypeURL: function(url, dataType) {
      return url.replace(/[^\/]+$/, function(m) {
        return m.replace(/^[\w\-\.]+/, function(m) {
          return m.split('.')[0] + '.' + dataType;
        });
      });
    },
    url2obj: function(str) {
      var m, uri;
      if (typeof str !== 'string') {
        return str;
      }
      m = str.match(/([^:]*:)?(?:\/\/)?([^\/:]+)?(:)?(\d+)?([^?#]+)(\?[^?#]*)?(#[^#]*)?/);
      if (m == null) {
        m = [];
      }
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
    },
    getProxy: function(settings, done, fail) {
      var onload,
        _this = this;
      if (!this.proxyFrame) {
        if (settings.urlObj == null) {
          settings.urlObj = this.url2obj(settings.url);
        }
        this.proxyFrame = document.createElement('iframe');
        this.proxyFrame.style.display = 'none';
        this.proxyFrame.src = settings.urlObj.origin + this.PROXY_PATH;
        $(this.proxyFrame).on('load', onload = function(evt) {
          if (_this.proxyFrame._loaded) {
            return _this.getProxy(settings, done, fail);
          } else {
            $(_this.proxyFrame).off('load', onload).remove();
            _this.proxyFrame = null;
            return fail();
          }
        });
        this.proxyFrame = document.body.appendChild(this.proxyFrame);
      }
      if (this.proxyFrame._loaded) {
        return this.proxyFrame.contentWindow.require(['jquery'], function($) {
          return done($);
        }, function() {
          return fail();
        });
      }
    },
    getURL: function(object) {
      return (typeof object.url === "function" ? object.url() : void 0) || object.url;
    },
    getCollectionURL: function(object) {
      if (object) {
        if (typeof object.url === "function") {
          return this.generateURL(object);
        } else {
          return object.url;
        }
      }
    },
    getScope: function(object) {
      return G.CGI_BASE + ((typeof object.scope === "function" ? object.scope() : void 0) || object.scope || '');
    },
    generateURL: function() {
      var args, collection, object, path, scope;
      object = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (object.className) {
        collection = this.getLowerCaseModelName(object.className) + 's';
        scope = Ajax.getScope(object);
      } else {
        if (typeof object.constructor.url === 'string') {
          collection = object.constructor.url;
        } else {
          collection = this.getLowerCaseModelName(object.constructor.className) + 's';
        }
        scope = Ajax.getScope(object) || Ajax.getScope(object.constructor);
      }
      args.unshift(collection);
      args.unshift(scope);
      path = args.join('/');
      path = path.replace(/(\/\/)/g, "/");
      path = path.replace(/^\/|\/$/g, "");
      if (path.indexOf("../") !== 0) {
        return Model.host + "/" + path;
      } else {
        return path;
      }
    },
    getLowerCaseModelName: function(name) {
      return name.charAt(0).toLowerCase() + name.slice(1);
    }
  };

  $.extend(Ajax, Spine.Events);

  Base = (function() {
    function Base() {}

    Base.prototype.defaults = {
      cache: true,
      dataType: null,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    Base.prototype.ajax = function(params, defaults) {
      var aborted, deferred, jqXHR, promise, settings, _ref, _ref1;
      Ajax.trigger('start');
      jqXHR = null;
      aborted = false;
      deferred = $.Deferred();
      promise = deferred.promise();
      settings = this.ajaxSettings(params, defaults);
      if (((_ref = this.record) != null ? _ref.id : void 0) != null) {
        if (settings.url == null) {
          settings.url = Ajax.getURL(this.record);
        }
        if ((_ref1 = settings.data) != null) {
          _ref1.id = this.record.id;
        }
      }
      if (typeof settings.data !== 'string' && settings.processData !== true && settings.type !== 'GET') {
        settings.data = JSON.stringify(settings.data);
      }
      settings.url = Ajax.getDataTypeURL(settings.url, 'json');
      settings.urlObj = Ajax.url2obj(settings.url);
      if (settings.type === 'GET') {
        if (G.ORIGIN !== settings.urlObj.origin && settings.dataType === 'json') {
          Ajax.getProxy(settings, function($) {
            if (!aborted) {
              return jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject);
            }
          }, function() {
            return deferred.reject(promise, '', '');
          });
        } else {
          if (settings.dataType == null) {
            settings.dataType = G.ORIGIN === settings.urlObj.origin ? 'json' : 'jsonp';
          }
          if (settings.dataType === 'jsonp') {
            if (settings.scriptCharset == null) {
              settings.scriptCharset = 'UTF-8';
            }
            settings.url = Ajax.getDataTypeURL(settings.url, 'jsonp');
            settings.urlObj = Ajax.url2obj(settings.url);
            if (!settings.jsonpCallback) {
              settings.url.split('/').pop().replace(/^[a-zA-Z_]\w*/, function(m) {
                return settings.jsonpCallback = m;
              });
              if (settings.jsonpCallback == null) {
                settings.jsonpCallback = 'jsonpCallback';
              }
            }
            if (settings.jsonp == null) {
              settings.jsonp = 'callback';
            }
          }
          jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject);
        }
      } else {
        if (G.IS_PROTOTYPE) {
          settings.type = 'POST';
        }
        settings.dataType = 'json';
        settings.contentType = 'application/json; charset=' + (settings.charset || 'UTF-8');
        if (G.ORIGIN !== settings.urlObj.origin) {
          Ajax.getProxy(settings, function($) {
            if (!aborted) {
              return jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject);
            }
          }, function() {
            return deferred.reject(promise, '', '');
          });
        } else {
          jqXHR = $.ajax(settings).done(deferred.resolve).fail(deferred.reject);
        }
      }
      promise.abort = function(statusText) {
        aborted = true;
        if (jqXHR) {
          return jqXHR.abort(statusText);
        }
        return promise;
      };
      promise.always(function() {
        return Ajax.trigger('end');
      });
      return promise;
    };

    Base.prototype.ajaxQueue = function(params, defaults) {
      var complete, deferred, obj, promise;
      if (params == null) {
        params = {};
      }
      deferred = $.Deferred();
      promise = deferred.promise();
      obj = this.record || this.model;
      if (obj.ajaxQueueing) {
        return promise;
      }
      obj.ajaxQueueing = true;
      complete = params.complete;
      params.complete = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (complete != null) {
          complete.apply.apply(complete, [this].concat(__slice.call(args)));
        }
        return obj.ajaxQueueing = false;
      };
      return this.ajax(params, defaults);
    };

    Base.prototype.ajaxSettings = function(params, defaults) {
      return $.extend({}, this.defaults, defaults, params);
    };

    return Base;

  })();

  Collection = (function(_super) {
    __extends(Collection, _super);

    function Collection(model) {
      this.model = model;
      this.failResponse = __bind(this.failResponse, this);
      this.recordsResponse = __bind(this.recordsResponse, this);
    }

    Collection.prototype.fetch = function(params, options) {
      var id, record;
      if (params == null) {
        params = {};
      }
      if (options == null) {
        options = {};
      }
      if (id = params.id) {
        record = new this.model({
          id: id
        });
        delete params.id;
      }
      return this.ajax(params, {
        type: 'GET',
        url: options.url || Ajax.getURL(id ? record : this.model)
      }).done(this.recordsResponse(record, options)).fail(this.failResponse(record, options));
    };

    Collection.prototype.recordsResponse = function(record, options) {
      var _this = this;
      if (record == null) {
        record = null;
      }
      if (options == null) {
        options = {};
      }
      return function(res, status, xhr) {
        var records, _ref, _ref1, _ref2;
        if (res.code === 0) {
          if (record) {
            records = ((_ref = res.data) != null ? _ref[Ajax.getLowerCaseModelName(_this.model.className)] : void 0) || res.data;
          } else {
            records = res.data[Ajax.getLowerCaseModelName(_this.model.className) + 's'] || res.data;
            if (typeof res.data.total === 'number') {
              _this.model.total = res.data.total;
            }
          }
          _this.model.refresh(records, options);
          _this.model.trigger('ajaxSuccess', record, 'fetch', res, status, xhr);
          return (_ref1 = options.done) != null ? _ref1.apply(record || _this.model, [res, status, xhr]) : void 0;
        } else {
          _this.model.trigger('ajaxBizError', record, 'fetch', res, status, xhr);
          return (_ref2 = options.fail) != null ? _ref2.apply(record || _this.model, [res, status, xhr]) : void 0;
        }
      };
    };

    Collection.prototype.failResponse = function(record, options) {
      var _this = this;
      if (record == null) {
        record = null;
      }
      if (options == null) {
        options = {};
      }
      return function(xhr, statusText, error) {
        var res, _ref;
        res = {
          code: -1
        };
        _this.model.trigger('ajaxError', record, 'fetch', res, statusText, xhr);
        return (_ref = options.fail) != null ? _ref.apply(record || _this.model, [res, statusText, xhr]) : void 0;
      };
    };

    return Collection;

  })(Base);

  Singleton = (function(_super) {
    __extends(Singleton, _super);

    function Singleton(record) {
      this.record = record;
      this.failResponse = __bind(this.failResponse, this);
      this.recordResponse = __bind(this.recordResponse, this);
      this.model = this.record.constructor;
    }

    Singleton.prototype.reload = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajax(params, {
        type: 'GET',
        url: options.url
      }).done(this.recordResponse('reload', options)).fail(this.failResponse('reload', options));
    };

    Singleton.prototype.create = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajax(params, {
        type: 'POST',
        contentType: 'application/json',
        data: this.record.toJSON(),
        url: options.url || Ajax.getCollectionURL(this.record)
      }).done(this.recordResponse('create', options)).fail(this.failResponse('create', options));
    };

    Singleton.prototype.update = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'PUT',
        contentType: 'application/json',
        data: this.record.toJSON(),
        url: options.url
      }).done(this.recordResponse('update', options)).fail(this.failResponse('update', options));
    };

    Singleton.prototype.destroy = function(params, options) {
      if (options == null) {
        options = {};
      }
      return this.ajaxQueue(params, {
        type: 'DELETE',
        url: options.url
      }).done(this.recordResponse('destroy', options)).fail(this.failResponse('destroy', options));
    };

    Singleton.prototype.recordResponse = function(type, options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(res, status, xhr) {
        var data, _ref, _ref1, _ref2;
        if (res.code === 0) {
          data = ((_ref = res.data) != null ? _ref[Ajax.getLowerCaseModelName(_this.model.className)] : void 0) || res.data;
          if (type === 'destroy') {
            _this.record.remove();
          } else if (!Spine.isBlank(data)) {
            if (data.id && _this.record.id !== data.id) {
              _this.record.changeID(data.id);
            }
            _this.record.refresh(data);
            _this.record.save;
          }
          _this.record.trigger('ajaxSuccess', type, res, status, xhr);
          return (_ref1 = options.done) != null ? _ref1.apply(_this.record, [res, status, xhr]) : void 0;
        } else {
          _this.record.trigger('ajaxBizError', type, res, status, xhr);
          return (_ref2 = options.fail) != null ? _ref2.apply(_this.record, [res, status, xhr]) : void 0;
        }
      };
    };

    Singleton.prototype.failResponse = function(type, options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return function(xhr, statusText, error) {
        var res, _ref;
        res = {
          code: -1
        };
        _this.record.trigger('ajaxError', type, res, statusText, xhr);
        return (_ref = options.fail) != null ? _ref.apply(_this.record, [res, statusText, xhr]) : void 0;
      };
    };

    return Singleton;

  })(Base);

  Model.host = G.CGI_ORIGIN;

  Include = {
    ajax: function() {
      return new Singleton(this);
    },
    url: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      args.unshift(encodeURIComponent(this.id));
      return Ajax.generateURL.apply(Ajax, [this].concat(__slice.call(args)));
    },
    ajaxCreate: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajax()['create'](options.ajax, options);
    },
    ajaxUpdate: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajax()['update'](options.ajax, options);
    },
    ajaxDestroy: function(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      return this.ajax()['destroy'](options.ajax, options).done(function() {
        return _this.destroy(options);
      });
    }
  };

  Extend = {
    ajax: function() {
      return new Collection(this);
    },
    url: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return Ajax.generateURL.apply(Ajax, [this].concat(__slice.call(args)));
    },
    ajaxFetch: function(options) {
      if (options == null) {
        options = {};
      }
      return this.ajax()['fetch'](options.ajax, options);
    }
  };

  Model.Ajax = {
    extended: function() {
      this.extend(Extend);
      return this.include(Include);
    }
  };

  Ajax.defaults = Base.prototype.defaults;

  Ajax.Base = Base;

  Ajax.Singleton = Singleton;

  Ajax.Collection = Collection;

  Spine.Ajax = Ajax;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Ajax;
  }

}).call(this);

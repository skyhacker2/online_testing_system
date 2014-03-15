define("./search.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<style type="text/css">.block-basic { background-color: #eeeeee; padding: 13px; margin: 13px 0; color: #555555; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 5px; border-top-left-radius: 5px;}.block-basic:before,.block-basic:after { content: " "; /* 1 */ display: table; /* 2 */}.block-basic:after { clear: both;}.app-search-box { position: relative;}.app-search-box .icon-remove-sign { font-size: 18px; position: absolute; right: 50px; top: 12px; z-index: 2; cursor: pointer; color: #999999; display: none;}.app-search-box .icon-remove-sign:hover { color: #555555;}.app-search-result { margin-top: 20px;}.app-search-result table td { border-top: solid 1px #eeeeee;}</style><div class="app-search-box"><div class="input-group"><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><span id="smart-search-current-type">', currentType.displayName, '</span> <span class="caret"></span></button><ul class="dropdown-menu" role="menu">');
                for (var i = 0; i < types.length; i++) {
                    var item = types[i];
                    _$out_.push('<li><a href="javascript:void(0);" data-rfl-click="appSearchSwitchType ', i, '">', item.displayName, "</a></li>");
                }
                _$out_.push('</ul></div><input id="app-search-box-input" class="form-control" type="text" data-rfl-keyup="keyupAppSearch" /><span class="input-group-btn"><button class="btn btn-default" type="button" data-rfl-click="appSearch"><i class="icon-search"></i></button></span></div><i class="icon-remove-sign" data-rfl-click="appSearchClear"></i></div><div class="app-search-result"></div>');
            }
        })();
        return _$out_.join("");
    };
});

define("./search-msg.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<div class="alert alert-', type, '" style="display: none;">', msg, "</div>");
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', 'jquery', 'rfl', 'form-util', './search.tpl.html', './search-msg.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var rfl = require('rfl');
	var formUtil = require('form-util');
	var mailTpl = require('./search.tpl.html');
	var msgTpl = require('./search-msg.tpl.html');

	var _autoComplete = null;
	var _currentTypeIndex = 0;
	var _opt = {};

	var _types = [
		{
			type: 'campaign',
			displayName: 'Campaign'
		},
		{
			type: 'customer',
			displayName: 'Customer'
		}
	];

	function _search() {
		var key = $('#app-search-box-input').val();
		require(['./search-' + _types[_currentTypeIndex].type + '-main'], function(mod) {
			mod.search(key, '.app-search-result', $.extend({}, _opt, {callback: function(res) {
				$('.app-search .app-search-box .icon-remove-sign').show();
			}}));
		});
	};

	var appSearch = {
		switchType: function(i) {
			if(!(i >= 0)) {
				i = (_currentTypeIndex + 1) % _types.length;
			}
			if(!_types[i] || i == _currentTypeIndex) {
				return;
			}
			_currentTypeIndex = i;
			_autoComplete && _autoComplete.clear();
			$('#smart-search-current-type').html(_types[_currentTypeIndex].displayName);
			formUtil.focus('#app-search-box-input');
		},

		clear: function(focus) {
			$('#app-search-box-input').val('');
			$('.app-search .app-search-box .icon-remove-sign').hide();
			$('.app-search .app-search-result').html('');
			if(focus) {
				formUtil.focus('#app-search-box-input');
			}
		},

		showMsg: function(msg, type) {
			var type = ({
				info: 'info',
				success: 'success',
				error: 'danger'
			})[type] || 'warning';
			$('.app-search .app-search-result').html(msgTpl.render({msg: msg, type: type})).find('.alert').fadeIn();
		},

		init: function(container, opt) {
			_opt = opt || {};
			if(_opt.searchType) {
				$.each(_types, function(item, i) {
					if(item.type == _opt.searchType) {
						_currentTypeIndex = i;
					}
				});
			}
			$(container).html(mailTpl.render({types: _types, currentType: _types[_currentTypeIndex]}));
			rfl.Delegator.getPageDelegator().delegate('click', 'appSearch', function(evt) {
				_search();
			}, 1).delegate('keyup', 'keyupAppSearch', function(evt) {
				if(evt.keyCode === 13) {
					_search();
				}
			}, 1).delegate('click', 'appSearchSwitchType', function(evt, i) {
				appSearch.switchType(parseInt(i));
			}, 1).delegate('click', 'appSearchClear', function(evt) {
				appSearch.clear(true);
			}, 1);
			this.init = rfl.empty;
		}
	};
	
	return appSearch;
});

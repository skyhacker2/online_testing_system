define("./main.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<style type="text/css">.instant-editor { padding: 10px; border: solid 1px #ccc; border-radius: 5px; background-color: #f3f3f3; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); width: 360px;}.instant-editor .control-group { margin-bottom: 10px; width: 285px;}.instant-editor .control-group .controls { margin-left: 0;}</style><div class="instant-editor"><div class="form-group">');
                if (label) {
                    _$out_.push('<label for="instant-editor-input">', label, "</label>");
                }
                if (data.propertyType == "DATE") {
                    _$out_.push('<div class="input-group" data-date="', initVal, '" data-date-format="', dateFormat.toLowerCase(), '"><input id="instant-editor-input" class="form-control" type="text" value="', initVal, '" data-validator="', dateFormat, '@datetime" /><span class="input-group-btn add-on"><button class="btn btn-default" type="button"><i class="icon-calendar"></i></button></span></div>');
                } else {
                    _$out_.push('<input id="instant-editor-input" class="form-control ', data.propertyType == "SET" || data.propertyType == "MULTISET" ? "auto-complete-arrow-down" : "", '" type="text" ', maxlength ? 'maxlength="' + maxlength + '"' : "", ' value="', data.propertyType == "SET" || data.propertyType == "MULTISET" ? "" : initVal, '" data-validator="', validator ? validator : data.propertyType == "EMAIL" ? "email" : data.propertyType == "NUMBER" ? "number" : "", '" />');
                }
                _$out_.push('<span class="help-block help-error"></span></div><div><button class="btn btn-sm btn-default instant-editor-btn-update">', lang.label.ok, "</button> ", lang.label.or, ' <a class="instant-editor-btn-cancel text-gray" href="javascript:void(0);" onclick="return false;">', lang.label.cancel.toLowerCase(), "</a></div></div>");
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', 'jquery', './main.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var mainTpl = require('./main.tpl.html');
	var AutoComplete;

	var _LANG_RESOURCE = {
		label: {
			ok: 'OK',
			or: 'or',
			cancel: 'cancel'
		}
	};

	var _editCellLayer;
	var _autoComplete;
	var _date;

	var _callback;
	var _initVal;

	function _save() {
		var inputBox = $('#instant-editor-input')[0];
		_callback && _callback(inputBox, {autoComplete: _autoComplete, date: _date});
	};

	function _init() {
		_editCellLayer = $('<div style="position: absolute; z-index: 99;"></div>').appendTo(document.body);
		_editCellLayer.delegate('.instant-editor-btn-update', 'click', function(evt) {
			_save();
		}).delegate('.instant-editor-btn-cancel', 'click', function(evt) {
			hide();
		}).delegate('#instant-editor-input', 'keypress', function(evt) {
			if(evt.keyCode === 13 && !(_autoComplete && _autoComplete.isListShown())) {
				_save();
			}
		});
		_init = function() {
			_autoComplete && _autoComplete.destroy();
			_autoComplete = null;
			_date = null;
		};
	};

	function _getAutoCompleteStdItem(item) {
		return typeof item == 'string' ? {id: item, name: item} : {id: item.id || item.name || item.value, name: item.name || item.value};
	};
	
	function _show(data, targetEl, callback, opt) {
		_init();
		opt = opt || {};
		var offset = $(targetEl).offset();
		var pageWidth = $(document.body).width();
		var layerWidth;
		var inputBox;
		_callback = callback;
		_initVal = opt.initVal;
		_editCellLayer.html(mainTpl.render({
			lang: opt.lang || _LANG_RESOURCE,
			data: data,
			initVal: _initVal,
			dateFormat: opt.dateFormat || 'yyyy/M/d',
			label: opt.label,
			validator: opt.validator,
			maxlength: opt.maxlength
		})).show();
		layerWidth = _editCellLayer.width();
		_editCellLayer.css({
			left: offset.left + layerWidth + 10 > pageWidth ? (pageWidth - layerWidth - 10) + 'px' : offset.left + 'px',
			top: offset.top + 'px'
		});
		inputBox = $('#instant-editor-input')[0];
		if(data.propertyType == 'SET' || data.propertyType == 'MULTISET') {
			_autoComplete = new AutoComplete(inputBox, {
				separator: opt.separator,
				richSelectionResult: true,
				maxSelection: data.propertyType == 'SET' ? 1 : 9999,
				dataSource: data.items,
				getStdItem: _getAutoCompleteStdItem
			});
			if(_initVal) {
				if(data.propertyType == 'MULTISET') {
					$.each(_initVal, function(i, val) {
						if(val) {
							_autoComplete.addSelectedItem(_getAutoCompleteStdItem(val));
						}
					});
				} else {
					_autoComplete.addSelectedItem(_getAutoCompleteStdItem(_initVal));
				}
			}
		} else if(data.propertyType == 'DATE') {
			$(inputBox).closest('.input-group').datepicker().on('changeDate', function(evt) {
				_date = evt.date;
				if(evt.viewMode == 'days') {
					$(inputBox).closest('.input-group').datepicker('hide');
				}
			});
		}
		inputBox.focus();
	};

	function show(data) {
		var args = Array.prototype.slice.call(arguments);
		if(data.propertyType == 'SET' || data.propertyType == 'MULTISET') {
			require(['auto-complete'], function(ac) {
				AutoComplete = ac;
				_show.apply(null, args);
			});
		} else if(data.propertyType == 'DATE') {
			require(['datepicker'], function(dp) {
				_show.apply(null, args);
			});
		} else {
			_show.apply(null, args);
		}
	};

	function hide() {
		_autoComplete && _autoComplete.destroy();
		_autoComplete = null;
		_date = null;
		_editCellLayer && _editCellLayer.fadeOut();
	};
	
	return {
		show: show,
		hide: hide
	};
});

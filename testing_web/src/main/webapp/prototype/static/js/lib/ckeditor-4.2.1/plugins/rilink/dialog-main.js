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
                _$out_.push('<div id="rilink-form"><div class="form-group"><select id="rilink-type" class="form-control" data-validator="mandatory" data-rfl-keyup="rilinkEnterSubmit"><option value="">-- Select a link type --</option>');
                for (var i = 0; i < navigators.length; i++) {
                    var item = navigators[i];
                    _$out_.push('<option value="', item, '">', lang.campaign.label.navigators[i], "</option>");
                }
                _$out_.push('</select><span class="help-block help-error"></span></div>');
                if (!noNeedText) {
                    _$out_.push('<div class="form-group place-holder-wrapper"><div class="place-holder-text">Input link text</div><input id="rilink-text" class="form-control" type="text" data-validator="mandatory" data-rfl-keyup="rilinkEnterSubmit" /><span class="help-block help-error"></span></div>');
                }
                _$out_.push('<button id="rilink-insert-btn" class="btn btn-sm btn-primary" data-rfl-click="rilinkSubmit">Insert</button> <button class="btn btn-sm btn-default" data-rfl-click="hideRilinkLayer">Cancel</button></div>');
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', 'jquery', 'rfl', 'form-util', './dialog.tpl.html'], function(require) {
	var $ = require('jquery');
	var rfl = require('rfl');
	var formUtil = require('form-util');
	var langResourceCommon = require('lang/' + G.LANG + '/common');
	var langResourceCampaign = require('lang/' + G.LANG + '/campaign');
	var mainTpl = require('./dialog.tpl.html');

	var _proper = null;
	var _editor = null;

	function _submit() {
		var valid = formUtil.validate('#rilink-form');
		if(valid.passed) {
			setTimeout(function() {
				var tag = $('#rilink-type').val();
				_editor.insertHtml([
					'<a href="' + tag + '" target="_blank">',
						$('#rilink-text').val(),
					'</a>'
				].join(''), 'text', {tag: tag});
				_hide()
			}, 200);
		} else {
			formUtil.focus(valid.failList[0].item);
		}
	};

	function _bindEvent() {
		$(document).on('click', function(evt) {
			if(!$(evt.target).closest('.popover').length && evt.target.className.indexOf('insertrilink') < 0) {
				_hide();
			}
		});
		rfl.Delegator.getPageDelegator().delegate('click', 'hideRilinkLayer', _hide)
		.delegate('click', 'rilinkSubmit', function(evt) {
			_submit();
		})
		.delegate('keyup', 'rilinkEnterSubmit', function(evt) {
			if(evt.keyCode === 13) {
				_submit();
			}
		});
		rfl.ajax.history.on('change', function(evt) {
			_hide();
		});
		_bindEvent = rfl.empty;
	};

	function _hide(){
		if(_editor && _editor.focusManager) {
			_editor.focusManager.unlock();
			_editor.focus();
			_editor = null;
		}
		if(_proper) {
			_proper.popover('hide').popover('destroy');
			_proper = null;
		}
	}

	function show(editor, opt) {
		_hide();
		_editor = editor;
		_bindEvent();
		opt = opt || {};
		if(editor.focusManager) {
			editor.focusManager.lock();
		} 
		_proper = $($('.cke_button__insertrilink_icon:visible', opt.context)[0]).popover({
			placement: opt.placement || 'bottom',
			trigger: 'manual',
			container: 'body',
			html: true,
			animation: false,
			title: 'Insert Linkage',
			content: mainTpl.render({
				navigators: rfl.config.CAMPAIGN_NAVIGATORS,
				noNeedText: opt.noNeedText,
				lang: {common: langResourceCommon, campaign: langResourceCampaign}
			})
		});
		_proper.popover('show');

		formUtil.setCommonMsg(langResourceCommon.msg.validator);
		var selection = editor.getSelection && editor.getSelection();
		var selectedContent;
		if(selection) {
			selectedContent = selection.getSelectedElement();
			if(selectedContent && selectedContent.$.tagName == 'IMG') {
				selectedContent = selectedContent.getOuterHtml();
			} else {
				selectedContent = selection.getSelectedText();
			}
		}
		$('#rilink-text').val(selectedContent || '');
		formUtil.initPlaceHolder('#rilink-text');
		formUtil.focus('#rilink-type');
	};

	return {
		show: show
	};
});
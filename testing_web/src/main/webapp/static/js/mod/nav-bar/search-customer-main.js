define("./search-customer.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<table class="table table-responsive ', G.IS_PC ? "table-hover" : "", '"><tbody>');
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    _$out_.push('<tr><td><a href="javascript:void(0);" data-rfl-click="appSearchViewCustomer ', item.id, '">', $encodeHtml(item.firstName || ""), " ", $encodeHtml(item.lastName || ""), " &lt;", $encodeHtml(item.email || ""), "&gt;</a></td></tr>");
                }
                _$out_.push("</tbody></table>");
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', 'jquery', 'rfl', 'mod/nav-bar/search-main', './search-customer.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var rfl = require('rfl');
	var searchControl = require('mod/nav-bar/search-main');
	var langResourceCommon = require('../../lang/' + G.LANG + '/common');
	var listTpl = require('./search-customer.tpl.html');

	var _opt;
	
	function _bindEvent() {
		rfl.Delegator.getPageDelegator().delegate('click', 'appSearchViewCustomer', function(evt, id) {
			//TODO
		}, 1);
		_bindEvent = rfl.empty;
	};

	function search(key, container, opt) {
		_opt = opt || {};
		_bindEvent();
		rfl.ajax.get({
			url: 'lists/' + (opt.listId || G.listId) + '/searchCustomers',
			data: {
				key: key
			},
			success: function(res) {
				if(res.code === 0) {
					if(res.data.customers.length) {
						$(container).html(listTpl.render({list: res.data.customers}));
					} else {
						searchControl.showMsg('No result.', 'info');
					}
				} else {
					searchControl.showMsg(res.message, 'error');
				}
				_opt.callback && _opt.callback(res);
			},
			error: function() {
				searchControl.showMsg(langResourceCommon.msg.serverBusy, 'error');
				_opt.callback && _opt.callback({code: -1, message: langResourceCommon.msg.serverBusy});
			}
		});
	};
	
	return {
		search: search
	};
});

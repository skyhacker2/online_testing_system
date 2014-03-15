define("./list-menu.tpl.html", [ "require", "exports", "module", "lang/" + G.LANG + "/customer" ], function(require, exports, module) {
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
                var langResourceCustomer = require("lang/" + G.LANG + "/customer");
                if (lists.length > 1) {
                    _$out_.push("<ul>");
                    for (var i = 0, l = lists.length; i < l; i++) {
                        var list = lists[i];
                        _$out_.push('<li class="', list.id == curListId ? "current active" : "", '"><a href="javascript:void(0);" data-rfl-click="toggleListSubMenuItem" class="list-name"><span class="count" title="', list.customers, '" data-toggle="tooltip" data-container="body">', list.customers, "</span> <span>", $encodeHtml(list.name), '</span><span class="icon"><i class="icon-angle-down"></i><i class="icon-angle-up"></i></span></a><ul class="actions"><li><a href="html/customer/list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-dashboard"></i> Dashboard</a></li><li><a href="html/customer/import-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-upload-alt"></i> Import Customers</a></li><li><a href="javascript:void(0);" onclick="require(\'mod/nav-bar/init\').hideAppMenu();" data-rfl-click="appMenuCreateCampaign ', i, '"><i class="icon-envelope-alt"></i> Create Regular Campaign</a></li><li><a href="javascript:void(0);" onclick="require(\'mod/nav-bar/init\').hideAppMenu();" data-rfl-click="appMenuCreateCampaign ', i, ' absplit"><i class="icon-star-half-full"></i> Create AB Split Campaign</a></li><li><a href="html/campaign/list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-list"></i> Manage Campaigns</a></li><li><a href="html/customer/segment-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-sitemap"></i> ', langResourceCustomer.label.manageSegments, '</a></li><li><a href="html/customer/list-customer-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-user"></i> ', langResourceCustomer.label.manageCustomers, '</a></li><li><a href="html/customer/group-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-group"></i> ', langResourceCustomer.label.manageCustomerGroups, '</a></li><li><a href="html/customer/property-list-', G.LANG, ".html#!/", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-tags"></i> ', langResourceCustomer.label.manageProperties, "</a></li></ul></li>");
                    }
                    _$out_.push("</ul>");
                } else {
                    var list = lists[0];
                    _$out_.push('<ul class="actions"><li><a href="html/customer/import-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-upload-alt"></i> Import Customers</a></li><li><a href="javascript:void(0);" onclick="require(\'mod/nav-bar/init\').hideAppMenu();" data-rfl-click="appMenuCreateCampaign 0"><i class="icon-envelope-alt"></i> Create Regular Campaign</a></li><li><a href="javascript:void(0);" onclick="require(\'mod/nav-bar/init\').hideAppMenu();" data-rfl-click="appMenuCreateCampaign 0 absplit"><i class="icon-star-half-full"></i> Create AB Split Campaign</a></li><li><a href="html/campaign/list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-list"></i> Manage Campaigns</a></li><li><a href="html/customer/segment-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-sitemap"></i> Manage Segments</a></li><li><a href="html/customer/list-customer-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-user"></i> Manage Customers</a></li><li><a href="html/customer/group-list-', G.LANG, ".html#!", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-group"></i> Manage Customer Groups</a></li><li><a href="html/customer/property-list-', G.LANG, ".html#!/", list.id, '" onclick="require(\'mod/nav-bar/init\').hideAppMenu();"><i class="icon-tags"></i> Manage Properties</a></li></ul>');
                }
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', 'jquery', 'rfl', './list-menu.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var rfl = require('rfl');
	var mailTpl = require('./list-menu.tpl.html');

	var _listId = -1;
	var _lists = null;
	
	function _bindEvent() {
		rfl.Delegator.getPageDelegator().delegate('click', 'appMenuCreateCampaign', function(evt, i, type) {
			var list = _lists[i];
			rfl.util.toBase64({listId: list.id, listName: list.name}, function(res) {
				if(type) {
					rfl.util.gotoUrl('campaign/edit#!create/' + res + '/campaign//' + type);
				} else {
					rfl.util.gotoUrl('campaign/edit#!create/' + res + '/campaign//regular');
				}
			});
		}, 1);
		_bindEvent = rfl.empty;
	};

	function render(container, lists) {
		if(_listId === -1 || G.listId && G.listId != _listId) {
			_listId = G.listId;
			_lists = lists;
			_bindEvent();
			if(_listId && lists.length > 1) {
				$.each(_lists, function(i, list) {
					if(list.id == _listId) {
						_lists.unshift(_lists.splice(i, 1)[0]);
						return false;
					}
				});
			}
			$(container).html(mailTpl.render({lists: lists, curListId: G.listId}));
			$('.list-sub-menu .current .actions').show();
		}
	};
	
	return {
		render: render
	};
});

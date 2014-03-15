define("./make.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<div style="padding:10px;" contenteditable="true" data-setter="setContent">', content, "</div>");
            }
        })();
        return _$out_.join("");
    };
});

define("./view.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                _$out_.push('<div style="padding:10px;">', content, "</div>");
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', './make.tpl.html', './view.tpl.html', 'mod/template/Blockprint-main'], function(require) {
	var makeTpl = require('./make.tpl.html'),
		viewTpl = require('./view.tpl.html'),
		Blockprint = require('mod/template/Blockprint-main'),
		defaultBlockData = {
			blockType: "content",
			content: [
						'Anything you like to add.'
					].join("")
		},
		blockprint = new Blockprint(defaultBlockData, makeTpl, viewTpl);

	return {
		make: blockprint.make,
		view: blockprint.view,
		setter: {
			setContent: function(data){
				this.data.content = data;
			}
		}
	};
});
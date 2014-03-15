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
                _$out_.push('<h1 contenteditable="true" data-setter="setTitle" style=\'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #333333;\'>', title, "</h1>");
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
                _$out_.push("<h1 style='font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif; color: #333333;'>", title, "</h1>");
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
			blockType: "title",
			title: [
						'<span style="font-family:',
						"'Arial Black',Arial,arial-black;",
						'font-size:45px;line-height:50px;text-transform:uppercase;">Template Title</span>'
					].join("")
		},
		blockprint = new Blockprint(defaultBlockData, makeTpl, viewTpl);

	return {
		make: blockprint.make,
		view: blockprint.view,
		setter: {
			setTitle: function(data){
				this.data.title = data;
			}
		}
	};
});
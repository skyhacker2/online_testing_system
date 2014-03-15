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
                _$out_.push('<div contenteditable="true" data-setter="setTxt" style="min-height: 50px;">', txt, "</div>");
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
                _$out_.push("<div>", txt, "</div>");
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
			blockType: "navigation",
			txt: [
						'<div style="font-family:Lucida Grande,Arial,Helvetica,Geneva,Verdana,sans-serif;color:#666666;font-size:10px;line-height:1.5em">',
						'<a href="#" target="_blank">Home</a> &nbsp; | &nbsp;', 
						'<a href="#" target="_blank">App Store</a> &nbsp; | &nbsp; 800-xxxx-xxx &nbsp; | &nbsp;',
						'<a href="#" target="_blank">More App...</a>',
						'</div>'
					].join("")
		},
		blockprint = new Blockprint(defaultBlockData, makeTpl, viewTpl);

	return {
		make: blockprint.make,
		view: blockprint.view,
		setter: {
			setTxt: function(data){
				this.data.txt = data;
			}
		}
	};
});
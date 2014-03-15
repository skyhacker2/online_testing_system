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
                _$out_.push('<div style="padding:10px 0;width:100%;cursor:pointer;');
                if (align) {
                    _$out_.push("text-align:", align, ";");
                }
                _$out_.push('" class="buttonContainer" data-setter="setButton"><button style="-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;display:inline-block;border-width:1px;border-style:solid;border-color:#196394;background-color:#2E8CDE;-moz-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;-webkit-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;padding-top:8px;padding-bottom:8px;padding-left:20px;padding-right:20px;font-size:18px;font-family:Helvetica Neue, Helvetica, Arial, sans serif;text-shadow:0px -1px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px black;vertical-align:top;cursor:pointer;"><span style="color:#FFFFFF;">', $encodeHtml(txt), "</span></button></div>");
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
                _$out_.push('<div style="padding:10px 0;width:100%;');
                if (align) {
                    _$out_.push("text-align:", align, ";");
                }
                _$out_.push('"><a href="', href, '" style="-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5px;display:inline-block;border-width:1px;border-style:solid;border-color:#196394;background-color:#2E8CDE;-moz-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;-webkit-box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;box-shadow:0px 1px 1px rgba(0, 0, 0, 0.25), inset 0px 0px 0px white;padding-top:8px;padding-bottom:8px;padding-left:20px;padding-right:20px;font-size:18px;font-family:Helvetica Neue, Helvetica, Arial, sans serif;text-shadow:0px -1px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px black;vertical-align:top;text-decoration:none;" target="_blank"><span style="color:#FFFFFF;" data-setter="setTxt">', $encodeHtml(txt), "</span></a></div>");
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', './make.tpl.html', './view.tpl.html', 'mod/template/Blockprint-main', 'mod/template/button-main'], function(require) {
	var makeTpl = require('./make.tpl.html'),
		viewTpl = require('./view.tpl.html'),
		Blockprint = require('mod/template/Blockprint-main'),
		defaultBlockData = {
			blockType: "button",
			txt: 'Click to Change the Text',
			href: false,
			align: false
		},
		blockprint = new Blockprint(defaultBlockData, makeTpl, viewTpl);

	return {
		init: function(){
			require('mod/template/button-main').init();
		},
		make: blockprint.make,
		view: blockprint.view,
		setter: {
			setButton: function(data){
				data.txt && (this.data.txt = data.txt);
				data.href && (this.data.href = data.href);
				data.align && (this.data.align = data.align);
			}
		},
		callback: function(block){
			require(['mod/template/edit-button-main'], function(mod){
				mod.show(block);
			});
		}
	};
});
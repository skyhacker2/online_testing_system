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
                _$out_.push('<div class="dropImage" style="width: 100%;" data-setter="setImg">');
                if (img) {
                    _$out_.push("", img, '<p class="fix-btn" style="bottom:0px;width:100%"><a class="btn btn-primary" href="javascript:void(0);"><i class="icon-cloud-upload"></i> Upload</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="return false" class="edit"><i class="icon-link"></i> edit</a></p><div class="progress progress-striped active" style="display:none;position:absolute;bottom:50px;height:20px;width:100%"><div class="bar" style="width: 0%;"></div></div>');
                } else {
                    _$out_.push("", defaultImg, "");
                }
                _$out_.push('</div><div style="padding:10px;" contenteditable="true" data-setter="setTxt">', txt, "</div>");
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
                if (img) {
                    _$out_.push('<div style="width: 100%;">', img, "</div>");
                }
                _$out_.push('<div style="padding:10px;">', txt, "</div>");
            }
        })();
        return _$out_.join("");
    };
});

define("./default.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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
                if (dropFileSupported) {
                    _$out_.push('<div class="image"><i class="icon-picture icon-larger"></i><p>Drop or click to change image</p><a class="btn btn-primary" href="javascript:void(0);"><i class="icon-cloud"></i> Change</a></div>');
                } else {
                    _$out_.push('<div class="image"><i class="icon-picture icon-larger"></i><p>Click to change image</p><a class="btn btn-primary" href="javascript:void(0);"><i class="icon-cloud"></i> Change</a></div>');
                }
            }
        })();
        return _$out_.join("");
    };
});

define(['require', 'exports', 'module', './make.tpl.html', './view.tpl.html', './default.tpl.html', 'mod/template/Blockprint-main', 'mod/template/pic-main'], function(require) {
	var makeTpl = require('./make.tpl.html'),
		viewTpl = require('./view.tpl.html'),
		defaultTpl = require('./default.tpl.html'),
		Blockprint = require('mod/template/Blockprint-main'),
		dropFileSupported = 'File' in window && 'FormData' in window,
		defaultBlockData = {
			blockType: "top_img_bottom_text",
          	img: false,
			txt: '<p>Capture the text by click</p>'
		},
		defaultImg = defaultTpl.render({dropFileSupported: dropFileSupported}),
		blockprint = new Blockprint(defaultBlockData, makeTpl, viewTpl, {defaultImg: defaultImg});

	return {
		init: function(){
			require('mod/template/pic-main').init();
		},
		make: blockprint.make,
		view: blockprint.view,
		setter: {
			setTxt: function(data){
				this.data.txt = data;
			},
			setImg: function(data){
				var src = data.src,
					href = data.href,
					width = data.width,
					height = data.height,
					html = "";

				html += [
							'<img src="',
							src,
							'" '
						].join("");

				if(width){
					html += [
								'width="',
								100%//width,
								'" '
							].join("")
				}
				/*if(height){
					html += [
								'height="',
								height,
								'" '
							].join("");
				}*/
				html += "/>";

				if(href){
					html = [
								'<a href="',
								href,
								'" target="_blank">',
								html,
								'</a>'
							].join("");
				}

				this.data.img = html;
			}
		}
	};
});
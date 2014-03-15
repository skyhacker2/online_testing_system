define([ "require", "exports", "module", "rfl", "lang/" + G.LANG + "/common", "lang/" + G.LANG + "/group" ], function(require, exports, module) {
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
                var rfl = require("rfl");
                var langResourceCommon = require("lang/" + G.LANG + "/common");
                var langResourceGroup = require("lang/" + G.LANG + "/group");
                _$out_.push('<style type="text/css">.teacher-btn, .student-btn {position: absolute;}.teacher-btn {left: 0px;top: 150px;}.student-btn {left: 0px;top: 250px;}</style><div><a class="teacher-btn" href="javascript:void(0);" ><img src="');
                G.CGI_BASE;
                _$out_.push('img/mod/login/teacher-login.jpg" width="200px" height="60px"></a><a class="student-btn" href="javascript:void(0);"><img src="');
                G.CGI_BASE;
                _$out_.push('img/mod/login/student-login.jpg" width="200px" height="60px"></a><div>');
            }
        })();
        return _$out_.join("");
    };
});
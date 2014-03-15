define([ "require", "exports", "module" ], function(require, exports, module) {
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
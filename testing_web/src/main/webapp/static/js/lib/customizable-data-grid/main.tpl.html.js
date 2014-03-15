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
                var i, l, column, tempColumnData, locked, hidden, width;
                var defaultColumnWidth = 120;
                var lockedCount = 0;
                var lockedColumns = [];
                var scrollColumns = [];
                for (i = 0, l = columns.length; i < l; i++) {
                    column = columns[i];
                    tempColumnData = settingTempColumnData[column.id] || {};
                    locked = typeof tempColumnData.locked != "undefined" ? tempColumnData.locked : column.locked;
                    hidden = typeof tempColumnData.hidden != "undefined" ? tempColumnData.hidden : column.hidden;
                    width = tempColumnData.width || column.width || defaultColumnWidth;
                    if (locked) {
                        lockedCount++;
                        lockedColumns.push('<tr data-setting-row="', i, '" class="', hidden ? "data-grid-setting-row-hidden" : "", '"><td class="data-grid-setting-op-column">');
                        if (hidden) {
                            lockedColumns.push('<a data-setting-show="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-eye-close">&nbsp;</i></a> ');
                        } else {
                            lockedColumns.push('<a data-setting-hide="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-eye-open">&nbsp;</i></a> ');
                        }
                        lockedColumns.push('<a data-setting-unlock="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-lock"></i>&nbsp;</a> <a data-setting-up="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-arrow-up"></i>&nbsp;</a> <a data-setting-down="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-arrow-down"></i>&nbsp;</a></td><td class="data-grid-setting-name-column">', column.name, '</td><td class="data-grid-setting-width-column"><div class="data-grid-setting-width-bar" style="width: ', width, 'px;"></div><div class="form-inline"><span>', langResource.label.width, '</span> <a data-setting-width="100" href="javascript:void(0);" onclick="return false;" class="', width == 100 ? "data-grid-setting-width-on" : "", '">100</a> / <a data-setting-width="200" href="javascript:void(0);" onclick="return false;" class="', width == 200 ? "data-grid-setting-width-on" : "", '">200</a> / <a data-setting-width="300" href="javascript:void(0);" onclick="return false;" class="', width == 300 ? "data-grid-setting-width-on" : "", '">300</a> / <input class="data-setting-width-input" type="text" maxlength="3" value="', width, '" /></div></td></tr>');
                    } else {
                        scrollColumns.push('<tr data-setting-row="', i, '" class="', hidden ? "data-grid-setting-row-hidden" : "", '"><td class="data-grid-setting-op-column">');
                        if (hidden) {
                            scrollColumns.push('<a data-setting-show="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-eye-close">&nbsp;</i></a> ');
                        } else {
                            scrollColumns.push('<a data-setting-hide="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-eye-open">&nbsp;</i></a> ');
                        }
                        if (lockedCount >= MAX_LOCKED_COLUMNS) {
                            scrollColumns.push('&nbsp;<i class="icon-unlock"></i>&nbsp; ');
                        } else {
                            scrollColumns.push('<a data-setting-lock="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-unlock"></i>&nbsp;</a> ');
                        }
                        scrollColumns.push('<a data-setting-up="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-arrow-up"></i>&nbsp;</a> <a data-setting-down="', i, '" href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon-arrow-down"></i>&nbsp;</a></td><td class="data-grid-setting-name-column">', column.name, '</td><td class="data-grid-setting-width-column"><div class="data-grid-setting-width-bar" style="width: ', width, 'px;"></div><div class="form-inline"><span>', langResource.label.width, '</span> <a data-setting-width="100" href="javascript:void(0);" onclick="return false;" class="', width == 100 ? "data-grid-setting-width-on" : "", '">100</a> / <a data-setting-width="200" href="javascript:void(0);" onclick="return false;" class="', width == 200 ? "data-grid-setting-width-on" : "", '">200</a> / <a data-setting-width="300" href="javascript:void(0);" onclick="return false;" class="', width == 300 ? "data-grid-setting-width-on" : "", '">300</a> / <input class="data-setting-width-input" type="text" maxlength="3" value="', width, '" /></div></td></tr>');
                    }
                }
                _$out_.push("<h4>", langResource.label.lockedColumns, "</h4>");
                if (lockedColumns.length) {
                    _$out_.push('<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;"><tbody>', lockedColumns.join(""), "</tbody></table>");
                } else {
                    _$out_.push('<p class="data-grid-setting-no-data">', langResource.msg.noLockedColumns, "</p>");
                }
                _$out_.push("<h4>", langResource.label.unlockedColumns, "</h4>");
                if (scrollColumns.length) {
                    _$out_.push('<table cellspacing="0" cellpadding="0" border="0" style="width: 100%;"><tbody>', scrollColumns.join(""), "</tbody></table>");
                } else {
                    _$out_.push('<p class="data-grid-setting-no-data">', langResource.msg.noUnlockedColumns, "</p>");
                }
                _$out_.push("<h4>", langResource.label.height, '</h4><div class="form-inline data-grid-setting-height"><a data-setting-height="auto" href="javascript:void(0);" onclick="return false;" class="', !(tempHeight > 0) ? "data-grid-setting-height-on" : "", '">Auto</a> / <a data-setting-height="400" href="javascript:void(0);" onclick="return false;" class="', tempHeight == 400 ? "data-grid-setting-height-on" : "", '">400</a> / <a data-setting-height="500" href="javascript:void(0);" onclick="return false;" class="', tempHeight == 500 ? "data-grid-setting-height-on" : "", '">500</a> / <a data-setting-height="600" href="javascript:void(0);" onclick="return false;" class="', tempHeight == 600 ? "data-grid-setting-height-on" : "", '">600</a> / <input class="data-setting-height-input" type="text" maxlength="4" value="', tempHeight > 0 ? tempHeight : "", '" /></div><div class="data-grid-setting-footer"><button class="btn btn-sm btn-primary data-grid-setting-btn-apply">', langResource.label.applySetting, '</button> <button class="btn btn-sm btn-default data-grid-setting-btn-cancel">', langResource.label.cancel, "</button></div>");
            }
        })();
        return _$out_.join("");
    };
});
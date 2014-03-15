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
                var i, j, l, l2, column, columns, columnWidth, columnHeader, columnOffset;
                var scrollX = false;
                var scrollY = height > 0;
                var lockedTableWidth = 0;
                var scrollTableWidth = 0;
                var lockedDisplayColumns = [];
                var lockedColumnWidth = [];
                var lockedColumnHeader = [];
                var scrollDisplayColumns = [];
                var scrollColumnWidth = [];
                var scrollColumnHeader = [];
                var noWidthScrollColumns = [];
                for (i = 0, l = lockedColumns.length; i < l; i++) {
                    column = lockedColumns[i];
                    if (column.hidden) {
                        continue;
                    }
                    lockedDisplayColumns.push(column);
                    lockedTableWidth += column.width;
                    columnWidth = lockedColumnWidth;
                    columnHeader = lockedColumnHeader;
                    (function() {
                        with ($data) {
                            columnWidth.push('<colgroup><col style="width: ', column.width, 'px;"></colgroup>');
                            columnHeader.push('<th class="', column.type == "checkbox" ? "data-grid-checkbox-cell" : "", " ", i == l - 1 ? "data-grid-last-cell" : "", '"><div class="data-grid-cell-inner" style="text-align: ', column.textAlign || "left", ';">');
                            if (column.type == "checkbox") {
                                columnHeader.push('<label class="mockup-checkbox"><input class="data-grid-check-box-all" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                            } else {
                                columnHeader.push("");
                                if (column.headerRenderer) {
                                    columnHeader.push("", column.headerRenderer(column.name, i, column, sortColumnId, sortOrder), "");
                                } else if (column.sortable) {
                                    columnHeader.push('<a class="data-grid-sortable" data-column-id="', column.id, '" href="javascript:void(0);" onclick="return false" title="', $encodeHtml(column.name), '">', column.name, "", sortColumnId == column.id ? sortOrder == "desc" ? '<span class="data-grid-sort-arrow-down"></span>' : '<span class="data-grid-sort-arrow-up"></span>' : "", "</a>");
                                } else {
                                    columnHeader.push('<span title="', $encodeHtml(column.name), '">', column.name, "</span>");
                                }
                            }
                            columnHeader.push("</div></th>");
                        }
                    })();
                }
                for (i = 0, l = scrollColumns.length; i < l; i++) {
                    column = scrollColumns[i];
                    if (column.hidden) {
                        continue;
                    }
                    scrollDisplayColumns.push(column);
                    if (!column.width) {
                        noWidthScrollColumns.push(column);
                    } else {
                        scrollTableWidth += column.width;
                    }
                    columnWidth = scrollColumnWidth;
                    columnHeader = scrollColumnHeader;
                    (function() {
                        with ($data) {
                            columnWidth.push('<colgroup><col style="width: ', column.width, 'px;"></colgroup>');
                            columnHeader.push('<th class="', column.type == "checkbox" ? "data-grid-checkbox-cell" : "", " ", i == l - 1 ? "data-grid-last-cell" : "", '"><div class="data-grid-cell-inner" style="text-align: ', column.textAlign || "left", ';">');
                            if (column.type == "checkbox") {
                                columnHeader.push('<label class="mockup-checkbox"><input class="data-grid-check-box-all" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                            } else {
                                columnHeader.push("");
                                if (column.headerRenderer) {
                                    columnHeader.push("", column.headerRenderer(column.name, i, column, sortColumnId, sortOrder), "");
                                } else if (column.sortable) {
                                    columnHeader.push('<a class="data-grid-sortable" data-column-id="', column.id, '" href="javascript:void(0);" onclick="return false" title="', $encodeHtml(column.name), '">', column.name, "", sortColumnId == column.id ? sortOrder == "desc" ? '<span class="data-grid-sort-arrow-down"></span>' : '<span class="data-grid-sort-arrow-up"></span>' : "", "</a>");
                                } else {
                                    columnHeader.push('<span title="', $encodeHtml(column.name), '">', column.name, "</span>");
                                }
                            }
                            columnHeader.push("</div></th>");
                        }
                    })();
                }
                if (width > 0) {
                    if (noWidthScrollColumns.length) {
                        if (width - lockedTableWidth - scrollTableWidth < noWidthScrollColumns.length * DEFAULT_COLUMN_WIDTH) {
                            for (i = 0, l = noWidthScrollColumns.length; i < l; i++) {
                                noWidthScrollColumns[i].width = DEFAULT_COLUMN_WIDTH;
                            }
                            scrollTableWidth += noWidthScrollColumns.length * DEFAULT_COLUMN_WIDTH;
                            scrollColumnWidth = [];
                            for (i = 0, l = scrollDisplayColumns.length; i < l; i++) {
                                column = scrollDisplayColumns[i];
                                scrollColumnWidth.push('<colgroup><col style="width: ', column.width || DEFAULT_COLUMN_WIDTH, 'px;"></colgroup>');
                            }
                            scrollX = true;
                        } else {
                            width = "auto";
                        }
                    } else {
                        if (lockedTableWidth + scrollTableWidth > width) {
                            scrollX = true;
                        } else {
                            width = "auto";
                        }
                    }
                }
                _$out_.push('<div class="data-grid ', lockedDisplayColumns.length ? "data-grid-locked" : "", " ", bordered ? "data-grid-bordered" : "", " ", striped ? "data-grid-striped" : "", '" style="overflow: hidden;"><table border="0" cellspacing="0" cellpadding="0" style="width: 100%;"><tr>');
                if (lockedDisplayColumns.length) {
                    _$out_.push('<td style="width: ', lockedTableWidth, 'px;"><div class="data-grid-locked-columns" style="overflow: hidden;"><div class="data-grid-header"><table class="data-grid-table" border="0" cellspacing="0" cellpadding="0" style="width: ', lockedTableWidth, 'px;">', lockedColumnWidth.join(""), "<tbody><tr>", lockedColumnHeader.join(""), '</tr></tbody></table></div><div class="data-grid-body" style="', scrollX ? "overflow-x: scroll;" : "", " width: ", lockedTableWidth, "px; ", height > MIN_HEIGHT ? " height: " + height + "px;" : "", '"><table class="data-grid-table" border="0" cellspacing="0" cellpadding="0" style="width: ', lockedTableWidth, 'px;">', lockedColumnWidth.join(""), "<tbody>");
                    columnOffset = 0;
                    columns = lockedDisplayColumns;
                    (function() {
                        with ($data) {
                            var item, columnValue, displayValue, title;
                            for (i = 0, l = data.length; i < l; i++) {
                                item = dataProperty ? data[i][dataProperty] : data[i];
                                _$out_.push('<tr data-grid-row="', i, '" class="', i == l - 1 ? "data-grid-last-row" : "", " ", i % 2 === 0 ? "data-grid-row-odd" : "", '">');
                                for (j = 0, l2 = columns.length; j < l2; j++) {
                                    column = columns[j];
                                    _$out_.push('<td id="data-grid-', name, "-cell-", i, "-", j + columnOffset, '" class="', column.type == "sequence" ? "data-grid-sequence-cell" : column.type == "checkbox" ? "data-grid-checkbox-cell" : "", " ", j == l2 - 1 ? "data-grid-last-cell" : "", '">');
                                    columnValue = item[column.id] == null ? "" : item[column.id];
                                    if (column.renderer) {
                                        displayValue = column.renderer(item[column.id], i, item, j + columnOffset, column);
                                    } else {
                                        displayValue = $encodeHtml(columnValue);
                                    }
                                    if (column.titleRenderer) {
                                        title = column.titleRenderer(item[column.id], i, item, j + columnOffset, column);
                                    } else if (typeof column.title != "undefined") {
                                        title = column.title;
                                    } else {
                                        title = columnValue;
                                    }
                                    _$out_.push('<div class="data-grid-cell-inner" title="', $encodeHtml(title), '" style="text-align: ', column.textAlign || "left", ';">');
                                    if (column.type == "sequence") {
                                        _$out_.push("", i + 1, "");
                                    } else if (column.type == "checkbox") {
                                        if (checkbox && checkbox.checkable) {
                                            if (checkbox.checkable(item, i)) {
                                                _$out_.push('<label class="mockup-checkbox"><input class="data-grid-check-box" data-row-index="', i, '" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                                            } else {
                                                _$out_.push('<label class="mockup-checkbox disabled"><input type="checkbox" disabled /><span><i class="icon-ok"></i></span></label>');
                                            }
                                        } else {
                                            _$out_.push('<label class="mockup-checkbox"><input class="data-grid-check-box" data-row-index="', i, '" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                                        }
                                    } else {
                                        _$out_.push("", displayValue, "");
                                    }
                                    _$out_.push("</div></td>");
                                }
                                _$out_.push("</tr>");
                            }
                        }
                    })();
                    _$out_.push("</tbody></table></div></div></td>");
                }
                if (scrollDisplayColumns.length) {
                    _$out_.push('<td><div class="data-grid-columns"><div class="data-grid-header" style="', scrollY ? "overflow-y: scroll;" : "", ' width: 100%;"><table class="data-grid-table" border="0" cellspacing="0" cellpadding="0" style="width: ', width > lockedTableWidth ? width - lockedTableWidth + "px" : "100%", ';">', scrollColumnWidth.join(""), "<tbody><tr>", scrollColumnHeader.join(""), '</tr></tbody></table></div><div class="data-grid-body" style="', height > MIN_HEIGHT ? "overflow-y: scroll; height: " + height + "px;" : "", " ", scrollX ? "overflow-x: scroll;" : "", ' width: 100%;"><table class="data-grid-table" border="0" cellspacing="0" cellpadding="0" style="width: ', width > lockedTableWidth ? width - lockedTableWidth + "px" : "100%", ';">', scrollColumnWidth.join(""), "<tbody>");
                    columnOffset = lockedDisplayColumns.length;
                    columns = scrollDisplayColumns;
                    (function() {
                        with ($data) {
                            var item, columnValue, displayValue, title;
                            for (i = 0, l = data.length; i < l; i++) {
                                item = dataProperty ? data[i][dataProperty] : data[i];
                                _$out_.push('<tr data-grid-row="', i, '" class="', i == l - 1 ? "data-grid-last-row" : "", " ", i % 2 === 0 ? "data-grid-row-odd" : "", '">');
                                for (j = 0, l2 = columns.length; j < l2; j++) {
                                    column = columns[j];
                                    _$out_.push('<td id="data-grid-', name, "-cell-", i, "-", j + columnOffset, '" class="', column.type == "sequence" ? "data-grid-sequence-cell" : column.type == "checkbox" ? "data-grid-checkbox-cell" : "", " ", j == l2 - 1 ? "data-grid-last-cell" : "", '">');
                                    columnValue = item[column.id] == null ? "" : item[column.id];
                                    if (column.renderer) {
                                        displayValue = column.renderer(item[column.id], i, item, j + columnOffset, column);
                                    } else {
                                        displayValue = $encodeHtml(columnValue);
                                    }
                                    if (column.titleRenderer) {
                                        title = column.titleRenderer(item[column.id], i, item, j + columnOffset, column);
                                    } else if (typeof column.title != "undefined") {
                                        title = column.title;
                                    } else {
                                        title = columnValue;
                                    }
                                    _$out_.push('<div class="data-grid-cell-inner" title="', $encodeHtml(title), '" style="text-align: ', column.textAlign || "left", ';">');
                                    if (column.type == "sequence") {
                                        _$out_.push("", i + 1, "");
                                    } else if (column.type == "checkbox") {
                                        if (checkbox && checkbox.checkable) {
                                            if (checkbox.checkable(item, i)) {
                                                _$out_.push('<label class="mockup-checkbox"><input class="data-grid-check-box" data-row-index="', i, '" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                                            } else {
                                                _$out_.push('<label class="mockup-checkbox disabled"><input type="checkbox" disabled /><span><i class="icon-ok"></i></span></label>');
                                            }
                                        } else {
                                            _$out_.push('<label class="mockup-checkbox"><input class="data-grid-check-box" data-row-index="', i, '" type="checkbox" /><span><i class="icon-ok"></i></span></label>');
                                        }
                                    } else {
                                        _$out_.push("", displayValue, "");
                                    }
                                    _$out_.push("</div></td>");
                                }
                                _$out_.push("</tr>");
                            }
                        }
                    })();
                    _$out_.push("</tbody></table></div></div></td>");
                }
                _$out_.push("</tr></table></div>");
            }
        })();
        return _$out_.join("");
    };
});
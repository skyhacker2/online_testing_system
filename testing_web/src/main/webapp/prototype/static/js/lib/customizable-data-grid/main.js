define("../data-grid/main.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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

define('../data-grid/main', ['require', 'exports', 'module', 'jquery', './main.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var mainTpl = require('./main.tpl.html');
	
	var DataGrid = function(holder, columns, opt) {
		var self = this;
		opt = opt || {};
		this._opt = opt;
		this._name = opt.name || 'x';
		this._width = opt.width;
		this._height = opt.height;
		this._holder = $(holder);
		this._container = $('<div></div>').appendTo(holder);
		this._allColumns = [];
		this._defaultLockedColumns = [];
		this._lockedColumns = [];
		this._scrollColumns = [];
		this._data = [];
		this._lockedBody = null;
		this._scrollHeader = null;
		this._scrollBody = null;
		this._toRefResize = null;
		this._sortColumnId = opt.sortColumnId || '';
		this._sortOrder = opt.sortOrder || '';
		this._bind = {
			scroll: function(evt) {return self._onScroll(evt);},
			resize: function(evt) {return self._onResize(evt);}
		};
		this.setColumns(columns);
		this._bindEvent();
	};
	
	$.extend(DataGrid.prototype, {
		_MAX_LOCKED_COLUMNS: 3,
		_MIN_COLUMN_WIDTH: 34,
		_MAX_COLUMN_WIDTH: 999,
		_MAX_LOCKED_COLUMN_WIDTH: 300,
		_DEFAULT_COLUMN_WIDTH: 200,
		_MIN_HEIGHT: 100,

		_onScroll: function(evt) {
			var target = evt.target;
			if(this._lockedBody) {
				this._lockedBody.scrollTop = target.scrollTop;
			}
			if(this._scrollHeader) {
				this._scrollHeader.scrollLeft = target.scrollLeft;
			}
		},

		_onResize: function(evt) {
			var self = this;
			clearTimeout(this._toRefResize);
			this._toRefResize = setTimeout(function() {
				self.resize();
			}, 200);
		},

		_clientSort: function(columnId, sortOrder) {
			var dataProperty = this._opt.dataProperty;
			this._data.sort(function(a, b) {
				if(dataProperty) {
					a = a[dataProperty];
					b = b[dataProperty];
				}
				if(sortOrder == 'asc') {
					return a[columnId] > b[columnId] ? 1 : -1;
				} else {
					return b[columnId] > a[columnId] ? 1 : -1;
				}
			});
			this._sortOrder = sortOrder;
			this._sortColumnId = columnId;
			this.render();
		},

		_bindEvent: function() {
			var self = this;
			this._container.delegate('a.data-grid-sortable', 'click', function(evt) {
				var columnId = $(this).data('column-id');
				var sortOrder = $('.data-grid-sort-arrow-down', this).length ? 'asc' : 'desc';
				if(self._opt.onSort) {
					self._opt.onSort(columnId, sortOrder, function(data) {
						if(data) {
							self._sortOrder = sortOrder;
							self._sortColumnId = columnId;
							self.render(data);
						}
					});
				} else {
					self._clientSort(columnId, sortOrder);
				}
			}).delegate('[data-grid-row]', 'mouseenter', function(evt) {
				$('[data-grid-row]', self._container).removeClass('data-grid-row-hl');
				$('[data-grid-row="' + $(this).data('grid-row') + '"]', self._container).addClass('data-grid-row-hl');
			}).delegate('[data-grid-row]', 'mouseleave', function(evt) {
				$('[data-grid-row="' + $(this).data('grid-row') + '"]', self._container).removeClass('data-grid-row-hl');
			}).delegate('.data-grid-check-box, .data-grid-check-box-all', 'click', function(evt) {
				var rowIndex = $(this).data('row-index');
				var allChecked = true;
				if(!(rowIndex >= 0)) {//all
					if(this.checked) {
						$('.data-grid-check-box', self._container).each(function(i, item) {
							item.checked = true;
							$(item).closest('.mockup-checkbox').addClass('on');
						});
					} else {
						$('.data-grid-check-box', self._container).each(function(i, item) {
							item.checked = false;
							$(item).closest('.mockup-checkbox').removeClass('on');
						});
					}
				} else {
					if(this.checked) {
						$('.data-grid-check-box[data-row-index]', self._container).each(function(i, item) {
							if(!item.checked) {
								allChecked = false;
								return false;
							}
						});
						if(allChecked) {
							$('.data-grid-check-box-all', self._container)[0].checked = true;
							$('.data-grid-check-box-all', self._container).closest('.mockup-checkbox').addClass('on');
						}
					} else {
						$('.data-grid-check-box-all', self._container)[0].checked = false;
						$('.data-grid-check-box-all', self._container).closest('.mockup-checkbox').removeClass('on');
					}
				}
				if(self._opt.onSelect) {
					self._opt.onSelect(rowIndex, this.checked, rowIndex >= 0 && self._data[rowIndex] || undefined);
				}
			});
			if(this._width == 'auto') {
				$(window).on('resize', this._bind.resize);
			}
		},

		_unbindEvent: function() {
			this._container.undelegate();
			if(this._width == 'auto') {
				$(window).off('resize', this._bind.resize);
			}
		},

		setColumns: function(columns) {
			var self = this;
			var checkbox = this._opt.checkbox;
			var sequence = this._opt.sequence;
			var lockedCount = 0;
			this._allColumns = columns || [];
			this._defaultLockedColumns = [];
			this._lockedColumns = [];
			this._scrollColumns = [];
			if(checkbox) {
				this._defaultLockedColumns.unshift({
					type: 'checkbox',
					width: checkbox.width || this._MIN_COLUMN_WIDTH,
					textAlign: 'center',
					locked: true
				});
			}
			if(sequence) {
				this._defaultLockedColumns.unshift({
					name: sequence.name || '',
					type: 'sequence',
					width: sequence.width || this._MIN_COLUMN_WIDTH,
					textAlign: 'center',
					locked: true
				});
			}
			$.each(this._allColumns, function(i, column) {
				column.width = parseInt(column.width) || 0;
				if(column.width > 0) {
					column.width = Math.min(Math.max(column.width, self._MIN_COLUMN_WIDTH), self._MAX_COLUMN_WIDTH);
				}
				if(column.locked && lockedCount < self._MAX_LOCKED_COLUMNS) {
					column.width = column.width || self._DEFAULT_COLUMN_WIDTH;
					column.width = Math.min(column.width, self._MAX_LOCKED_COLUMN_WIDTH);
					self._lockedColumns.push(column);
					lockedCount++;
				} else {
					column.locked = false;
					self._scrollColumns.push(column);
				}
			});
		},

		getAllColumns: function() {
			return this._lockedColumns.concat(this._scrollColumns);
		},

		getLockedColumns: function() {
			return this._lockedColumns.concat();
		},

		getScrollColumns: function() {
			return this._scrollColumns.concat();
		},

		getSelectedData: function(dataProperty, columnId) {
			var self = this;
			var res = [];
			$('.data-grid-check-box', this._container).each(function(i, item) {
				var index = $(this).data('row-index');
				if(item.checked) {
					if(dataProperty) {
						res.push(columnId ? self._data[index][dataProperty][columnId] : self._data[index][dataProperty]);
					} else {
						res.push(columnId ? self._data[index][columnId] : self._data[index]);
					}
				}
			});
			return res;
		},

		getDataByRowIndex: function(rowIndex, dataProperty, columnId) {
			var res = this._data[rowIndex];
			if(!res) {
				return null;
			}
			if(dataProperty) {
				res = columnId ? res[dataProperty][columnId] : res[dataProperty];
			} else {
				res = columnId ? res[columnId] : res;
			}
			return res;
		},

		hightLightRow: function(index, className) {
			$('[data-grid-row="' + index + '"]', this._container).addClass(className || 'data-grid-row-error');
		},

		dehightLightRows: function(className) {
			$('[data-grid-row]', this._container).removeClass(className || 'data-grid-row-error');
		},

		resize: function(width, height) {
			if(width == 'auto' && this._width != 'auto') {
				$(window).on('resize', this._bind.resize);
			} else if(width && width != 'auto' && this._width == 'auto') {
				$(window).off('resize', this._bind.resize);
			}
			this._width = width || this._width;
			this._height = height || this._height;
			this.render();
		},

		render: function(data) {
			this._data = data || this._data;
			if(!this._data.length) {
				return;
			}
			if(this._opt.onBeforeRender) {
				this._opt.onBeforeRender();
			}
			if(this._scrollBody) {
				this._scrollBody.off('scroll', this._bind.scroll);
			}
			this._lockedBody = null;
			this._scrollHeader = null;
			this._scrollBody = null;
			this._container.html(mainTpl.render({
				MIN_HEIGHT: this._MIN_HEIGHT,
				DEFAULT_COLUMN_WIDTH: this._DEFAULT_COLUMN_WIDTH,
				name: this._name,
				width: this._width == 'auto' ? this._holder.width() : this._width,
				height: this._height,
				lockedColumns: this._defaultLockedColumns.concat(this._lockedColumns),
				scrollColumns: this._scrollColumns,
				bordered: this._opt.bordered,
				striped: this._opt.striped,
				sortColumnId: this._sortColumnId,
				sortOrder: this._sortOrder,
				checkbox: this._opt.checkbox,
				data: this._data,
				dataProperty: this._opt.dataProperty
			}));
			this._lockedBody = $('.data-grid-locked-columns .data-grid-body', this._container)[0];
			this._scrollHeader = $('.data-grid-columns .data-grid-header', this._container)[0];
			this._scrollBody = $('.data-grid-columns .data-grid-body', this._container);
			this._scrollBody.on('scroll', this._bind.scroll);
		},

		destroy: function() {
			if(this._scrollBody) {
				this._scrollBody.off('scroll', this._bind.scroll);
			}
			this._unbindEvent();
			this._container.remove();
			this._container = null;
			this._lockedBody = null;
			this._scrollHeader = null;
			this._scrollBody = null;
		}
	});
	
	return DataGrid;
});


define("./main.tpl.html", [ "require", "exports", "module" ], function(require, exports, module) {
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

define(['require', 'exports', 'module', 'jquery', '../data-grid/main', './main.tpl.html'], function(require) {
	var $ = require('jquery') || jQuery;
	var DataGrid = require('../data-grid/main');
	var mainTpl = require('./main.tpl.html');
	
	var CustomizableDataGrid = function(holder, columns, opt) {
		var self = this;
		opt = opt || {};
		opt.sequence = opt.sequence || true;
		this._settingTempHeight = opt.height;
		this._settingTempColumnData = {};
		this._settingTempColumnOrders = [];
		this._settingContainer = $('<div class="data-grid-setting-wrapper" style="display: none;"></div>').appendTo(holder);
		this._settingBtn = $('<a class="data-grid-setting-btn-show" href="javascript:void(0);" onclick="return false;"><i class="icon-cog"></i></a>').appendTo(holder);
		this._settingBind = {
			settingBtnClick: function(evt) {return self._showSettingPanel(evt);}
		}
		DataGrid.call(this, holder, columns, opt);
		$(holder).css('position') == 'static' && $(holder).css('position', 'relative');
	};
	
	$.extend(CustomizableDataGrid.prototype, DataGrid.prototype, {
		_langResourceSetting: {
			label: {
				lockedColumns: 'Locked Columns',
				unlockedColumns: 'Unlocked Columns',
				width: 'Width',
				height: 'Height',
				applySetting: 'Apply this setting',
				cancel: 'Cancel'
			},
			msg: {
				noLockedColumns: 'No locked columns',
				noUnlockedColumns: 'No unlocked columns'
			}
		},
		
		_renderSettingPanel: function() {
			this._settingContainer.html(mainTpl.render({
				MAX_LOCKED_COLUMNS: this._MAX_LOCKED_COLUMNS,
				langResource: this._opt.langResource || this._langResourceSetting,
				tempHeight: this._settingTempHeight,
				settingTempColumnData: this._settingTempColumnData, 
				columns: this._settingTempColumnOrders
			}));
		},

		_showSettingPanel: function(evt) {
			this._settingTempColumnOrders = this.getAllColumns();
			this._settingBtn.hide();
			this._renderSettingPanel();
			this._settingContainer.fadeIn();
			if(this._opt.onSettingShow) {
				this._opt.onSettingShow();
			}
		},

		_hideSettingPanel: function(evt) {
			this._settingTempColumnData = {};
			this._settingTempColumnOrders = [];
			this._settingContainer.slideUp();
			this._settingBtn.show();
			if(this._opt.onSettingHide) {
				this._opt.onSettingHide();
			}
		},

		_getColumnProperty: function(column, propName) {
			var tempData;
			if(typeof column == 'number') {
				column = this._settingTempColumnOrders[column];
			}
			tempData = this._settingTempColumnData[column.id] || {};
			if(typeof tempData[propName] != 'undefined') {
				return tempData[propName];
			} else {
				return column[propName];
			}
		},

		_sortSettingTempColumnOrders: function() {
			var self = this;
			var lockedColumns = [];
			var scrollColumns = [];
			$.each(this._settingTempColumnOrders, function(i, column) {
				if(self._getColumnProperty(column, 'locked')) {
					lockedColumns.push(column);
				} else {
					scrollColumns.push(column);
				}
			});
			this._settingTempColumnOrders = lockedColumns.concat(scrollColumns);
		},

		_bindEvent: function() {
			var self = this;
			DataGrid.prototype._bindEvent.call(this);
			this._settingBtn.on('click', this._settingBind.settingBtnClick);
			this._settingContainer.delegate('.data-grid-setting-btn-cancel', 'click', function(evt) {
				self._hideSettingPanel();
			}).delegate('.data-grid-setting-btn-apply', 'click', function(evt) {
				$.each(self._settingTempColumnOrders, function(i, column) {
					var tempData = self._settingTempColumnData[column.id] || {};
					if(typeof tempData.locked != 'undefined') {
						column.locked = tempData.locked;
					}
					if(typeof tempData.hidden != 'undefined') {
						column.hidden = tempData.hidden;
					}
					if(typeof tempData.width != 'undefined') {
						column.width = tempData.width;
					}
				});
				self._height = self._settingTempHeight;
				self.setColumns(self._settingTempColumnOrders);
				self.render();
				self._hideSettingPanel();
				if(self._opt.onSettingApply) {
					self._opt.onSettingApply({height: self._height, columns: self.getAllColumns()});
				}
			}).delegate('[data-setting-show]', 'click', function(evt) {
				var i = $(this).data('setting-show');
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				tempData.hidden = false;
				self._renderSettingPanel();
			}).delegate('[data-setting-hide]', 'click', function(evt) {
				var i = $(this).data('setting-hide');
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				tempData.hidden = true;
				self._renderSettingPanel();
			}).delegate('[data-setting-lock]', 'click', function(evt) {
				var i = $(this).data('setting-lock');
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				tempData.locked = true;
				self._sortSettingTempColumnOrders();
				self._renderSettingPanel();
			}).delegate('[data-setting-unlock]', 'click', function(evt) {
				var i = $(this).data('setting-unlock');
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				tempData.locked = false;
				self._sortSettingTempColumnOrders();
				self._renderSettingPanel();
			}).delegate('[data-setting-up]', 'click', function(evt) {
				var i = $(this).data('setting-up');
				var column, exchangedColumn;
				if(i === 0) {
					return;
				}
				column = self._settingTempColumnOrders[i];
				exchangedColumn = self._settingTempColumnOrders[i - 1];
				if(!!self._getColumnProperty(column, 'locked') == !!self._getColumnProperty(exchangedColumn, 'locked')) {
					self._settingTempColumnOrders[i] = exchangedColumn;
					self._settingTempColumnOrders[i - 1] = column;
					self._renderSettingPanel();
				}
			}).delegate('[data-setting-down]', 'click', function(evt) {
				var i = $(this).data('setting-down');
				var column, exchangedColumn;
				if(i >= self._settingTempColumnOrders.length - 1) {
					return;
				}
				column = self._settingTempColumnOrders[i];
				exchangedColumn = self._settingTempColumnOrders[i + 1];
				if(!!self._getColumnProperty(column, 'locked') == !!self._getColumnProperty(exchangedColumn, 'locked')) {
					self._settingTempColumnOrders[i] = exchangedColumn;
					self._settingTempColumnOrders[i + 1] = column;
					self._renderSettingPanel();
				}
			}).delegate('[data-setting-width]', 'click', function(evt) {
				if($(this).hasClass('data-grid-setting-width-on')) {
					return;
				}
				var i = $(this).closest('[data-setting-row]').data('setting-row');
				var width = $(this).data('setting-width');
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				tempData.width = width;
				self._renderSettingPanel();
			}).delegate('.data-setting-width-input', 'blur', function(evt) {
				var i = $(this).closest('[data-setting-row]').data('setting-row');
				var width = parseInt(this.value);
				var column = self._settingTempColumnOrders[i];
				var tempData = self._settingTempColumnData[column.id] = self._settingTempColumnData[column.id] || {};
				var locked = self._getColumnProperty(column, 'locked');
				var oldWidth = self._getColumnProperty(column, 'width');
				if(width != oldWidth) {
					if(!width) {
						width = oldWidth;
					} else if(width > self._MAX_COLUMN_WIDTH) {
						width = self._MAX_COLUMN_WIDTH;
					} else if(width < self._MIN_COLUMN_WIDTH) {
						width = self._MIN_COLUMN_WIDTH;
					}
					if(locked && width > self._MAX_LOCKED_COLUMN_WIDTH) {
						width = self._MAX_LOCKED_COLUMN_WIDTH;
					}
					tempData.width = width;
					self._renderSettingPanel();
				}
			}).delegate('[data-setting-height]', 'click', function(evt) {
				if($(this).hasClass('data-grid-setting-height-on')) {
					return;
				}
				var height = $(this).data('setting-height');
				self._settingTempHeight = height;
				self._renderSettingPanel();
			}).delegate('.data-setting-height-input', 'blur', function(evt) {
				var height = parseInt(this.value);
				if(!(height > self._MIN_HEIGHT)) {
					if(height > 0) {
						this.value = self._MIN_HEIGHT;
					} else if(self._settingTempHeight > 0) {
						this.value = self._settingTempHeight;
					} else {
						this.value = '';
					}
					return;
				}
				if(height != self._settingTempHeight) {
					self._settingTempHeight = height;
					self._renderSettingPanel();
				}
			});
		},

		_unbindEvent: function() {
			DataGrid.prototype._unbindEvent.call(this);
			this._settingBtn.off('click', this._settingBind.settingBtnClick);
			this._settingContainer.undelegate();
		},

		destroy: function() {
			DataGrid.prototype.destroy.call(this);
			this._settingContainer.remove();
			this._settingBtn.remove();
			this._settingContainer = null;
			this._settingContainer = null;
		}
	});
	
	return CustomizableDataGrid;
});

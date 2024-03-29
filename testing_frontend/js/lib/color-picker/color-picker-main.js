﻿define(function(){

var $ = require("jquery");

$.fn.simpleColorPicker = function(options, dialog) {
    var defaults = {
        colorsPerLine: 18,
        colors: [
            '#990033', '#ff3366', '#cc0033', '#ff0033', '#ff9999', '#cc3366', '#ffccff', '#cc6699',
            '#993366', '#660033', '#cc3399', '#ff99cc', '#ff66cc', '#ff99ff', '#ff6699', '#cc0066',
            '#ff0066', '#ff3399', '#ff0099', '#ff33cc', '#ff00cc', '#ff66ff', '#ff33ff', '#ff00ff',
            '#cc0099', '#990066', '#cc66cc', '#cc33cc', '#cc99ff', '#cc66ff', '#cc33ff', '#993399',
            '#cc00cc', '#cc00ff', '#9900cc', '#990099', '#cc99cc', '#996699', '#663366', '#660099',
            '#9933cc', '#660066', '#9900ff', '#9933ff', '#9966cc', '#330033', '#663399', '#6633cc',
            '#6600cc', '#9966ff', '#330066', '#6600ff', '#6633ff', '#ccccff', '#9999ff', '#9999cc',
            '#6666cc', '#6666ff', '#666699', '#333366', '#333399', '#330099', '#3300cc', '#3300ff',
            '#3333ff', '#3333cc', '#0066ff', '#0033ff', '#3366ff', '#3366cc', '#000066', '#000033',
            '#0000ff', '#000099', '#0033cc', '#0000cc', '#336699', '#0066cc', '#99ccff', '#6699ff',
            '#003366', '#6699cc', '#006699', '#3399cc', '#0099cc', '#66ccff', '#3399ff', '#003399',
            '#0099ff', '#33ccff', '#00ccff', '#99ffff', '#66ffff', '#33ffff', '#00ffff', '#00cccc',
            '#009999', '#669999', '#99cccc', '#ccffff', '#33cccc', '#66cccc', '#339999', '#336666',
            '#006666', '#003333', '#00ffcc', '#33ffcc', '#33cc99', '#00cc99', '#66ffcc', '#99ffcc',
            '#00ff99', '#339966', '#006633', '#336633', '#669966', '#66cc66', '#99ff99', '#66ff66',
            '#339933', '#99cc99', '#66ff99', '#33ff99', '#33cc66', '#00cc66', '#66cc99', '#009966',
            '#009933', '#33ff66', '#00ff66', '#ccffcc', '#ccff99', '#99ff66', '#99ff33', '#00ff33',
            '#33ff33', '#00cc33', '#33cc33', '#66ff33', '#00ff00', '#66cc33', '#006600', '#003300',
            '#009900', '#33ff00', '#66ff00', '#99ff00', '#66cc00', '#00cc00', '#33cc00', '#339900',
            '#99cc66', '#669933', '#99cc33', '#336600', '#669900', '#99cc00', '#ccff66', '#ccff33',
            '#ccff00', '#999900', '#cccc00', '#cccc33', '#333300', '#666600', '#999933', '#cccc66',
            '#666633', '#999966', '#cccc99', '#ffffcc', '#ffff99', '#ffff66', '#ffff33', '#ffff00',
            '#ffcc00', '#ffcc66', '#ffcc33', '#cc9933', '#996600', '#cc9900', '#ff9900', '#cc6600',
            '#993300', '#cc6633', '#663300', '#ff9966', '#ff6633', '#ff9933', '#ff6600', '#cc3300',
            '#996633', '#330000', '#663333', '#996666', '#cc9999', '#993333', '#cc6666', '#ffcccc',
            '#ff3333', '#cc3333', '#ff6666', '#660000', '#990000', '#cc0000', '#ff0000', '#ff3300',
            '#cc9966', '#ffcc99', '#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000'
        ], 
        showEffect: '',
        hideEffect: '',
        onChangeColor: false,
        onShow: false
    };

    var opts = $.extend(defaults, options);

    return this.each(function() {
        var txt = $(this);

        var colorsMarkup = '';

        var prefix = txt.attr('id').replace(/-/g, '') + '_';

        for(var i = 0; i < opts.colors.length; i++){
            var item = opts.colors[i];

            var breakLine = '';
            if (i % opts.colorsPerLine == 0)
                breakLine = 'clear: both; ';

            if (i > 0 && breakLine && $.browser && $.browser.msie && $.browser.version <= 7) {
                breakLine = '';
                colorsMarkup += '<li style="float: none; clear: both; overflow: hidden; background-color: #fff; display: block; height: 1px; line-height: 1px; font-size: 1px; margin-bottom: -2px;"></li>';
            }

            colorsMarkup += '<li id="' + prefix + 'color-' + i + '" class="color-box" style="' + breakLine + 'background-color: ' + item + '" title="' + item + '"></li>';
        }

        var box = $('<div id="' + prefix + 'color-picker" class="color-picker" style="position: fixed; left: 0px; top: 0px;"><ul>' + colorsMarkup + '</ul><div style="clear: both;"></div></div>');
        $('body').append(box);
        box.hide();

        box.find('li.color-box').click(function() {
            if (txt.is('input')) {
              txt.val(opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
              txt.blur();
            }
            if ($.isFunction(defaults.onChangeColor)) {
              defaults.onChangeColor.call(txt, opts.colors[this.id.substr(this.id.indexOf('-') + 1)]);
            }
            hideBox(box);
        });

        dialog.on('click', function() {
            hideBox(box);
        });

        box.click(function(event) {
            event.stopPropagation();
        });

        var positionAndShowBox = function(box) {
          var pos = txt.offset();
          var left = pos.left + txt.outerWidth() - box.outerWidth();
          if (left < pos.left) left = pos.left;
          box.css({ left: left, top: (pos.top + txt.outerHeight() - $(document).scrollTop()) });
          showBox(box);
        }

        txt.click(function(event) {
          event.stopPropagation();
          if (!txt.is('input')) {
            // element is not an input so probably a link or div which requires the color box to be shown
            positionAndShowBox(box);
          }
        });

        txt.focus(function() {
          positionAndShowBox(box);
        });

        function hideBox(box) {
            if (opts.hideEffect == 'fade')
                box.fadeOut();
            else if (opts.hideEffect == 'slide')
                box.slideUp();
            else
                box.hide();
        }

        function showBox(box) {
            opts.onShow && opts.onShow();

            if (opts.showEffect == 'fade')
                box.fadeIn();
            else if (opts.showEffect == 'slide')
                box.slideDown();
            else
                box.show();
        }
    });
};


});


define(function(require) {
	var $ = require('jquery') || jQuery;

	return function(item) {
		var passed, data;
		item = $(item)[0];
		if(!$.trim(item.value)) {
			return true;
		}
		item.value = item.value.toLowerCase()
			.replace(/\s*\n\s*/g, '\n')
			.replace(/,/g, ';')
			.replace(/;*\n;*/g, '\n')
			.replace(/(\s*;\s*)+/mg, '; ')
			.replace(/^(;\s*)+|^\n+|(;\s*)+$|\n+$/g, '');
		item.value = $.trim(item.value);
		data = item.value.split(/; |\n/);
		$.each(data, function(i, val) {
			passed = (/^([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z0-9\-]{1,63}$/).test(val);
			return passed;
		});
		return {
			passed: passed,
			data: data
		};
	};
});

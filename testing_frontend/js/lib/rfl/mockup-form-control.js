define(function(require) {
	var $ = require('jquery');
	var events = require('./events');
	
	var mockupFormControl = {};
	
	mockupFormControl.setCheckbox = function(name, checked) {
		var item = $('input[name="' + name + '"], input[data-name="' + name + '"]')[0];
		if(checked) {
			item.checked = true;
			$(item.parentNode).addClass('on');
		} else {
			item.checked = false;
			$(item.parentNode).removeClass('on');
		}
	};
	
	mockupFormControl.setRadio = function(name, value) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		items.parent().removeClass('on');
		items.each(function(i, item) {
			if(item.value == value) {
				item.checked = true;
				$(item.parentNode).addClass('on');
			} else {
				item.checked = false;
			}
		});
	};
	
	mockupFormControl.isCheckboxOn = function(name) {
		var item = $('input[name="' + name + '"], input[data-name="' + name + '"]')[0];
		return item && item.checked;
	};
	
	mockupFormControl.getRadioValue = function(name) {
		var value;
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		items.each(function(i, item) {
			if(item.checked) {
				value = item.value;
				return false;
			}
		});
		return value;
	};

	mockupFormControl.toggleCheckAll = function (checkbox, name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		if (checkbox.checked) {
			items.parent().addClass('on');
		} else {
			items.parent().removeClass('on');
		}
		
		items.each(function(i, item) {
			item.checked = checkbox.checked;
		});
	}

	mockupFormControl.getSelectedCheckboxCount = function (name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		var count = 0;
		items.each(function(i, item) {
			if (item.checked) {
				count += 1;
			}
		});
		return count;
	}

	mockupFormControl.getSelectedCheckboxValue = function (name) {
		var items = $('input[name="' + name + '"], input[data-name="' + name + '"]');
		var values = [];
		items.each(function(i, item) {
			if (item.checked) {
				values.push(item.value);
			}
		});
		return values;
	}

	$.extend(mockupFormControl, events);

	mockupFormControl._addObservers(['toggle-checkbox', 'toggle-radio']);

	//Init mockup checkbox
	$(document).delegate('.mockup-checkbox input', 'click', function(evt) {
		if(this.checked) {
			$(this.parentNode).addClass('on');
		} else {
			$(this.parentNode).removeClass('on');
		}
		mockupFormControl._dispatchEvent('toggle-checkbox', evt);
	});
	//Init mockup radio
	$(document).delegate('.mockup-radio input', 'click', function(evt) {
		$('input[name="' + this.name + '"], input[data-name="' + this.name + '"]').parent().removeClass('on');
		if(this.checked) {
			$(this.parentNode).addClass('on');
		} else {
			$(this.parentNode).removeClass('on');
		}
		mockupFormControl._dispatchEvent('toggle-radio', evt);
	});
	
	return mockupFormControl;
});
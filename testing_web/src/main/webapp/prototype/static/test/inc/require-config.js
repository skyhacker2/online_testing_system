var require = require || {
	debug: true,
	baseUrl: '/base/js',
	paths: {
		'jquery': 'lib/jquery/jquery-1.9.1-main',
		'bootstrap': 'lib/bootstrap-3.0/main',
		'spine': 'lib/spine/main',
		'rfl': 'lib/rfl/main',
		'smart-search': 'lib/smart-search/main',
		'form-util': 'lib/form-util/main',
		'pair-box': 'lib/pair-box/main',
		'auto-complete': 'lib/auto-complete/main',
		'data-grid': 'lib/data-grid/main',
		'customizable-data-grid': 'lib/customizable-data-grid/main',
		'instant-editor': 'lib/instant-editor/main',
		'file-uploader': 'lib/file-uploader/main',
		'datepicker': 'lib/datepicker/main',
		'timepicker': 'lib/timepicker/main',
		'base64': 'lib/base64/main',
		'raphael': 'lib/raphael/main',
		'morris': 'lib/morris/main',
		'codemirror': 'lib/codemirror/main',
		'ckeditor': 'lib/ckeditor-4.2.1/ckeditor-main',
		'just-gage': 'lib/just-gage/main',
		'highcharts': 'lib/highcharts/main'
	},
	shim: {
		'jquery': {
			exports: 'jQuery'
		},
		'spine': {
			exports: 'Spine',
			deps: ['jquery']
		},
		'bootstrap': {
			exports: 'jQuery.fn.modal',
			deps: ['jquery']
		},
		'datepicker': {
			exports: 'jQuery.fn.datepicker',
			deps: ['jquery']
		},
		'base64': {
			exports: 'Base64'
		},
		'raphael': {
			exports: 'Raphael'
		},
		'morris': {
			exports: 'Morris',
			deps: ['raphael']
		},
		'codemirror': {
			exports: 'CodeMirror'
		},
		'ckeditor': {
			exports: 'CKEDITOR'
		},
		'just-gage': {
			exports: 'JustGage',
			deps: ['raphael']
		},
		'highcharts': {
			exports: 'jQuery.fn.highcharts',
			deps: ['jquery']
		}
	}
};
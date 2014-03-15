var ROOT = (location.pathname.match(/(.*?\/)static\//) || ['/', '/'])[1];

var G = G || {
	DOMAIN: document.domain,

	ORIGIN: location.protocol + "//" + location.host,
	CGI_ORIGIN: location.protocol + "//" + location.host,
	CDN_ORIGIN: location.protocol + "//" + location.host,
	SNAPSHOT_ORIGIN: location.protocol + "//" + location.host,

	BASE: '' ? '' : ROOT + 'static/',
	CGI_BASE: '' ? '' : ROOT,
	CDN_BASE: '' ? '' : ROOT + 'static/',

	LANG: 'en',
	LANG_MAP: {
		'en': 'en', 'zh-cn': 'zh-cn', 'zh-tw': 'zh-tw',
		'en_US': 'en', 'zh_CN': 'zh-cn', 'zh_TW': 'zh-tw'
	},
	LANG_BACKEND_MAP: {
		'en': 'en_US', 'zh-cn': 'zh_CN', 'zh-tw': 'zh_TW'
	},

	//pager setting
	PAGE_ASIDE: 3,
	ITEMS_PER_PAGE: 15,
	BATCH_OP_REQUIRES: 3,
	ONE_SCREEN_RECORDS: 10,
	
	pageTime: [new Date()]
};

G.IS_PROTOTYPE = G.CGI_BASE.indexOf('/static/mockup-data/') >= 0;

if(G.LANG.indexOf('%{{') === 0) {
	G.LANG = 'en';
}

G.THEME = (function() {
	var m = document.cookie.match(/(?:^|;)\s*theme=([a-zA-Z0-9]+)/);
	if(m) {
		return m[1];
	} else {
		return 'purple';
	}
})();

G.IS_PC = (function() {
	var ua = navigator.userAgent;
	var list = ['Android', 'iPhone', 'iPod', 'iPad', 'Windows Phone', 'BlackBerry', 'MeeGo', 'SymbianOS'];
	for(var i = 0, l = list.length; i < l; i++) {
		if(ua.indexOf(list[i]) > 0) {
			return false;
		}
	}
	return true;
})();

G.id = function(id) {
	return document.getElementById(id);
};

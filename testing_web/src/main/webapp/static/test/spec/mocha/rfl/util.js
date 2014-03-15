define(['rfl'], function(rfl) {
	var util = rfl.util;

	describe('rfl#util', function() {
		describe('#cloneObject', function() {
			it("cloneObject should return a clone Object.", function() {
				var tmp = {
					a: 123,
					b: 234
				};
				expect(util.cloneObject(tmp)).to.eql(tmp);
			});
			it("in no deep clone", function() {
				var tmp = {
					a: {
						n: 123
					},
					b: 234
				},
				tmp2 = util.cloneObject(tmp);
				expect(tmp2).to.eql(tmp);
				tmp.a.n = 321;
				expect(tmp2).to.eql(tmp);
			});
			it("in deep clone", function() {
				var tmp = {
					a: {
						n: 123
					},
					b: 234
				},
				tmp2 = util.cloneObject(tmp, 1);
				expect(tmp2).to.eql(tmp);
				tmp.a.n = 321;
				expect(tmp2).not.to.eql(tmp, 1, 0);
			});
			it("if deep > level", function() {
				var tmp = {
					a: {
						n: 123
					},
					b: 234
				};
				expect(util.cloneObject(tmp, 3)).to.eql(tmp);
			});
		});

		describe('#getByteLength', function() {
			it("String 'hello,world!' has 12 byte.", function() {
				expect(util.getByteLength("hello,world!")).to.be(12);
			});
			it("String '世界，你好！' has 12 byte.", function() {
				expect(util.getByteLength("世界，你好！")).to.be(12);
			})
		});

		describe('#headByByte', function() {
			it("String 'hello,world!' 0-5 bytes is 'hello'", function() {
				expect(util.headByByte("hello,world!", 5)).to.be("hello");
			});
			it("String '世界，你好' 0-5 bytes is '世界'", function() {
				expect(util.headByByte('世界，你好', 5)).to.be("世界");
			});
			it("The final fix should be '...' .", function() {
				expect(util.headByByte('hello,world!', 5, '...')).to.be('he...');
			});
		});

		describe('#encodeHtml.', function() {
			it("HTML should be encoded.", function() {
				expect(util.encodeHtml("<html></html>")).to.be("&lt;html&gt;&lt;/html&gt;");
			});
		});

		describe('#decodeHtml.', function() {
			it("Should decode Html.", function() {
				expect(util.decodeHtml("&lt;html&gt;&lt;/html&gt;")).to.be("<html></html>");
			});
		});

		describe('#getUrlParam', function() {
			it("Should get the url param.", function() {
				expect(util.getUrlParam("id", {href: "http://www.test.org/?id=123&name=Bob#id=1234"})).to.be('123');
			});
			it("All params should be string, so '123' + 4 = '1234'.", function() {
				var tmp = util.getUrlParam("id", {href: "http://www.test.org/?id=123&name=Bob#id=1234"}) + 4;
				expect(tmp).to.be('1234');
			});
		});

		describe('#getUrlParams', function() {
			it("Should get the url params.", function() {
				var tmp = util.getUrlParams({href: "http://www.test.org/?id=123&name=Bob#id=1234", search: "?id=123&name=Bob", hash: "#id=1234"});
				expect(tmp.id).to.be('123');
				expect(tmp.name).to.be("Bob");
			});
		});

		describe('#getOrigin', function() {
			it("Should get the origin", function() {
				var origin = util.getOrigin();
				expect(origin).to.be('http://localhost:9877');
			});
		});

		describe('#url2Obj', function() {
			it("Should change the url to obj", function() {
				var obj = util.url2obj("http://www.test.org:8080/?id=123&name=eleven#id=123");
				var expectObj = {
					href: "http://www.test.org:8080/?id=123&name=eleven#id=123",
					protocol: "http:",
					host: 'www.test.org:8080',
					hostname: 'www.test.org',
					port: '8080',
					pathname: '/',
					search: '?id=123&name=eleven',
					hash: '#id=123',
					origin: 'http://www.test.org:8080'
				};
				expect(obj).to.be.eql(expectObj);
			});
		});

		describe('#formatMsg', function() {
			it('Should return "hello world"', function() {
				var msg = util.formatMsg("hello {{name}}", {name:"world"});
				expect(msg).to.be.eql('hello world');
			});
		});

		describe('#formatDecimal', function() {
			it('Should return 2.00 when formatDecimal(2,"0.00")', function() {
				expect(util.formatDecimal(2, '0.00')).to.be.eql(2.00);
			});
		});

		describe('#formatDateTime', function() {
			it('Should return 2014-02-18', function() {
				var date = new Date();
				date.setFullYear(2014);
				date.setMonth(1);
				date.setDate(18);
				expect(util.formatDateTime(date.getTime(), 'yyyy-MM-dd')).to.be.eql('2014-02-18')
			});
		});

		describe('#formatLeftTime', function(){
			it('Should return left time', function() {
				var ms = 3661000;
				expect(util.formatLeftTime(ms, 'hours', 'minutes', 'seconds')).to.be.eql('1hours1minutes1seconds');
			});
		});
	});
});
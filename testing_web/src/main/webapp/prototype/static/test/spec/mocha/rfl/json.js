define(['rfl'], function(rfl) {
	var json = rfl.json;

	describe('rfl#json', function() {
		describe('#parse', function() {
			it('Should parse JSON.', function() {
				expect(json.parse('{"a": 1}').a).to.be(1);
			});
		});

		describe('#stringify', function() {
			it('Should stringify whole Object.', function() {
				expect(json.stringify({a: 'a'})).to.eql('{"a":"a"}');
			});
			it('Should stringify Number useless quotation marks.', function() {
				expect(json.stringify({a: 1})).to.eql('{"a":1}');
			});
			it('Should stringify Boolean', function() {
				expect(json.stringify({a:true})).to.eql('{"a":true}');
			});
			it('Should stringify Object', function() {
				expect(json.stringify({a: {}})).to.eql('{"a":{}}');
			});
			it('Should stringify Null', function() {
				expect(json.stringify({a: null})).to.eql('{"a":null}');
			});
			it('Should delete the udnefined property', function() {
				expect(json.stringify({a: undefined})).to.eql('{}');
			});
		});
	});

});
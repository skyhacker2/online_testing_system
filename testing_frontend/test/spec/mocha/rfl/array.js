define(['rfl'], function(rfl) {
	var array = rfl.array;
	describe('rfl#array', function() {
		describe('#isArray', function() {
			it('[] should be array.', function() {
				expect(array.isArray([])).to.be.ok();
			});
			it('Number should not be array.', function() {
				expect(array.isArray(123)).to.not.be.ok();
			});
			it('String should not be array.', function() {
				expect(array.isArray('hello world')).to.not.be.ok();
			});
			it('Object should not be array.', function() {
				expect(array.isArray({})).to.not.be.ok();
			});
			it('HTMLCollection should not be array.', function() {
				expect(array.isArray(document.getElementsByTagName('head'))).to.not.be.ok();
			});
			it('Arugments should not be array.', function() {
				expect(array.isArray(arguments)).to.not.be.ok();
			});
		});

		describe('#getArray.', function() {
			it('HTMLCollection can be transformed to Array', function() {
				expect(array.isArray(array.getArray(document.getElementsByTagName('head')))).to.be.ok();
			});
			it('Arugments can be transformed to Array', function() {
				expect(array.isArray(array.getArray(arguments))).to.be.ok();
			});
		});

		describe('#difference.', function() {
			it('the number in [1, 2, 3] which did not exist in [2, 3, 4, 5] is [1].', function() {
				var ex = array.difference([1, 2, 3, 6], [2, 3, 4, 5]);
				expect(ex).to.contain(1);
				expect(ex).to.contain(6);
				expect(ex).to.not.contain(2);
				expect(ex).to.not.contain(3);
				expect(ex).to.not.contain(4);
				expect(ex).to.not.contain(5);
			});
		});
	});
});
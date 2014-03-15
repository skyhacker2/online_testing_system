define(['rfl'], function(rfl) {
	var css = rfl.css;
	describe('#css', function() {
		describe('#load', function() {
			it('Should load css', function() {
				var id = css.load('main.css');
				expect(id).to.be.eql('rfl-css-link-0');
				expect($('#rfl-css-link-0').length).to.be.eql(1);
			});
		});
		describe('#unload', function() {
			it('should unload css', function() {
				css.unload('main.css');
				expect($('#rfl-css-link-0').length).to.be.eql(0);
			});
		});
	});
});
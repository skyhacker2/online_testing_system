define(['rfl'], function(rfl) {
	var InstanceManager = rfl.InstanceManager;

	describe('rfl#InstanceManager', function() {
		it('Can get and set item in InstanceManager.', function() {
			var tmp = {a: 1},
				im = new InstanceManager(),
				id = im.add(tmp);
			expect(im.get(id)).to.be(tmp);
		});
		it('Can count the all items in InstanceManager.', function() {
			var tmp = {a: 1},
				im = new InstanceManager(),
				id = im.add(tmp);
			expect(im.count()).to.be(1);
			im.remove(id);
			expect(im.count()).to.be(0);
			id = im.add(tmp);
			expect(im.count()).to.be(1);
			im.clear();
			expect(im.count()).to.be(0);
		});
		it('Can remove the item.', function() {
			var tmp = {a: 1},
				im = new InstanceManager(),
				id = im.add(tmp);
			expect(im.remove(id)).to.be(tmp);
		});
	});
});
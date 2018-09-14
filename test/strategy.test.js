'use strict';

const Strategy = require('../lib/strategy');

describe('Strategy', function () {
	const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function () { });

	it('should be named loopback', function () {
		expect(strategy.name).to.equal('loopback');
	});

	it('should throw if constructed without a verify callback', function () {
		expect(function () {
			const s = new Strategy();
		}).to.throw(TypeError, 'LoopbackStrategy requires a verify callback');
	});
});

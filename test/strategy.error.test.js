'use strict';

const Strategy = require('../lib/strategy');
const _app = require('./bootstrap/server');

describe('Strategy', function () {
	describe('encountering an error during verification', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			done(new Error('something went wrong'));
		});

		let err;

		before(function (done) {
			chai.passport.use(strategy)
				.error(function (e) {
					err = e;
					done();
				})
				.req(function (req) {
					req.body = {};
					req.body['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should error', function () {
			expect(err).to.be.an.instanceof(Error);
			expect(err.message).to.equal('something went wrong');
		});
	});

	describe('encountering an exception during verification', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			throw new Error('something went horribly wrong');
		});

		let err;

		before(function (done) {
			chai.passport.use(strategy)
				.error(function (e) {
					err = e;
					done();
				})
				.req(function (req) {
					req.body = {};
					req.body['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should error', function () {
			expect(err).to.be.an.instanceof(Error);
			expect(err.message).to.equal('something went horribly wrong');
		});
	});
});

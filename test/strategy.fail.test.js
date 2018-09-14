'use strict';

const Strategy = require('../lib/strategy');
const _app = require('./bootstrap/server');

describe('Strategy', function () {
	describe('failing authentication', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			return done(null, false);
		});

		let info;

		before(function (done) {
			chai.passport.use(strategy)
				.fail(function (i) {
					info = i;
					done();
				})
				.req(function (req) {
					req.body = {};
					req.body['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should fail', function () {
			expect(info).to.be.undefined;
		});
	});

	describe('failing authentication with info', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			return done(null, false, { message: 'authentication failed' });
		});

		let info;

		before(function (done) {
			chai.passport.use(strategy)
				.fail(function (i) {
					info = i;
					done();
				})
				.req(function (req) {
					req.body = {};
					req.body['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should fail', function () {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('authentication failed');
		});
	});
});

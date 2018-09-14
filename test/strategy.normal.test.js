'use strict';

const Strategy = require('../lib/strategy');
const _app = require('./bootstrap/server');

describe('Strategy', function () {
	describe('handling a request with valid credentials in body', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			if (token === _app.token) {
				return done(null, {
					id: '1234'
				}, {
					scope: 'read'
				});
			}

			return done(null, false);
		});

		let user,
			info;

		before(function (done) {
			chai.passport.use(strategy)
				.success(function (u, i) {
					user = u;
					info = i;
					done();
				})
				.req(function (req) {
					req.body = {};
					req.body['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should supply user', function () {
			expect(user).to.be.an('object');
			expect(user.id).to.equal('1234');
		});

		it('should supply info', function () {
			expect(info).to.be.an('object');
			expect(info.scope).to.equal('read');
		});
	});

	describe('handling a request with valid credentials in query', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			if (token === _app.token) {
				return done(null, {
					id: '1234'
				}, {
					scope: 'read'
				});
			}

			return done(null, false);
		});

		let user,
			info;

		before(function (done) {
			chai.passport.use(strategy)
				.success(function (u, i) {
					user = u;
					info = i;
					done();
				})
				.req(function (req) {
					req.query = {};
					req.query['access_token'] = _app.token;
				})
				.authenticate();
		});

		it('should supply user', function () {
			expect(user).to.be.an('object');
			expect(user.id).to.equal('1234');
		});

		it('should supply info', function () {
			expect(info).to.be.an('object');
			expect(info.scope).to.equal('read');
		});
	});

	describe('handling a request without a body', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			throw new Error('should not be called');
		});

		let info,
			status;

		before(function (done) {
			chai.passport.use(strategy)
				.fail(function (i, s) {
					info = i;
					status = s;
					done();
				})
				.authenticate();
		});

		it('should fail with info and status', function () {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('Missing auth token');
			expect(status).to.equal(400);
		});
	});

	describe('handling a request without a body, but no token', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			throw new Error('should not be called');
		});

		let info,
			status;

		before(function (done) {
			chai.passport.use(strategy)
				.fail(function (i, s) {
					info = i;
					status = s;
					done();
				})
				.req(function (req) {
					req.body = {};
				})
				.authenticate();
		});

		it('should fail with info and status', function () {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('Missing auth token');
			expect(status).to.equal(400);
		});
	});

	describe('handling a request without a body, but no token', function () {
		const strategy = new Strategy({authorizationURL: 'http://localhost:3000/me'}, function(token, refresh, profile, done) {
			throw new Error('should not be called');
		});

		let info,
			status;

		before(function (done) {
			chai.passport.use(strategy)
				.fail(function (i, s) {
					info = i;
					status = s;
					done();
				})
				.req(function (req) {
					req.body = {};
				})
				.authenticate();
		});

		it('should fail with info and status', function () {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('Missing auth token');
			expect(status).to.equal(400);
		});
	});
});

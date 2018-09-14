'use strict';

const Strategy = require('../lib/strategy');
const _app = require('./bootstrap/server');

describe('Strategy', function () {
	describe('handling a request with valid credentials in body using custom field name', function () {
		const strategy = new Strategy({ authorizationURL: 'http://localhost:3000/me', tokenFields: ['tok'] }, function(token, refresh, profile, done) {
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
					req.body.tok = _app.token;
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
});

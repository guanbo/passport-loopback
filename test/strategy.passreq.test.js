'use strict';

const Strategy = require('../lib/strategy');
const _app = require('./bootstrap/server');

describe('Strategy', function () {
	describe('passing request to verify callback', function () {
		const _token = _app.token;
		const strategy = new Strategy({
			authorizationURL: 'http://localhost:3000/me',
			headerFields: 'Authorization',
			_tokenFields: 'access_token',
			passReqToCallback: true
		}, function (req, token, refreshToken, profile, done) {
			if (token === _token) {
				return done(null, {
					id: '1234'
				}, {
					scope: 'read',
					foo: req.headers['x-foo']
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
					req.headers['x-foo'] = 'hello';
					req.headers['Authorization'] = _token;
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

		it('should supply request header in info', function () {
			expect(info.foo).to.equal('hello');
		});
	});
});

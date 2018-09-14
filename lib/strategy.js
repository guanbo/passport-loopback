'use strict';

const passport = require('passport-strategy');
const util = require('util');
const {Request} = require('loopback-rest-test');

/**
 * `Strategy` constructor.
 *
 * The token authentication strategy authenticates requests based on the
 * credentials submitted through an authentication token.
 *
 * Applications must supply a `verify` callback which accepts `token`
 * credentials, and then calls the `done` callback supplying a
 * `user` associated with the token, which should be set to `false`
 * if the credentials are not valid.
 * If an exception occured, `err` should be set.
 * 
 * The loopback token can be authenticated and authorized, it should be provide.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *   - `authorizationURL` authorizate url for loopback authenticate and authorize profile.
 *   - `tokenFields`  array of field names where the token is found, defaults to [access_token]
 *   - `headerFields`  array of field names where the token is found, defaults to [Authorization]
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 * 
 * 
 * @param  {Object} options
 * @param  {Function} verify
 */
function Strategy(options, verify) {
	if (typeof options == 'function') {
		verify = options;
		options = {};
	}

  if (!verify) { throw new TypeError('LoopbackStrategy requires a verify callback'); }
  if (!options.authorizationURL) { throw new TypeError('LoopbackStrategy requires a authorizationURL option'); }

	passport.Strategy.call(this, options, verify);
	this.name = 'loopback';
	this._verify = verify;
	this._rest = new Request({stream: options.authorizationURL});
	this._tokenFields = options.tokenFields || ['access_token'];
	this._headerFields = options.headerFields || ['Authorization'];
	this._passReqToCallback = options.passReqToCallback;
}


/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
	options = options || {};

	let token, profile;

  this._headerFields.some(field=>{
    token = req.headers[field];
    return !!token;
  });

  if(!token) {
    this._tokenFields.some(field=>{
      token = (req.query && req.query[field]) || (req.body && req.body[field]);
      return !!token;
    });
  }

  if (!token) {
    return this.fail({ message: options.badRequestMessage || 'Missing auth token' }, 400);
  }

	let self = this;

	function verified (err, user, info) {
		if (err) {
			return self.error(err);
		}
		if (!options.optional) {
			if (!user) {
				return self.fail(info);
			}
		}
		self.success(user, info);
	}

	try {
		this._rest.accessToken = {id: token};
		this._rest.get('/', (err, res)=>{
			if (err) {
				return self.error(err);
			}
			profile = res.body;
			try {
				if (self._passReqToCallback) {
					self._verify(req, token, token, profile, verified);
				} else {
					self._verify(token, token, profile, verified);
				}
			} catch (ex) {
				return self.error(ex);
			}
		});
	} catch (ex) {
		return self.error(ex);
	}
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
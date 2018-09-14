# Passport Loopback
[Passport](https://github.com/jaredhanson/passport) for [Loopback.io](https://loopback.io/) base on its token

[Passport](http://passportjs.org/) strategy for authenticating with an authentication token.

This module lets you authenticate using a token in your Node.js
applications. It is based on passport-local module by Jared Hanson.
By plugging into Passport, token authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

[Loopback.io](https://loopback.io/) is a highly-extensible, open-source Node.js framework


## Install 

```
$ npm install passport-loopback
```

## Usage

#### Configure Strategy

```js
const LoopbackStrategy = require('passport-loopback').Strategy;

passport.use('loopback', new LoopbackStrategy({
    	authorizationURL: 'http://localhost:3000/me',
			passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    User.findOrCreate({loopbackId: profile.id}, done)
  }
));
```
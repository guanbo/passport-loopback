# Passport Loopback

[![Build Status](https://travis-ci.org/guanbo/passport-loopback.svg?branch=master)](https://travis-ci.org/guanbo/passport-loopback)
[![Coverage Status](https://coveralls.io/repos/github/guanbo/passport-loopback/badge.svg)](https://coveralls.io/github/guanbo/passport-loopback)
[![Maintainability](https://api.codeclimate.com/v1/badges/b70371f497e447da30da/maintainability)](https://codeclimate.com/github/guanbo/passport-loopback/maintainability)


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
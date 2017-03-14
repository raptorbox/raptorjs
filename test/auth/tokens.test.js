/*
  global describe
  global before
  global it
  global console
*/

var configFile = "../data/config.json";

var Raptor = require('../../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var d = require('debug')("raptorjs:test:auth:tokens");

var r;
var token;

describe('raptor auth service', function () {

  before(function () {
    r = new Raptor(require(configFile));
  });

  describe('tokens API', function () {

    it('should create a new token', function () {
      var tokenName = "test" + (new Date()).getTime()
      return r.auth.tokens
        .create({
          name: tokenName,
          secret: "foobar",
          expires: 60 * 5 // 5min
        })
        .then(function (t) {
          d("Created token: %j", t)
          token = t
          assert.isTrue(token.name === tokenName)
          return Promise.resolve();
        });
    });

    it('should update a token', function () {
      token.name = "foobaz";
      return r.auth.tokens
        .update(token)
        .then(function (t) {
          d("Updated token: %j", t)
          assert.isTrue(t.name === "foobaz")
          token = t
          return Promise.resolve();
        });
    });

    it('should delete a token', function () {
      return r.auth.tokens
        .delete(token)
        .then(function () {
          return Promise.resolve();
        });
    });

    it('should contain at least a token', function () {
      return r.auth.tokens.list()
        .then(function (list) {
          d("User has %s tokens", list.length)
          assert.isTrue(list instanceof Array)
          assert.isTrue(list.length > 0)
        });
    });

  });

});

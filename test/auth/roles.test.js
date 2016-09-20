var configFile = "../data/config.json";

var Raptor = require('../../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var d = require('debug')("raptorjs:test:auth:roles");

var json = require('../data/device');
var r;
var role;
var serviceObject;

describe('raptor auth service', function () {

  before(function () {
    r = new Raptor(require(configFile));
  });

  describe('roles API', function () {

    it('should add a new role', function () {
      return r.auth.roles
        .create("foobar")
        .then(function (t) {
          role = t
          assert.isTrue(t.name === "foobar")
          return Promise.resolve();
        });
    });

    it('should update a role', function () {
      role.name = "foobaz";
      return r.auth.roles
        .update(role)
        .then(function (t) {
          assert.isTrue(t.name === "foobaz")
          return Promise.resolve();
        });
    });

    it('should delete a role', function () {
      return r.auth.roles
        .delete(role)
        .then(function () {
          return Promise.resolve();
        });
    });

    it('should contain at least a role', function () {
      return r.auth.roles.list()
        .then(function (list) {
          assert.isTrue(list instanceof Array)
          assert.isTrue(list.length > 0)
        });
    });

  });

});

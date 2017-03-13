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
var d = require('debug')("raptorjs:test:auth:permissions");

var json = require('../data/device');
var r, user, object;

var testSetPermission = function (newPerms) {
  return object.permissions.set('device',user, newPerms)
    .then(function (permissions) {
      assert.isArray(permissions);
      assert.equal(permissions.length, newPerms.length);
      return Promise.resolve(permissions);
    })
    .then(function (perms) {
      return object.permissions.get('device',user)
        .then(function (permissions) {
          d("User %s permissions %j", user.uuid, permissions);
          assert.isArray(permissions);
          assert.equal(permissions.length, perms.length);
          return Promise.resolve();
        });
    })
};

describe('raptor auth service', function () {

  before(function () {

    r = new Raptor(require(configFile));
    return r.create(json)
      .then(function (obj) {
        object = obj;
        d("current user %s", r.currentUser().uuid);
        d("created object %s", object.id);
        return Promise.resolve(object);
      })
      .then(function (object) {
        assert.isNotNull(object.id);
        var name = "pippo" + (new Date()).getTime();
        return r.auth.users.create({
          username: name,
          password: "foobar",
          email: name + "@bar.local"
        })
          .then(function (usr) {
            user = usr;
            assert.isNotNull(user.uuid);
            d("created new user %s", user.uuid);
          });
      });

  });

  describe('permissions API', function () {

    it('should return empty list of permission', function () {

      return object.permissions.get('device',user)
        .then(function (permissions) {
          d("User %s permissions %j", user.uuid, permissions);

          assert.isArray(permissions);
          assert.equal(permissions.length, 0);

          return Promise.resolve();
        });
    });

    it('should set new permissions', function () {
      return testSetPermission(["read", "write"]);
    });

    it('should empty permissions', function () {
      return testSetPermission([])
    });

    it('should fail for unknown permission', function () {
      return testSetPermission(["foobar"]).catch(function(e) {
        d(e);
        return Promise.resolve();
      })
    });

  });

});

var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var dbg = require('debug')("raptorjs:test:api");

var json = require('./data/device');
var raptor = new Raptor(require(configFile));

describe('raptor', function () {

  describe('search for objects', function () {
    it('should search for an object', function () {

      // startup may be slow :(
      this.timeout(5000);

      return raptor.create(json)
        .then(function (obj) {
          dbg("Created %s (%s)", obj.id, obj.name);
          return raptor.search(obj.name)
            .then(function (list) {
              dbg("Found records: %j", list);
              assert.equal(list.map(o => o.id).indexOf(obj.id) > -1, true);
            })
        });
    });

    it('should search for an object customField', function () {

      json.customFields = {
        foo: "bar100"
      }

      return raptor.create(json)
        .then(function (obj) {
          dbg("Created %s (%s)", obj.id, obj.name);
          return raptor.search(obj.name)
            .then(function (list) {
              dbg("Found records: %j", list);
              assert.equal(list.map(o => o.id).indexOf(obj.id) > -1, true);
            })
        });
    });

  });

});

/*
  global describe
  global it
  global console
*/

var configFile = "./data/config.json";

var Raptor = require('../index');

var assert = require('chai').assert;
var dbg = require('debug')("raptorjs:test:api");

var json = require('./data/device');
var raptor = new Raptor(require(configFile));

let waitForIndex = function(len) {
  dbg("Waiting %s for indexing", len)
  return new Promise(function(resolve) {
    setTimeout(function() {
      dbg("Done waiting")
      resolve()
    }, len)
  });
}

describe('raptor', function () {

  describe('search for objects', function () {
    it('should search for an object', function () {

      // startup may be slow :(
      this.timeout(7500);

      return raptor.create(json)
        .then(function (obj) {
          dbg("Created %s (%s)", obj.id, obj.name);
          return waitForIndex(3500).then(function() {
            return raptor.search(obj.name)
          })
          .then(function (list) {
            list = list.map(o => o.id)
            dbg("Found records: %j", list.length);
            let idx = list.indexOf(obj.id)
            dbg("found my object: %j", idx);
            assert.isTrue(idx >= 0);
          })
        });
    });

    it('should search for an object customField', function () {

      this.timeout(7500);

      json.customFields = {
        foo: "bar100"
      }

      return raptor.create(json)
        .then(function (obj) {
          dbg("Created %s (%s)", obj.id, obj.name);
          return waitForIndex(3500).then(function() {
            return raptor.search(obj.name)
          })
          .then(function (list) {
            dbg("Found records: %s", list.length);
            assert.equal(list.map(o => o.id).indexOf(obj.id) > -1, true);
          })
        });
    });

  });

});

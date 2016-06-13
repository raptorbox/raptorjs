
var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var d = require('debug')("raptorjs:test:api");

var json = require('./data/device');
var raptor;
var serviceObject;

describe('raptor', function () {

  before(function () {
    raptor = new Raptor(require(configFile));
  });

  describe('search object', function () {
    it('should search for an object', function () {
      this.timeout(3500);
      return raptor.create(json)
        .then(function(obj) {
          serviceObject = obj;
          d("Created %s (%s)", obj.id, obj.name);
          return new Promise(function(resolve, reject) {
            setTimeout(function() {
              raptor.search(obj.name)
                .then(function(list) {
                  d("Found records: %j", list);
                  assert.equal(list.indexOf(obj.id) > -1, true);
                  resolve();
                })
                .catch(reject);
              }, 2000);

          });
        });
    });
  });

});

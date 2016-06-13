
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

  describe('create device', function () {
    it('should create a new object', function () {
      return raptor.create(json)
        .then(function(obj) {
          serviceObject = obj;
          d("Created " + obj.id);
          assert.equal(json.name, obj.name);
          assert.notEqual(obj.id, null);
          return Promise.resolve();
        });
    });
  });

  describe('update device', function () {
    it('should update an object streams and actions', function () {

      // it's pig slow :(
      this.timeout(5000);

      if(serviceObject) throw new Error("Object not loaded?");

      return new Promise(function(resolve, reject) {
        setTimeout(function() {

          serviceObject.actions = [];

          serviceObject.setStreams([{
            name: "mystream",
            channels: {
              test: 'number',
              test1: 'string'
            }
          }]);

          serviceObject.update()
            .then(function(obj) {
              assert.equal(json.name, obj.name);
              assert.notEqual(obj.id, null);
              resolve();
            });
        }, 2500);
      });
    });
  });

});

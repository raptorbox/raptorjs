
var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;

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
          assert.equal(json.name, obj.name);
          assert.notEqual(obj.id, null);
          return Promise.resolve();
        });
    });
  });

  describe('update device', function () {
    it('should update an object streams and actions', function () {

      serviceObject.actions = [];

      serviceObject.setStreams([{
        name: "mystream",
        channels: {
          test: 'number',
          test1: 'string'
        }
      }]);

      return serviceObject.update()
        .then(function(obj) {
          assert.equal(json.name, obj.name);
          assert.notEqual(obj.id, null);
          return Promise.resolve();
        });
    });
  });

  describe('toJSON', function () {
    it('should render the object as JSON', function () {

      var obj = raptor.fromJSON(json);
      var json2 = obj.toJSON();

      assert.equal(json.name, json2.name);

      assert.equal(json.streams.temperature.name, json2.streams.temperature.name);
      assert.equal(json.streams.temperature.channels.isActive, json2.streams.temperature.channels.isActive);
      assert.equal(Object.keys(json.streams).length, Object.keys(json2.streams).length);

      assert.equal(json.actions.length, json2.actions.length);
      assert.equal(json.actions[1].status, json2.actions[1].status);

      assert.equal(json.customFields.example, json2.customFields.example);
      assert.equal(json.settings.storeEnabled, json2.settings.storeEnabled);

    });
  });

});

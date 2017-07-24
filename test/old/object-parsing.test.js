/*
  global describe
  global before
  global it
  global console
*/

var configFile = "./data/config.json";

var Raptor = require('../index');

var assert = require('chai').assert;

var json = require('./data/device');
var raptor;

describe('raptor', function () {

  before(function () {
    raptor = new Raptor(require(configFile));
  });

  describe('fromJSON', function () {
    it('should load an object definition from JSON', function () {
      var obj = raptor.fromJSON(json);
      assert.equal(json.name, obj.name);
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


var Raptor = require('../index');

var assert = require('chai').assert;

var json = require('./device');
var raptor;

describe('raptor', function () {

  before(function () {
    raptor = new Raptor({
      apiKey: "test"
    });
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

      console.log(json2);

      assert.equal(json.name, json2.name);
    });
  });

});

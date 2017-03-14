/*
  global describe
  global it
  global console
*/

var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var dbg = require('debug')("raptorjs:test:api");

var json = require('./data/device');
var raptor = new Raptor(require(configFile));

describe('raptor', function () {

  describe('Manage object definition', function () {
    it('should create a new object', function () {

      //startup is pig slow :(
      this.timeout(5000);

      return raptor.create(json)
        .then(function (obj) {
          dbg("Created " + obj.id);
          assert.equal(json.name, obj.name);
          assert.notEqual(obj.id, null);
          return Promise.resolve();
        });
    });

    it('should update an object streams and actions', function () {

      json.name = "update " + (new Date())
      return raptor.create(json)
        .then(function (serviceObject) {

          serviceObject.actions = [];
          dbg("Current object streams: %j", serviceObject.toJSON().streams)
          return serviceObject.setStreams([{
            name: "mystream",
            channels: {
              test: 'number',
              test1: 'string'
            }
          }])
          .update()
          .then(function (obj) {
            dbg("Updated object streams: %j", obj.toJSON().streams)
            assert.equal(json.name, obj.name);
            assert.notEqual(obj.id, null);
          })
        })
    });

    it('should delete an object', function () {

      json.name = "delete " + (new Date())
      return raptor.create(json)
        .then(function (serviceObject) {
          var id = serviceObject.id;
          return serviceObject
          .delete()
          .then(function () {
            dbg("Deleted object: %s", id)
            return raptor.load(id).catch(function(err) {
              assert.isTrue(err.message.match(/404 Not Found/i).length > 0)
              return Promise.resolve()
            })
          })
        })
    });

  }); //describe
}); //describe

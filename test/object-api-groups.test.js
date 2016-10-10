var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var d = require('debug')("raptorjs:test:api:groups");

var json = require('./data/device');
var raptor;

var parent, child, childrenList;

var createObject = function (name) {
  json.name = name || "Object " + (new Date());
  return raptor.create(json)
};

describe('raptor', function () {

  before(function () {
    raptor = new Raptor(require(configFile));
  });

  describe('Object group API', function () {

    it('should add an object as children', function () {
      this.timeout(3500);
      return Promise.join(createObject(), createObject(), function (p, c) {
        d("Created parent %s and child %s", p.id, c.id)
        parent = p;
        child = c;
        return Promise.resolve()
      })
        .then(function () {
          return parent.addChild(child);
        })
        .then(function (children) {
          assert.equal(children.length, 1)
          assert.equal(children.filter(o => {
            return o.id === child.id
          }).length, 1)
        });
    });

    it('should set a list of objects as children', function () {
      return Promise.join(createObject(), createObject(), createObject(), function (child1, child2, child3) {
        d("Created %s,%s,%s", child1.id, child2.id, child3.id);
        child = child3
        return parent.setChildren([child1, child2, child3]);
      })
        .then(function (children) {
          d("Children list is %s len", children.length);
          assert.equal(children.length, 3)
          d("Searching for id %s", child.id);
          assert.equal(children.filter(o => {
            return o.id === child.id
          }).length, 1)
        });
    });

    it('should remove an object from the list of children', function () {
      return parent.removeChild(child)
        .then(function (children) {
          assert.equal(children.filter(o => {
            return o.id === child.id
          }).length, 0)
        });
    });


  });

});

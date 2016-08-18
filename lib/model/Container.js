var _ = require("lodash");

var Container = function () {

  this.container = null;
  this.serviceObject = null;

  this.data = {};

};

Container.prototype.exportProperties = function () {
  var me = this;
  _.forEach(this.data, function (value, key) {
    Object.defineProperty(me, key, {
      get: function () {
        return me.data[key];
      },
      set: function (value) {
        me.data[key] = value;
      },
    });
  });
};

/**
 */
Container.prototype.getClient = function () {
  return this.container && this.container.client;
};

/**
 */
Container.prototype.getContainer = function () {
  return this.container;
};

/**
 */
Container.prototype.setContainer = function (c) {
  this.container = c;
};

/**
 */
Container.prototype.setServiceObject = function (s) {
  this.serviceObject = s;
  if(s && s.getContainer) {
    this.setContainer(s.getContainer());
  }
};

Container.prototype.getServiceObject = function () {
  return this.serviceObject;
};

/**
 * @return {void}
 */
Container.prototype.validate = function () {
  throw new Error("Not implemented");
};

/**
 * @return {Object} Plain js object
 */
Container.prototype.toJSON = function () {

  var me = this;

  var recurse = function (obj) {
    var json = {};

    _.forEach(obj, function (value, key) {

      if(!value) {
        json[key] = value;
        return json;
      }

      if(value.toJSON) {
        json[key] = value.toJSON();
      }
      else if(value instanceof Array) {
        json[key] = recurse(value);
      } else if(typeof value === 'object') {
        json[key] = recurse(value);
      }
      else
        json[key] = value;

    });

    return json;
  };

  return recurse(this.data);
};

/**
 * @return {String} Stringified JSON
 */
Container.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

Container.prototype.parseJSON = function (raw) {

  if(!raw) return;

  var me = this;

  this.data = this.data || {};

  _.forEach(this.data, function(value, key) {

      if(raw[key] !== undefined) {
        me.data[key] = raw[key];
      }
  });

};

module.exports = Container;

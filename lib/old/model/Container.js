var _ = require("lodash");

/**
 * Abstract parent class with common methods
 * @abstract
 */
var Container = function () {

  this.container = null;
  this.serviceObject = null;

  this.data = {};

};

/**
 * Exposes setter and getter for a class from the `data` field
 */
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
 * Return the client reference
 * @return {Client} client
 */
Container.prototype.getClient = function () {
  return this.container && this.container.client;
};

/**
 * Return the Raptor instance wrapper
 * @return {Raptor} container Raptor instance reference
 */
Container.prototype.getContainer = function () {
  return this.container;
};

/**
 * @param {Raptor} container reference to Raptor instance wrapper
 */
Container.prototype.setContainer = function (c) {
  this.container = c;
};

/**
 * Set a reference to the parent object
 * @param {ServiceObject} object reference to the parent object
 */
Container.prototype.setServiceObject = function (s) {
  this.serviceObject = s;
  if(s && s.getContainer) {
    this.setContainer(s.getContainer());
  }
};

/**
 * @return {ServiceObject} object return the object reference if any
 */
Container.prototype.getObject = Container.prototype.getServiceObject = function () {
  return this.serviceObject;
};

/**
 * Validate the object and throw an exception if fails
 * @return {void}
 */
Container.prototype.validate = function () {
  throw new Error("Not implemented");
};

/**
 * Convert the instance to a js object
 * @return {Object} Plain js object
 */
Container.prototype.toJSON = function () {

  var recurse = function (obj) {
    var json = {};

    _.forEach(obj, function (value, key) {

      if(!value) {
        json[key] = value;
        return json;
      }

      if(value.toJSON) {
        json[key] = value.toJSON();
      } else if(value instanceof Array) {
        json[key] = recurse(value);
      } else if(typeof value === 'object') {
        json[key] = recurse(value);
      } else
        json[key] = value;

    });

    return json;
  };

  return recurse(this.data);
};

/**
 * Return a JSON string of this object
 * @return {String} json stringified JSON
 */
Container.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

/**
 * Parse a plain object and populate the corresponding fields in the current instance
 * @param {Object} raw the json object
 */
Container.prototype.parseJSON = function (raw) {

  if(!raw) return;

  if(typeof raw === 'string') {
    try {
      raw = JSON.parse(raw)
    } catch(e) {
      // not JSON
    }
  }

  var me = this;

  this.data = this.data || {};
  _.forEach(this.data, function (value, key) {
    if(raw[key] !== undefined) {
      me.data[key] = raw[key];
    }
  });

};

module.exports = Container;

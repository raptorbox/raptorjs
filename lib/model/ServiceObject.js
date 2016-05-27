var Promise = require('bluebird');
var _ = require('lodash');

var util = require('../util');
var client = require('../client');

var Action = require('./Action');
var Stream = require('./Stream');

/**
 *
 * The Service Object
 *
 * @param {Object} An optional object with the SO definition
 * @constructor
 */
var ServiceObject = function (obj, container) {

  this.data = {};

  this.data.id = null;
  this.data.name = null;
  // this.data.createdAt = new Date();

  this.data.settings = {
    storeEnabled: true,
    eventsEnabled: true
  };

  this.data.customFields = {};

  this.data.streams = {};
  this.data.actions = [];

  this.exportProperties();

  if(container) {
    this.setContainer(container);
  }

  if(obj) this.parseJSON(obj);
};
util.extends(ServiceObject, "Container");

/*
 * @return {String} The service object id
 */
ServiceObject.prototype.getId = function () {
  return this.data.id || null;
};

/*
 * @return {Number} The creation date as unix timestamp
 */
ServiceObject.prototype.getCreatedAt = function () {
  return this.data.createdAt || null;
};

ServiceObject.prototype.stream = function (name) {
  return this.data.streams[name];
};

ServiceObject.prototype.action = function (name) {
  return this.data.actions[name];
};

ServiceObject.prototype.toJSON = function () {
  var json = this.__super__.toJSON.call(this);
  var actions = [];
  _.forEach(json.actions, function(action, actionName) {
    actions.push(action);
  });
  json.actions = actions;
  return json;
};

/**
 * Deserialize JSON object to class
 */
ServiceObject.prototype.parseJSON = function (data) {

  this.__super__.parseJSON.call(this, data);

  this.setActions(data.actions);
  this.setStreams(data.streams);

  this.validate();
};

ServiceObject.prototype.validate = function () {

  if(!this.name)
    throw new Error("Object name is required");

  _.forEach(this.streams, function (stream, streamName) {
    stream.validate();
  });

  _.forEach(this.actions, function (action, actionName) {
    action.validate();
  });

};

ServiceObject.prototype.setActions = function (actions) {
  var me = this;
  if(!actions) return;

  this.data.actions = {};

  _.forEach(actions, function (raw, name) {

    if(typeof raw === 'string') {
      raw = {
        name: raw
      };
    }

    if(!raw.name && typeof name === 'string')
      raw.name = name;

    var action = new Action(raw);
    action.setServiceObject(me);

    me.data.actions[action.data.name] = action;
  });

};

ServiceObject.prototype.setStreams = function (streams) {
  var me = this;
  if(!streams) return;

  this.data.streams = {};

  _.forEach(streams, function (raw, name) {

    if(!raw.name && typeof name === 'string')
      raw.name = name;

    var stream = new Stream(raw);
    stream.setServiceObject(me);

    me.data.streams[stream.name] = stream;
  });
};

/**
 * Create a new ServiceObject definition and register it in the repository.
 * The unique ServiceObject id (soId) is returned on success.
 *
 * @return {ServiceObject} Self reference
 */
ServiceObject.prototype.create = function () {
  return client.post('/', this.toJSON())
    .then(function (res) {
      obj.id = res.id;
      obj.createdAt = res.createdAt;
      return Promise.resolve(obj);
    })
    .bind(this);
};

/**
 * Get the ServiceObject description
 *
 * @param {String} soId A service object Id
 *
 * @return {Promise} Promise of the request with the ServiceObject as argument
 */
ServiceObject.prototype.load = function (id) {
  return client.get('/' + this.getId()).then(function (obj) {
    this.parseJSON(obj);
    return Promise.resolve(this);
  });
};

/**
 * Update a Service Object
 *
 * @return {Promise} Promise of the request with the ServiceObject as argument
 */
ServiceObject.prototype.update = function (data) {
  return this.put('/' + this.getId(), data || this.toJSON())
    .then(function (obj) {
      this.parseJSON(obj);
      return Promise.resolve(this);
    })
    .bind(this);
};

/**
 * Delete a Service Object
 *
 * @param {String} Optional, the soid to delete
 *
 * @return {Promise} Promise of the request with a new empty so as argument
 */
ServiceObject.prototype.delete = function (soid) {
  return client.delete('/' + (soid || this.getId()))
    .then(function (obj) {
      this.parseJSON({});
      return Promise.resolve(null);
    })
    .bind(this);
};

module.exports = ServiceObject;

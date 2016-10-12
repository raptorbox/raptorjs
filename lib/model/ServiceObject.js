var Promise = require('bluebird');
var _ = require('lodash');
var d = require('debug')("raptorjs:ServiceObject");

var util = require('../util');

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

  var me = this;

  this.data = {};

  this.data.id = null;
  this.data.parentId = null;
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

  if(obj) {
    this.parseJSON(obj);
  }

  this.permissions = (function (p) {
    return {
      get: function (user) {
        return p.get(me, user);
      },
      set: function (user, permissions) {
        return p.set(me, permissions, user);
      }
    };
  })(container.auth.permissions);


};
util.extends(ServiceObject, "Container");

ServiceObject.prototype.setContainer = function (c) {
  this.container = c;
  this.client = c.client;
};

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
  _.forEach(json.actions, function (action) {
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

  if(data.actions !== undefined)
    this.setActions(data.actions);

  if(data.streams !== undefined)
    this.setStreams(data.streams);

  this.validate();
};

ServiceObject.prototype.validate = function () {

  if(!this.name)
    throw new Error("Object name is required");

  _.forEach(this.streams, function (stream) {
    stream.validate();
  });

  _.forEach(this.actions, function (action) {
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

    var action = new Action(raw, me);
    me.data.actions[action.data.name] = action;
  });

};

ServiceObject.prototype.addStream = function (name, def) {

  def = def || {};

  if(!def.channels) {
    def = {
      channels: def
    };
  }
  def.name = name;

  var stream = new Stream(def, this);

  this.streams[stream.name] = stream;
};

ServiceObject.prototype.setStreams = function (streams) {
  var me = this;
  if(!streams) return;

  this.data.streams = {};

  _.forEach(streams, function (raw, name) {
    me.addStream(name, raw);
  });
};

/**
 * Create a new ServiceObject definition and register it in the repository.
 * The unique ServiceObject id (soId) is returned on success.
 *
 * @return {ServiceObject} Self reference
 */
ServiceObject.prototype.create = function () {
  return this.client.post('/', this.toJSON())
    .bind(this)
    .then(function (res) {
      d("Created new object " + res.id);
      this.id = res.id;
      this.createdAt = res.createdAt;
      return Promise.resolve(this);
    });
};

/**
 * Get the ServiceObject description
 *
 * @param {String} soId A service object Id
 *
 * @return {Promise} Promise of the request with the ServiceObject as argument
 */
ServiceObject.prototype.load = function (id) {
  return this.client.get('/' + (id || this.getId()))
    .bind(this)
    .then(function (obj) {
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
  return this.client.put('/' + this.getId(), data || this.toJSON())
    .bind(this)
    .then(function (obj) {
      this.parseJSON(obj);
      return Promise.resolve(this);
    });
};

/**
 * Delete a Service Object
 *
 * @param {String} Optional, the soid to delete
 *
 * @return {Promise} Promise of the request with a new empty so as argument
 */
ServiceObject.prototype.delete = function (soid) {
  return this.client.delete('/' + (soid || this.getId()))
    .bind(this)
    .then(function () {
      this.parseJSON({});
      return Promise.resolve(null);
    });
};

/**
 * Get children
 *
 * @return {Promise} Promise of the request with a the list of children
 */
ServiceObject.prototype.getChildren = function () {
  return this.client.get('/' + this.getId() + '/children')
    .bind(this)
    .then(function (list) {
      var me = this;
      return Promise.resolve(list.map(function (raw) {
        return me.getContainer().fromJSON(raw);
      }));
    });
};

/**
 * Set children
 *
 * @return {Promise} Promise of the request with a the list of children
 */
ServiceObject.prototype.setChildren = function (list) {
  list = list instanceof Array ? list : [list]
  list = list.map(function (raw) {
    return raw.id || raw;
  })
  return this.client.post('/' + this.getId() + '/children', list).bind(this)
};

/**
 * Add a child
 *
 * @return {Promise} Promise of the request with a the list of children
 */
ServiceObject.prototype.addChild = function (obj) {
  return this.client.put('/' + this.getId() + '/children/' + (obj.id || obj)).bind(this)
};

/**
 * Remove a child
 *
 * @return {Promise} Promise of the request with a the list of children
 */
ServiceObject.prototype.removeChild = function (obj) {
  return this.client.delete('/' + this.getId() + '/children/' + (obj.id || obj)).bind(this)
};

/**
 * Subscribe for Service Object updates
 *
 * @return {EventEmitter} An emitter that will notify of updates
 */
ServiceObject.prototype.subscribe = function (fn) {
  var topic = this.getId() + "/events";
  return this.client.subscribe(topic, fn)
    .bind(this)
    .then(function (emitter) {
      return Promise.resolve(emitter);
    });
};

/**
 * Unsubscribe from Service Object updates
 */
ServiceObject.prototype.unsubscribe = function (fn) {
  var topic = this.getId() + "/events";
  return this.client.unsubscribe(topic, fn)
    .bind(this)
    .then(function (emitter) {
      return Promise.resolve(emitter);
    });
};

module.exports = ServiceObject;

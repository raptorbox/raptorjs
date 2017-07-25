var client = require('../client');
var util = require('../util');

/**
 * An action to be control execution on a remote object
 *
 * @constructor
 * @augments Container
 * @param {Object} data Action data
 * @param {ServiceObject} object reference to owner object
 */
var Action = function (data, serviceObject) {

  if(!serviceObject) {
    throw new Error("serviceObject parameter is required");
  }

  this.setServiceObject(serviceObject);
  this.client = this.getContainer().client;

  this.data = {
    name: null,
    description: null,
    status: {}
  };

  this.exportProperties();
  this.parseJSON(data);
};
util.extends(Action, 'Container');

/**
 * @inheritdoc
 */
Action.prototype.validate = function () {

  if(!this.data.name) {
    throw new Error("Action name is required");
  }

};

/**
 * @inheritdoc
 */
Action.prototype.toJSON = function () {
  var json = this.__super__.toJSON.call(this);
  if(!this.description && !Object.keys(this.status).length) {
    return this.name;
  }
  return json;
};

/**
 * @inheritdoc
 */
Action.prototype.parseJSON = function (data) {

  if(typeof data === 'string') {
    data = {
      name: data
    };
  }

  this.__super__.parseJSON.call(this, data);
  this.validate();
};

/**
 * Invoke the ServiceObject action
 *
 * @param {String} body The body of the request as STRING
 * @return {Promise} Promise callback with result
 */
Action.prototype.invoke = function (body) {

  var me = this;
  body = body || "";

  var url = this.serviceObject.id + '/actions/' + this.data.name;

  return client.request({
    method: 'POST',
    path: url,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: body.toString(),
  }).then(function (res) {

    if(res.id)
      this.status.id = res.id;

    if(res.createdAt)
      this.status.createdAt = res.createdAt;

    return Promise.resolve(me);
  }).bind(this);
};

/**
 * Reset the status of an action
 * */
Action.prototype.reset = function () {
  this.status.id = null;
  this.status.createdAt = null;
};

/**
 * Subscribe to receive updates for an action
 * */
Action.prototype.subscribe = function (fn) {
  var topic = this.getServiceObject().id + "/actions/" + this.name;
  return this.client.subscribe(topic, fn).bind(this);
};

/**
 * Unsubscribe from updates for an action
 * */
Action.prototype.subscribe = function (fn) {
  var topic = this.getServiceObject().id + "/actions/" + this.name;
  return this.client.subscribe(topic, fn).bind(this);
};

/**
 * Get the status of an action
 *
 * @param {mixed} newStatus optional, set a new status of the action
 * @return {Promise} Promise callback with result
 */
Action.prototype.status = function (newStatus) {

  var url = this.serviceObject.id + '/actions/' + this.data.id;
  var isSet = (newStatus !== undefined);

  return client.request({
    method: isSet ? 'PUT' : 'GET',
    path: url,
    headers: {
      'Content-Type': isSet ? 'text/plain' : 'application/json'
    },
    body: isSet ? newStatus : null,
  });
};

/**
 * Cancel a launched action
 * @return {Promise} Promise callback with result
 */
Action.prototype.cancel = function () {
  var url = this.serviceObject.id + '/actions/' + this.data.id;
  return client.delete(url).then(function () {
    this.status = {};
    return Promise.resolve();
  }).bind(this);
};

module.exports = Action;

var _ = require('lodash');

var client = require('../client');
var util = require('../util');

var Action = function (data, serviceObject) {

  this.setServiceObject(serviceObject);
  this.data = {
    name: null,
    description: null,
    status: {}
  };
  this.exportProperties();
  this.parseJSON(data);
};
util.extends(Action, 'Container');

Action.prototype.validate = function () {

  if(!this.data.name) {
    throw new Error("Action name is required");
  }

};

Action.prototype.toJSON = function () {
  var json = this.__super__.toJSON.call(this);
  if(!this.description && !Object.keys(this.status).length) {
    return this.name;
  }
  return json;
}

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

  var url = this.serviceObject.id + '/actuations/' + this.data.name;

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
 * Reset the status of an actuation
 * */
Action.prototype.reset = function () {
  this.status.id = null;
  this.status.createdAt = null;
};

/**
 * Get the status of an actuation
 *
 * @param {mixed} newStatus optional, set a new status of the actuation
 * @return {Promise} Promise callback with result
 */
Action.prototype.status = function (newStatus) {

  var url = this.serviceObject.id + '/actuations/' + this.data.id;
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
 * Cancel a launched actuation
 *
 * @return {Promise} Promise callback with result
 */
Action.prototype.cancel = function () {
  var url = this.serviceObject.id + '/actuations/' + this.data.id;
  return client.delete(url).then(function() {
    this.status = {};
    return Promise.resolve();
  }).bind(this);
};

module.exports = Action;

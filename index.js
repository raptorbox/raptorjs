/**
Copyright 2016 CREATE-NET

@author Luca Capra <luca.capra@create-net.org>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var d = require("debug")("raptorjs:index");

var Promise = require("bluebird");
var _ = require("lodash");

var client = require('./lib/client');

var ServiceObject = require("./lib/model/ServiceObject");

var Raptor = function (config) {

  var instance = this;

  var defaultConfig = {
    apiKey: null,
    username: null,
    password: null,
    url: "https://api.raptorbox.eu",
    debug: false
  };

  config = config || {};

  if(typeof config === 'string') {
    config = {
      apiKey: config
    };
  }

  this.config = {};

  _.each(defaultConfig, function(val, key) {
    instance.config[key] =
      (config[key] === undefined) ? val : config[key];
  });

  if(instance.config.apiKey) {
    var apikeyPrefix = "Bearer ";
    if(instance.config.apiKey.substr(0, apikeyPrefix.length) !== apikeyPrefix ) {
      instance.config.apiKey = apikeyPrefix + instance.config.apiKey;
    }
  }

  var me = this;

  this.isBrowser = (typeof window !== 'undefined');

  if(this.isBrowser) {
    d("Running in browser");
  }

  d("Client configuration: %j", this.config);

  /**
   * Return a API client instance
   */
  this.client = client.create(this);

  // add Promise reference
  this.Promise = Promise;

  this.newObject = function (data) {
    var obj = new ServiceObject(data, instance);
    return obj;
  };

  /**
   * Create a Service Object from an object or a WebObject
   *
   * @param {Object} wo ServiceObject compatible definition object or WebObject
   *
   * @return {Promise} Promise for the future ServiceObject created
   * */
  this.create = function (data) {
    var obj = instance.newObject(data);
    return obj.create();
  };

  /**
   * Delete a Service Object by id
   *
   * @param {String} soid ServiceObject id
   *
   * @return {Promise} Promise for the future result of the operation
   * */
  this.delete = function (id) {
    var obj = instance.newObject({
      id: id
    });
    return obj.delete();
  };

  /**
   * @param {String} id ServiceObject id
   *
   * @return {Promise} A promise with the created SO
   */
  this.load = function (id) {
    var obj = instance.newObject({
      id: id,
      name: "unknown"
    });
    return obj.load();
  };

  /**
   * Retrieve all the Service Objects from a given user (identified by the Authorization header).
   *
   * @return {Promise}
   */
  this.list = function () {
    return instance.client.get('/').then(function (data) {
      var json = (typeof data === 'string') ? JSON.parse(data) : data;
      return Promise.resolve(json);
    });
  };

  /**
   * Search for Service Objects.
   * Example parameters:
   * 1) free-form query: { query: "some params" }
   * 2) field params:
   * {
   *   name: "Object Name",
   *   description: "optional description"
   *   customFields: {
   *      param1: "value"
   *   }
   * }
   *
   *
   * @params Object search parameters
   * @return {Promise}
   */
  this.find = this.search = function (params) {
    if(typeof params === 'string') {
      params = { search: params };
    }
    return instance.client.post('/search', params)
      .then(function (data) {
        var json = (typeof data === 'string') ? JSON.parse(data) : data;
        return Promise.resolve(json);
      });
  };

  this.fromJSON = function (json) {
    if(typeof json === 'string') json = JSON.parse(json);
    return instance.newObject(json);
  };


  // Auth related API
  var _authBasePath = this.config.authBasePath === undefined ? '/auth' : this.config.authBasePath;
  this.authBasePath = function(u) {
    return _authBasePath + u;
  }

  this.auth = require('./lib/auth/index')(this);

  this.getUser = function(info) {
    return instance.auth.getUser(info)
  };

  this.setUser = function(user) {
    return instance.auth.setUser(user)
  };

  this.setToken = function(token) {
    return instance.auth.setToken(token)
  };

};

module.exports = Raptor;
module.exports.RecordSet = require("./lib/model/RecordSet");
module.exports.ResultSet = require("./lib/model/ResultSet");

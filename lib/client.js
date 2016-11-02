
var _ = require("lodash");

/**
 * A Raptor client integrating HTTP and MQTT(+WS)
 * @constructor
 * @param {Raptor} container Raptor wrapper instance
 */
var Client = function(container) {

  var http = require("./client/http");
  var mqtt = require("./client/mqtt");

  var client = this;

  var httpClient = http.create(container);
  _.forEach(httpClient, function(fn, k) {
    client[k] = fn;
  });

  var mqttClient = mqtt.create(container);
  _.forEach(mqttClient, function(fn, k) {
    client[k] = fn;
  });

};

module.exports = Client;

var c = module.exports;

var _ = require("lodash");

c.create = function(opts) {

  var http = require("./client/http");
  var mqtt = require("./client/mqtt");

  var client = {};

  httpClient = http.create(opts);
  _.forEach(httpClient, function(fn, k) {
    client[k] = fn;
  });

  mqttClient = mqtt.create(opts);
  _.forEach(mqttClient, function(fn, k) {
    client[k] = fn;
  });

  return client;
};

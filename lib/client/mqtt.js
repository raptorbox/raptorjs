var Client = module.exports;

var Promise = require('bluebird');
var d = require("debug")("raptorjs:client:mqtt");

Client.create = function (container) {

  var emit = function() {
    container.emit.apply(container, arguments)
  };

  var opts = container.config;

  var client;
  var instance = {};

  var ee = require('event-emitter');
  // var hasListeners = require('event-emitter/has-listeners');

  var emitter = ee({});

  var parseJSON = function (msg) {
    try {
      return JSON.parse(msg);
    } catch(e) {
      //foo
    }
    return msg;
  };

  instance.emitter = emitter;

  instance.connect = function () {

    var mqttConnect = function (currentUser) {
      return new Promise(function (resolve, reject) {

        var url = require("url").parse(opts.url);

        var mqttUrl = "mqtt://" + url.hostname + ":1883";

        var withCred = "credentials"
        var username = currentUser.username;
        var password = currentUser.password || opts.password;

        if(opts.apiKey && !password) {
          withCred = "apiKey"
          username = ""
          password = opts.apiKey;
        }

        d("Connecting to %s with %s", mqttUrl, withCred);

        var mqtt = require("mqtt");
        client = mqtt.connect(mqttUrl, {
          protocolId: 'MQTT',
          protocolVersion: 4,
          username: username,
          password: password,
        });
        instance.client = client;

        var onError = function (e) {
          d("Connection error", e);

          emit("error", e)

          client.removeListener('connect', onConnect);
          client.removeListener('error', onError);

          reject(e);
        };
        var onConnect = function () {
          d("Connected");

          emit("connected")

          client.removeListener('connect', onConnect);
          client.removeListener('error', onError);

          resolve();
        };

        client.on('connect', onConnect);
        client.on('error', onError);

        client.on('error', function (e) {
          emitter.emit("error", e);
        });

        client.on("message", function (topic, message) {

          var msg = parseJSON(message.toString());

          d("Received message: %j", msg);

          emit("message", {
            topic: topic,
            message: msg
          });

          emitter.emit("message", msg);
          emitter.emit(topic, msg);
        });

      });
    };

    return container
      .auth.getUser()
        .then(mqttConnect);

  };
  instance.subscribe = function (topic, fn) {
    return instance.connect().then(function () {
      d("Subscribing to %s", topic);
      client.subscribe(topic, function () {
        emit("subscribed", topic);
        d("Subscribed");
      });
      if(fn) emitter.on(topic, fn);
      return Promise.resolve(emitter);
    });
  };
  instance.unsubscribe = function (topic, fn) {
    return instance.connect().then(function () {
      d("Unsubscribing from %s", topic);
      client.unsubscribe(topic, function () {
        emit("unsubscribed", topic);
        d("Unsubscribed");
      });
      if(fn) emitter.off(topic, fn);
      return Promise.resolve(emitter);
    });
  };

  return instance;
};

var Client = module.exports;

var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');

var d = require("debug")("raptorjs:client");

Client.instance = function(opts) {

  var defaultsOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': opts.apiKey
    },
    baseUrl: opts.url,
    json: true
  };

  var client = request.defaults(defaultsOptions);

  d("Created new client " + defaultsOptions.baseUrl);

  var instance = {};
  instance.request = function(options) {
    return new Promise(function(resolve, reject) {

      options = options || {};

      if(options.headers) {
        Object.keys(defaultsOptions.headers)
          .forEach(function(header) {
            if(options.headers[header] === undefined) {
              options.headers[header] = defaultsOptions.headers[header];
            }
          });
      }

      d("Performing request ", options);
      client(options, function(err, res, body) {

        if(err) return reject(err);

        var json;
        try {
          json = JSON.parse(body);
        }
        catch(e) {
          json = body;
        }

        if(res.statusCode >= 400)
          return reject(new Error(
            res.statusCode + " " + res.statusMessage + ": " + json
          ));

        // d("Request response", json);
        resolve(json);
      });

    });
  };

  instance.get = function(url) {
    return instance.request({
      method: 'GET',
      url: url
    });
  };

  instance.delete = function(url) {
    return instance.request({
      method: 'DELETE',
      url: url
    });
  };

  instance.put = function(url, data) {
    return instance.request({
      method: 'PUT',
      url: url,
      body: data
    });
  };

  instance.post = function(url, data) {
    return instance.request({
      method: 'POST',
      url: url,
      body: data
    });
  };

  instance.client = client;

  return instance;
};

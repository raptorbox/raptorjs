var Client = module.exports;

var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');



Client.instance = function(opts) {

  var defaultsOptions = _.cloneDeep(opts);
  var client = request.defaults(opts);

  client.request = function(options) {
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

      baseClient(options, function(err, res) {
        if(err) return reject(err);
        resolve(res);
      });

    });
  };

  client.get = function(url) {
    return client.request({
      method: 'GET',
      url: url
    });
  };

  client.delete = function(url) {
    return client.request({
      method: 'DELETE',
      url: url
    });
  };

  client.put = function(url, data) {
    return client.request({
      method: 'PUT',
      url: url,
      body: data
    });
  };

  client.post = function(url, data) {
    return client.request({
      method: 'POST',
      url: url,
      body: data
    });
  };

};

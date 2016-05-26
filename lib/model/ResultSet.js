var util = require('../util');

/**
 * @param {Array} data A list of values
 * @returns {ResultSet} An object containing the data
 */
var ResultSet = function (data) {
  this.__super__.constructor.call(this);
  this.data = (data && data.length) ? data : [];
  this.__$container = null;
};
util.extends(ResultSet, 'Enumerable');

/**
 * Return an object at a specific index
 * */
ResultSet.prototype.at = function (i) {
  return this.get(i);
};

/**
 * Return an object in the list. If index is not provided, the current cursor position will be used
 *
 * @param {Number} index Optional, index in the list
 * @param {String} channel The channel name
 * @param {mixed} defaultValue A default value if the requested channel is not available
 *
 * @returns {Object|mixed} A value set if index is provided, if channel is provided, its value
 */
ResultSet.prototype.get = function (index, channel, defaultValue) {

  // BEWARE: !== doesn't work!
  if(arguments[0] * 1 != arguments[0]) {
    return this.get(this.index(), arguments[0], arguments[1]);
  }

  defaultValue = (typeof defaultValue === 'undefined') ? null : defaultValue;

  var list = this.getList();
  var data = list[index];

  if(data) {

    var channels = data.channels;

    if(!channels) return null;

    if(channel && typeof channels[channel] !== 'undefined') {
      return channels[channel]['current-value'];
    }

    // add a get function to retrieve a single value without the full json path
    data.get = function (_channel, _defaultValue) {

      _defaultValue = (typeof _defaultValue === 'undefined') ? null : _defaultValue;

      if(_channel && data.channels[_channel] && typeof data.channels[_channel] !== 'undefined') {
        return data.channels[_channel]['current-value'];
      }

      return _defaultValue;
    };

    // returns a simple js object with key-value pairs of data
    data.asObject = data.toJson = data.toJSON = function () {

      var res = {
        channels: {},
        lastUpdate: data.lastUpdate
      };

      Object.keys(data.channels).forEach(function(i) {
        res.channels[i] = data.channels[i]['current-value'];
      });

      return res;
    };

    return data;
  }

  return null;
};

module.exports = ResultSet;

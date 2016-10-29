var _ = require('lodash');

var util = require('../util');

var RecordSet = require('./RecordSet');
var ResultSet = require('./ResultSet');
var Channel = require('./Channel');

/**
 * A Stream object
 * @constructor
 * @param {Object} obj An object with the Stream properties
 */
var Stream = function (data, serviceObject) {

  this.data = {
    name: null,
    description: null,
    type: null,
    channels: {},
  };

  if(!serviceObject) {
    throw new Error("Missing serviceObject parameter on Stream creation");
  }

  this.setServiceObject(serviceObject);
  this.client = this.getContainer().client;

  this.exportProperties();

  if(data) this.parseJSON(data);
};
util.extends(Stream, 'Container');

Stream.prototype.validate = function () {

  if(!this.name)
    throw new Error("Stream name is required");

  if(!this.channels || !_.size(this.channels))
    throw new Error("At least one stream channel is required");

  _.forEach(this.channels, function (channel, channelName) {
    channel.validate();
  });

};

Stream.prototype.toJSON = function () {
  var json = this.__super__.toJSON.call(this);
  json.channels = {};
  _.forEach(this.channels, function (channel, name) {
    json.channels[channel.name] = channel.toJSON();
  });

  return json;
};

Stream.prototype.parseJSON = function (data) {

  var me = this;

  var parseChannels = function (channelsData) {
    _.forEach(channelsData, function (raw, channelName) {

      if(typeof raw === 'string') {
        raw = {
          name: channelName,
          type: raw
        };
      }

      if(!raw.name && typeof channelName === "string")
        raw.name = channelName;

      var channel = new Channel(raw, me);
      me.channels[channel.name] = channel;
    });
  };

  if(data.name)
    this.data.name = data.name;

  if(data.description)
    this.data.description = data.description;

  if(data.type)
    this.data.type = data.type;

  if(data.channels) {
    parseChannels(data.channels);
  }

};

/**
 * Create a pubsub subscription for the stream
 * @return {Promise} A promise for the subscription object creation
 */
Stream.prototype.subscribe = function (fn) {
  var topic = this.getServiceObject().id + '/streams/' + this.data.name + '/updates';
  return this.client.subscribe(topic, fn).bind(this);
};

/**
 * Remove a subscription for a stream
 *
 * @param {Function} fn Callback to be called when data is received
 * @return {Stream} The current stream
 */
Stream.prototype.unsubscribe = function (fn) {
  var topic = this.serviceObject.id + '/streams/' + this.data.name + '/updates';
  return this.client.unsubscribe(topic, fn).bind(this);
};

/**
 * Send data to a ServiceObject stream
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.push = function (data, lastUpdate) {

  var url = '/' + this.getServiceObject().id + '/streams/' + this.name;

  var record = new RecordSet(data, this);
  if(lastUpdate) record.setLastUpdate(lastUpdate);

  return this.client.put(url, record);
};

/**
 * Retieve data from a ServiceObject stream
 *
 * @param {String} timeModifier  optional, possible values: lastUpdate, 1199192940 (time ago as timestamp)
 * @param {int} size             optional, the number of elements to return
 * @param {int} from             optional, the first value to get from the list for paging
 *
 * @return {Promise}             Promise callback with result
 */
Stream.prototype.pull = function (timeModifier, size, offset) {

  timeModifier = timeModifier || "";
  if(timeModifier && timeModifier !== 'lastUpdate') {
    var isDate = util.parseDate(timeModifier, false);
    if(isDate) {
      timeModifier = util.toUNIX(timeModifier);
    }
    else timeModifier = 'lastUpdate';
  }

  var qs = util.createQueryString(size, offset);
  var url = '/' + this.getServiceObject().id + '/streams/' + this.name + '/' + timeModifier + qs;
  return this.client.get(url, null).bind(this).then(function (res) {
    return Promise.resolve(new ResultSet((res instanceof Array) ? res : [res], this));
  });
};

/**
 * Retieve last updated data from a ServiceObject stream
 *
 * @return {Promise}             Promise callback with result
 */
Stream.prototype.lastUpdate = function () {
  return this.pull('lastUpdate').then(function(resultset) {
    return Promise.resolve(resultset.get(0))
  })
};

/**
 * Search data of a ServiceObject stream
 *
 * @param {Object} params      search params
 * @param {int} size            optional, the number of elements to return
 * @param {int} offset            optional, the first value to get from the list for paging
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.search = function (params, size, offset) {

  if(!params) {
    return Promise.reject(new Error("No params provided for search"));
  }

  var qs = util.createQueryString(size, offset);

  var url = '/' + this.getServiceObject().id + '/streams/' + this.name + '/search' + qs;
  var query = require('./search/parser').parse(params, this);

  return this.getClient().post(url, query).bind(this).then(function (res) {
    return Promise.resolve(new ResultSet(res, this));
  });
};

/**
 * Search data of a ServiceObject by distance from a point
 *
 * @param {Object} position An object representing a geo-position, eg `{ latitude: 123 , longitude: 321 }`
 * @param {Number} distance The distance value
 * @param {String} unit Optional unit, default to `km`
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.searchByDistance = function (position, distance, unit) {
  return this.search({
    distance: {
      position: position,
      value: distance,
      unit: unit
    }
  });
};

/**
 * Search data of a ServiceObject in a Bounding Box
 *
 * @param {Array} bbox An array of 4 elements representing the bounding box, eg
 *                      ```
 *                      [
 *                          upperLat, upperLng,
 *                          bottomLat, bottomLng
 *                      ]
 *                      ```
 *                or an Array with 2 elements each one as an object eg
 *                      ```
 *                      [
 *                          { latitude: 123, longitude: 321 }, // upper
 *                          { latitude: 321, longitude: 123 }  // bottom
 *                      ]
 *                      ```
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.searchByBoundingBox = function (bbox) {
  return this.search({
    bbox: {
      coords: bbox
    }
  });
};

/**
 * Search text for a channel of a ServiceObject stream
 *
 * @param {String} channel The channel name where to search in
 * @param {Number} string The string query to search for
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.searchByText = function (channel, string) {
  return this.search({
    match: {
      string: string,
      channel: channel
    }
  });
};

/**
 * Search data by the update time range of a ServiceObject stream
 *
 * @param {Object} params An object with at least one of `from` or `to` properties
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.searchByTime = function (params) {
  if(!(typeof params == "object" && (params.from || params.to))) {
    params = {
      from: util.parseDate(arguments[0]),
      to: arguments[1] ? util.parseDate(arguments[1]) : null
    };
  }
  return this.search({
    time: params
  });
};

/**
 * Search data by a numeric value of a ServiceObject stream
 *
 * @param {String} channel Channel name to search for
 * @param {Object} params An object with at least one of `from` or `to` properties
 *
 * @return {Promise} Promise callback with result
 */
Stream.prototype.searchByNumber = function (channel, params) {
  if(typeof params !== 'object') {
    params = {
      from: arguments[1],
      to: arguments[2]
    };
  }
  params.channel = channel;
  return this.search({
    numeric: params
  });
};

module.exports = Stream;

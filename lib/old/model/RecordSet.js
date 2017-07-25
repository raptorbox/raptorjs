var util = require('../util');
var _ = require('lodash');

/**
 * Contains a record of a stream
 * @constructor
 * @augments Container
 * @param {Object} raw raw data object
 * @param {Stream} stream stream reference
 */
var RecordSet = function (raw, stream) {

  this.data = {
    channels: {},
    timestamp: null,
    userId: null,
    objectId: null,
    streamId: null
  };

  this.setStream(stream);
  this.exportProperties();

  if(raw) this.fromJSON(raw);
};
util.extends(RecordSet, 'Container');
/**
 * @inheritdoc
 */
RecordSet.prototype.fromJSON = function (raw) {
  if(raw.channels) {
    this.setChannels(raw.channels);
    if(raw.timestamp) {
      this.setTimestamp(raw.timestamp);
    }
  } else {
    if(typeof raw === 'object') {
      this.setChannels(raw);
    }
  }
  this.validate();
};
/**
 * @inheritdoc
 */
RecordSet.prototype.toJSON = function () {

  var me = this;
  var json = {
    channels: {},
    timestamp: util.toUNIX(this.timestamp || new Date())
  };

  this.getChannelList().forEach(function (name) {
    json.channels[name] = json.channels[name] || {};
    json.channels[name] = me.data.channels[name];
  });

  return json;
};
/**
 * @inheritdoc
 */
RecordSet.prototype.validate = function () {

  var me = this;

  if(!this.stream) return;

  _.forEach(this.stream.channels, function (channel) {

    var val = me.channels[channel.name];
    if(val === null || val === undefined) return;

    var type = channel.dataTypes.get(channel.type);
    if(!type) {
      throw new Error("Unsupported data type: " + channel.type);
    }

    if(!type.validate(val)) {
      throw new Error("Data type validation failed for " + channel.name);
    }

  });

};

/**
 * Set a stream reference
 * @param {Stream} stream a stream object reference
 */
RecordSet.prototype.setStream = function (s) {
  this.stream = s;
  if(s && s.getServiceObject) {
    this.setServiceObject(s.getServiceObject());
  }
};

/**
 * Get a stream reference
 * @return {Stream} stream the stream object reference
 */
RecordSet.prototype.stream = RecordSet.prototype.getStream = function () {
  return this.stream;
};

/**
 * Get the list of known channels
 * @param {Array} channels labels of channels
 */
RecordSet.prototype.getChannelList = function () {
  if(this.getStream()) {
    return Object.keys(this.getStream().channels);
  }
  return Object.keys(this.channels);
};

/**
 * Get channel value
 * @param {Mixed} value channel value
 */
RecordSet.prototype.getChannel = function (name) {
  return this.channels[name];
};

/**
 * Set channels and values
 * @param {Mixed} channels key/value map of channels & values
 */
RecordSet.prototype.setChannels = function (channels) {
  var me = this;
  var channelsList = this.getChannelList();
  channelsList.forEach(function (channelName) {
    if(channels[channelName] === undefined) return;

    // use legacy format with current-value
    if(channels[channelName]['current-value'] !== undefined) {
      me.channels[channelName] = channels[channelName]['current-value']
      return;
    }

    me.channels[channelName] = channels[channelName]
  });
};

/**
 * Set the timestamp reference of this record
 * @param {Mixed} timestamp a parsable time reference. Can be a timestamp of millis/seconds or Date
 */
RecordSet.prototype.setTimestamp = function (timestamp) {
  this.data.timestamp = util.parseDate(timestamp);
};

/**
 * Get the timestamp reference of this record
 * @param {Date} timestamp the Date reference related to this record
 */
RecordSet.prototype.getTimestamp = function () {
  return this.timestamp;
};

module.exports = RecordSet;

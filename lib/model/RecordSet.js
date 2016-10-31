var util = require('../util');
var _ = require('lodash');

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

RecordSet.prototype.setStream = function (s) {
  this.stream = s;
  if(s && s.getServiceObject) {
    this.setServiceObject(s.getServiceObject());
  }
};

RecordSet.prototype.getStream = function () {
  return this.stream;
};

RecordSet.prototype.getChannelList = function () {
  if(this.getStream()) {
    return Object.keys(this.getStream().channels);
  }
  return Object.keys(this.channels);
};

RecordSet.prototype.getChannel = function (name) {
  return this.channels[name];
};

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

RecordSet.prototype.setTimestamp = function (timestamp) {
  this.data.timestamp = util.parseDate(timestamp);
};

RecordSet.prototype.getTimestamp = function () {
  return this.timestamp;
};

module.exports = RecordSet;

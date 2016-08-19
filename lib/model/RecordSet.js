var util = require('../util');
var _ = require('lodash');

var RecordSet = function (raw, stream) {

  this.data = {
    channels: {},
    lastUpdate: null,
  };

  this.setStream(stream);
  this.exportProperties();

  if(raw) this.fromJSON(raw);
};
util.extends(RecordSet, 'Container');

RecordSet.prototype.fromJSON = function (raw) {
  if(raw.channels) {
    this.setChannels(raw.channels);
    if(raw.lastUpdate) {
      this.setLastUpdate(raw.lastUpdate);
    }
  }
  else {
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
    lastUpdate: util.toUNIX(this.lastUpdate || new Date())
  };

  this.getChannelList().forEach(function(name) {
    json.channels[name] = json.channels[name] || {};
    json.channels[name]['current-value'] = me.data.channels[name];
  });

  return json;
};

RecordSet.prototype.validate = function (s) {

  var me = this;

  if(!this.stream) return;

  _.forEach(this.stream.channels, function(channel) {

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

  this.getChannelList().forEach(function(channelName) {
    if(!channels[channelName]) return;
    me.channels[channelName] = channels[channelName]['current-value'] || channels[channelName];
  });
};

RecordSet.prototype.setLastUpdate = function (lastUpdate) {
  this.data.lastUpdate = util.parseDate(lastUpdate);
};

RecordSet.prototype.getLastUpdate = function () {
  return this.lastUpdate;
};

module.exports = RecordSet;

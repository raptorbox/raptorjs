var util = require('../util');

var RecordSet = function (values, lastUpdate, stream) {

  this.channels = {};
  this.stream = stream;
  this.lastUpdate = new Date();

  this.setChannels(values.channels || values);
  if(values.lastUpdate)
    this.setLastUpdate(values.lastUpdate);

  this.validate();
};
util.extends(RecordSet, 'Container');

RecordSet.prototype.setChannels = function (channels) {
  var me = this;
  Object.keys(channels).forEach(function(channelName) {
    me.channels[channelName] = channels[channelName];
  });
};

RecordSet.prototype.setLastUpdate = function () {

  // default value
  if(typeof lastUpdate === 'undefined') {
    lastUpdate = new Date();
  }

  if(typeof lastUpdate === 'string' || typeof lastUpdate === 'number') {
    lastUpdate = new Date(lastUpdate);
  }

  if(lastUpdate instanceof Date) {
    lastUpdate = lastUpdate.getTime();
  }

  if(!lastUpdate) {
    throw new Error("Cannot set lastUpdate value");
  }

  // // convert from milliseconds to seconds
  // if(lastUpdate.toString().length === 13) {
  //   lastUpdate = Math.floor(lastUpdate / 1000);
  // }

};

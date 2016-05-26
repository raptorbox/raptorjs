
var _ = require('lodash');

var util = require('../util');
var client = require('../client');

/**
 * A Stream object
 * @constructor
 * @param {Object} obj An object with the Stream properties
 */
var Channel = function (data, stream) {

  this.dataTypes = require("../data-types");

  this.data = {
    unit: null,
    name: null,
  };
  this.setStream(stream);

  if(data)
    this.parseJSON(data);

};
util.extends(Channel, 'Container');

Channel.prototype.setStream = function (stream) {
  this.stream = stream;
  if(stream.getServiceObject)
    this.setServiceObject(stream.getServiceObject());
};

Channel.prototype.parseJSON = function (data) {

  if(data.name)
    this.data.name = data.name;

  if(data.unit)
    this.data.unit = data.unit;

  if(data.type)
    this.data.type = data.type;

  this.validate();
};

Channel.prototype.validate = function () {

  if(!this.data.name)
    throw new Error("Channel name is required");

  if(!this.data.type)
    throw new Error("Channel type is required");

  if(!this.dataTypes.exists(this.data.type))
    throw new Error("Channel type is `"+ this.data.type +"` not supported");

};

module.exports = Channel;

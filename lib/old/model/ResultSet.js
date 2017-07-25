
var _ = require('lodash');

var RecordSet = require('./RecordSet');
var util = require('../util');

/**
 * An object containing a collection of RecordSet
 * @constructor
 * @param {Array} data A list of values
 * @returns {ResultSet} An object containing the data
 */
var ResultSet = function (data, stream) {
  this.data = [];
  this.setStream(stream);
  if(data) this.fromJSON(data);
};
util.extends(ResultSet, 'Container');

/**
 * @inheritdoc
 */
ResultSet.prototype.fromJSON = function (data) {
  var me = this;
  _.forEach(data, function(rawRecord) {
    me.data.push(new RecordSet(rawRecord, me.getStream()));
  });
  this.validate();
};

/**
 * @inheritdoc
 */
ResultSet.prototype.toJSON = function () {
  return this.data.map(function(r) {
    return r.toJSON();
  });
};

/**
 * @inheritdoc
 */
ResultSet.prototype.validate = function () {
  _.forEach(this.data, function(record) {
    record.validate();
  });
};

/**
 * Set a stream reference
 * @param {Stream} stream a stream object reference
 */
ResultSet.prototype.setStream = function (s) {
  this.stream = s;
  if(s && s.getServiceObject) {
    this.setServiceObject(s.getServiceObject());
  }
};

/**
 * Get a stream reference
 * @return {Stream} stream the stream object reference
 */
ResultSet.prototype.stream = ResultSet.prototype.getStream = function () {
  return this.stream;
};

/**
 * Return a RecordSet at the specified index if available
 * @param {Number} idx Index position
 * @return {RecordSet} record record object
 */
ResultSet.prototype.get = function (idx) {
  return this.data[idx] || null;
};

/**
 * Return the count of available records
 * @return {Number} length count of records
 */
ResultSet.prototype.size = function () {
  return this.data.length;
};


module.exports = ResultSet;

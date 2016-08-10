
var _ = require('lodash');

var RecordSet = require('./RecordSet');
var util = require('../util');

/**
 * @param {Array} data A list of values
 * @returns {ResultSet} An object containing the data
 */
var ResultSet = function (data, stream) {
  this.data = [];
  this.setStream(stream);
  if(data) this.fromJSON(data);
};
util.extends(ResultSet, 'Container');

ResultSet.prototype.fromJSON = function (data) {
  _.forEach(data, function(rawRecord) {
    this.data.push(new RecordSet(rawRecord));
  });
  this.validate();
};

ResultSet.prototype.validate = function () {
  _.forEach(this.data, function(record) {
    record.validate();
  });
};

ResultSet.prototype.setStream = function (s) {
  this.stream = s;
  if(s && s.getServiceObject) {
    this.setServiceObject(s.getServiceObject());
  }
};


module.exports = ResultSet;

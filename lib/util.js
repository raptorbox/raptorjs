
var _ = require('lodash');

var util = module.exports;

util.extends = function(Child, Parent) {

  if(typeof Parent === 'string') {
    Parent = require('./model/' + Parent);
  }

  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
  Child.prototype.__super__ = Parent.prototype;
};

util.createQueryString = function (size, offset) {
  if(size || offset !== undefined) {
    var obj = {};
    if(size) obj.size = size;
    if(from !== undefined) obj.offset = offset;
    return util.buildQueryString(obj);
  }
  return '';
};

util.buildQueryString = function (obj, prefix) {
    var qs = '';
    var qsparts = [];
    for(var key in obj) {
        qsparts.push(key + '=' + obj[key]);
    }
    qs = (prefix === undefined ? '?' : prefix) + qsparts.join('&');
    return qs;
};

util.parseDate = function(lastUpdate, defaultValue) {
  if(typeof lastUpdate === 'undefined') {
    return new Date();
  }
  if(lastUpdate instanceof Date) {
    return lastUpdate;
  }
  if(typeof lastUpdate === 'string' || typeof lastUpdate === 'number') {
    return new Date(lastUpdate);
  }
  // cannot parse, use default if defined
  if(defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error("Cannot parse date value " + lastUpdate);
};

util.toUNIX = function(value) {
  value = value || new Date();
  var lastUpdate = util.parseDate(value);
  return Math.round(lastUpdate.getTime() / 1000);
};


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

util.buildQueryString = function (obj, prefix) {
    var qs = '';
    var qsparts = [];
    for(var key in obj) {
        qsparts.push(key + '=' + obj[key]);
    }
    qs = (prefix === undefined ? '?' : prefix) + qsparts.join('&');
    return qs;
};

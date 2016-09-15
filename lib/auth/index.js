
var Promise = require('bluebird');
var User = require('./User');

var Auth = function(container) {

  this.container = container;
  this.client = container.client;
  this.config = container.config;

  this.currentUser = null;

  this.roles = require('./roles')(container);
  this.users = require('./users')(container);
};

Auth.prototype.getUser = function (cfg) {
  if(this.currentUser) {
    return Promise.resolve(this.currentUser);
  }
  if(this.config.apiKey) {
    if(!this.currentUser) {
      this.currentUser = new User(cfg);
    }
    return Promise.resolve(this.currentUser);
  }
  return this.login(cfg);
};

Auth.prototype.login = function (info) {
  var me = this;
  info = info || this.config;
  return this.client.post('/login', info).then(function(res) {
    res.username = info.username;
    me.currentUser = new User(res);
    me.container.config.apiKey = res.token;
    return Promise.resolve(me.currentUser);
  });
};

Auth.prototype.logout = function () {
  var me = this;
  return this.client.delete('/login').then(function() {
    me.currentUser = null;
    me.container.config.apiKey = null;
    return Promise.resolve();
  });
};

Auth.prototype.refreshToken = function () {
  throw new Error("Auth.refreshToken() not implemented!");
};

module.exports = function(c) {
  return new Auth(c);
};

var Promise = require('bluebird');
var User = require('../model/User');

var d = require("debug")("raptorjs:auth")

var Auth = function (container) {

  this.container = container
  this.client = container.client
  this.config = container.config

  this.__currentUser = null

  this.roles = require('./roles')(container)
  this.users = require('./users')(container)
  this.permissions = require('./permissions')(container)
  this.tokens = require('./tokens')(container)
};

Auth.prototype.setUser = function (user) {
  this.currentUser(user)
};

Auth.prototype.setToken = function (token) {
  this.config.apiKey = token
};

Auth.prototype.currentToken = function () {
  return this.config.apiKey;
};

Auth.prototype.getToken = function () {
  d("Loading token")
  return this.getUser().then(function (user) {
    return user.getToken()
  })
};

Auth.prototype.getUser = function (cfg) {
  if(this.currentUser()) {
    return Promise.resolve(this.currentUser())
  }
  if(this.config.apiKey) {
    this.currentUser(this.currentUser() || new User({}, this.container))
    return Promise.resolve(this.currentUser())
  }
  d("Loading user")
  return this.login(cfg)
};

Auth.prototype.currentUser = function (u) {
  if(u !== undefined)
    this.__currentUser = u
  return this.__currentUser
};

Auth.prototype.login = function (info) {
  var me = this
  info = info || this.config
  return this.client.post(this.container.authBasePath('/login'), info)
    .then(function (res) {
      me.currentUser(new User(res.user, me.container))
      me.container.config.apiKey = res.token
      return Promise.resolve(me.currentUser())
    });
};

Auth.prototype.logout = function () {
  var me = this
  return this.client.delete(this.container.authBasePath('/login')).then(function () {
    me.currentUser(null)
    me.container.config.apiKey = null
    return Promise.resolve()
  });
};

Auth.prototype.refreshToken = function () {
  var me = this
  return this.client.get(this.container.authBasePath('/refresh')).then(function (res) {
    me.container.config.apiKey = res.token
    return Promise.resolve()
  });
};

module.exports = function (c) {
  return new Auth(c)
};

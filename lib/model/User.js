
var util = require('../util');
var Promise = require('bluebird');


/**
 * Rapresent an user
 *
 * @constructor
 * @param {Object} res user details
 * @param {Container} container the main container
 */
var User = function(res, container) {

  this.data = {
    uuid: null,
    username: null,
    password: null,
    email: null,
    enabled: true,
    roles: []
  }

  if(container === undefined)
    throw new Error("Missing container reference");

  this.setContainer(container)
  this.exportProperties();
  if(res) this.parseJSON(res);
};
util.extends(User, 'Container');

/**
 * Save the local modification to the user object
 */
User.prototype.update = function () {
  this.getContainer().auth.users.update(this.toJSON());
};

/**
 * Fetch the user object
 */
User.prototype.read = function () {
  var me = this
  this.getContainer().auth.users.read(this.toJSON().uuid).then(function(res) {
    me.parseJSON(res)
  });
};

/**
 * Login the current user and retrieve a session apiKey
 *
 * @return {Promise} token A Promise containing the session apiKey
 */
User.prototype.login = function () {
  var me = this
  return this.getContainer().auth.login(this.toJSON()).then(function(res) {
    me.parseJSON(res.user)
    return Promise.resolve(res.token)
  });
};

/**
 * Logout the current user
 *
 * @return {Promise} response
 */
User.prototype.logout = function () {
  return this.getContainer().auth.logout(this.toJSON());
};

/**
 * get the session token
 *
 * @return {Promise} token
 */
User.prototype.getToken = function () {
  return Promise.resolve(this.data.token);
};

module.exports = User;

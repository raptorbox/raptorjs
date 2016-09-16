
var util = require('../util');

var User = function(res, container) {

  this.data = {
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

User.prototype.update = function () {
  this.getContainer().auth.users.update(this.toJSON());
};

User.prototype.read = function () {
  this.getContainer().auth.users.read(this.toJSON().uuid);
};

User.prototype.login = function () {
  this.getContainer().auth.login(this.toJSON());
};

User.prototype.logout = function () {
  this.getContainer().auth.logout(this.toJSON());
};

module.exports = User;

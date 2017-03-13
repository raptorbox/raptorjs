module.exports = function (container) {

  var client = container.client;

  var getIdentityUuid = function (identity) {
    var identityUuid = identity ? identity.uuid :
      container.currentUser() ? container.currentUser().uuid : null
    if(!identityUuid)
      throw new Error("permissions.getIdentityUuid(): Missing identity id");
    return identityUuid;
  };

  var path = function (type, subject) {
    var id = subject ? subject.uuid || subject.id : null;
    if(!id) throw new Error("permissions.path(): subject.{id,uuid} not available");
    return container.authBasePath("permission/" + type + "/" + id);
  };

  return {
    get: function (type, subject, identity) {

      if(!type)
        throw new Error("permissions.get(): Missing permission type");

      var uri = path(type, subject);
      uri += identity === undefined ? "" : "/" + getIdentityUuid(identity);

      return client.get(uri);
    },
    set: function (type, subject, permissions, identity) {

      if(!type)
        throw new Error("permissions.set(): Missing permission type");

      if(typeof permissions === 'string')
        permissions = [permissions];

      if(!identity || !identity.uuid)
        throw new Error("permissions.set(): Missing uuid field for user");

      if(!(permissions instanceof Array))
        throw new Error("permissions.set(): Permissions must be an array");

      return client.put(path(type, subject), {
        permissions: permissions,
        user: getIdentityUuid(identity)
      });
    }
  }
}

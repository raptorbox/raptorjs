module.exports = function (container) {

  var client = container.client;

  var getIdentityUuid = function (identity) {
    var identityUuid = identity ? identity.uuid :
      container.currentUser() ? container.currentUser().uuid : null
    if(!identityUuid)
      throw new Error("permissions.getIdentityUuid(): Missing identity id");
    return identityUuid;
  };

  var path = function (subject) {
    var id = null;
    if(subject) id = subject.uuid || subject.id;
    if(!id) throw new Error("permissions.path(): subject.{id,uuid} not available");
    return container.authBasePath("/" + id + "/permission");
  };

  return {
    get: function (subject, identity) {
      var uri = path(subject);
      uri += identity === undefined ? "" : "/" + getIdentityUuid(identity);
      return client.get(uri);
    },
    set: function (subject, permissions, identity) {

      if(typeof permissions === 'string')
        permissions = [permissions];

      if(!identity || !identity.uuid)
        throw new Error("permissions.set(): Missing uuid field for user");

      if(!(permissions instanceof Array))
        throw new Error("permissions.set(): Permissions must be an array");

      return client.put(path(subject), {
        permissions: permissions,
        user: getIdentityUuid(identity)
      });
    }
  }
}

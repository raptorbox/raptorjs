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
    add: function (subject, permission, identity) {
      return client.post(path(subject), {
        user: getIdentityUuid(identity),
        permission: permission
      });
    },
    remove: function (subject, permission, identity) {
      return client.delete(path(subject), {
        permission: permission,
        user: getIdentityUuid(identity)
      });
    },
    list: function (subject, identity) {
      var uri = path(subject);
      uri += identity === undefined ? "" : "/" + getIdentityUuid(identity);
      return client.get(uri);
    },
    set: function (subject, permissions, identity) {
      if(!(permissions instanceof Array))
        throw new Error("permissions.set(): Permissions must be an array");
      return client.put(path(subject), {
        permissions: permissions,
        user: getIdentityUuid(identity)
      });
    }
  }
}

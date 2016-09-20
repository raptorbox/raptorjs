module.exports = function(container) {

  var client = container.client;



  return {
    create: function(usr) {
      return client.post(container.authBasePath('/user'), usr);
    },
    update: function(usr) {
      if(!usr.uuid) throw new Error("User UUID missing");
      return client.put(container.authBasePath('user/' + usr.uuid), usr);
    },
    delete: function(usr) {
      if(!usr.uuid) throw new Error("User UUID missing");
      return client.delete(container.authBasePath('/user/' + usr.uuid));
    },
    read: function(uuid) {
      if(!uuid) throw new Error("User UUID missing");
      return client.get(container.authBasePath('/user/' + uuid));
    },
    list: function() {
      return client.get(container.authBasePath('/users'));
    }
  }
}

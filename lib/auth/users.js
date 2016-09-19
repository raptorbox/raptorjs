module.exports = function(container) {

  var client = container.client;

  return {
    create: function(usr) {
      return client.post('/user', usr);
    },
    update: function(usr) {
      if(!usr.uuid) throw new Error("User UUID missing");
      return client.put('/user/' + usr.uuid, usr);
    },
    delete: function(usr) {
      if(!usr.uuid) throw new Error("User UUID missing");
      return client.delete('/user/' + usr.uuid);
    },
    read: function(uuid) {
      if(!uuid) throw new Error("User UUID missing");
      return client.get('/user/' + uuid);
    },
    list: function() {
      return client.get('/users');
    }
  }
}

module.exports = function(container) {

  var client = container.client;

  return {
    create: function(usr) {
      return client.post('/user', usr);
    },
    update: function(usr) {
      return client.put('/user/' + usr.uuid, usr);
    },
    delete: function(usr) {
      return client.delete('/user/' + usr.uuid);
    },
    read: function(uuid) {
      return client.get('/user/' + uuid);
    },
    list: function(name) {
      return client.get('/users');
    }
  }
}

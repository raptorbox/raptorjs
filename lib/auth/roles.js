module.exports = function(container) {

  var client = container.client;

  return {
    create: function(name) {
      return client.post('/roles', { name: name });
    },
    update: function(role, name) {
      return client.put('/roles/' + role.id, role);
    },
    delete: function(role) {
      return client.delete('/roles/' + role.id);
    },
    list: function(name) {
      return client.get('/roles');
    }
  }
}

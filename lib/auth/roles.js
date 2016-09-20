module.exports = function(container) {

  var client = container.client;

  return {
    create: function(name) {
      return client.post(
        container.authBasePath('/roles'),
        { name: name }
      );
    },
    update: function(role) {
      return client.put(
        container.authBasePath('/roles/' + role.id),
        role
      );
    },
    delete: function(role) {
      return client.delete(
        container.authBasePath('/roles/' + role.id)
      );
    },
    list: function(name) {
      return client.get(
        container.authBasePath('/roles')
      );
    }
  }
}

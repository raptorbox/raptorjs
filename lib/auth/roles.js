module.exports = function(container) {

  var client = container.client;

  return {
    create: function(name) {
      return client.post(
        container.authBasePath('/role'),
        { name: name }
      );
    },
    update: function(role) {
      return client.put(
        container.authBasePath('/role/' + role.id),
        role
      );
    },
    delete: function(role) {
      return client.delete(
        container.authBasePath('/role/' + role.id)
      );
    },
    list: function() {
      return client.get(
        container.authBasePath('/role')
      );
    }
  }
}

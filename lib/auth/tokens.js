module.exports = function(container) {

  var client = container.client;

  return {
    create: function(token) {
      return client.post(
        container.authBasePath('/user/'+ token.userId +'/token'),
        token
      );
    },
    update: function(token) {
      return client.put(
        container.authBasePath('/user/'+ token.userId +'/token/' + token.id),
        token
      );
    },
    delete: function(token) {
      return client.delete(
        container.authBasePath('/user/'+ token.userId +'/token/' + token.id)
      );
    },
    list: function(name) {
      return client.get(container.authBasePath('/user/'+ token.userId +'/tokens'));
    }
  }
}

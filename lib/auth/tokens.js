module.exports = function(container) {

  var client = container.client;

  return {
    load: function(tokenId) {
      var userId = container.auth.currentUser().uuid;
      return client.get(container.authBasePath('/user/'+ userId +'/token/' + tokenId));
    },
    save: function(token) {
      return token.id ? this.update(token) : this.create(token);
    },
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
    list: function(userId) {
      userId = userId || container.auth.currentUser().uuid;
      return client.get(container.authBasePath('/user/'+ userId +'/tokens'));
    }
  }
}

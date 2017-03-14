module.exports = function(container) {

  var client = container.client;

  // var getUserId = function (token) {
  //   if(token && token.userId) {
  //     return token.userId;
  //   }
  //   return container.auth().currentUser().uuid;
  // }

  return {
    load: function(tokenId) {
      return client.get(container.authBasePath('/token/' + tokenId));
    },
    save: function(token) {
      return token.id ? this.update(token) : this.create(token);
    },
    create: function(token) {
      return client.post(
        container.authBasePath('/token'),
        token
      );
    },
    update: function(token) {
      return client.put(
        container.authBasePath('/token/' + token.id),
        token
      );
    },
    delete: function(token) {
      return client.delete(
        container.authBasePath('/token/' + token.id)
      );
    },
    list: function(userId) {
      return client.get(
        container.authBasePath('/token') + (userId ? '?uuid=' + userId : '')
      );
    }
  }
}

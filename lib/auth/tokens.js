module.exports = function(container) {

  var client = container.client;

  return {
    create: function(token) {
      return client.post('/user/'+ token.userId +'/token', token);
    },
    update: function(token) {
      return client.put('/user/'+ token.userId +'/token/' + token.id, token);
    },
    delete: function(token) {
      return client.delete('/user/'+ token.userId +'/token/' + token.id);
    },
    list: function(name) {
      return client.get('/user/'+ token.userId +'/tokens');
    }
  }
}

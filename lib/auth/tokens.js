module.exports = function(container) {

  var client = container.client;

  return {
    create: function(token) {
      return client.post('/token', token);
    },
    update: function(token) {
      return client.put('/token/' + token.id, token);
    },
    delete: function(token) {
      return client.delete('/token/' + token.id);
    },
    list: function(name) {
      return client.get('/tokens');
    }
  }
}

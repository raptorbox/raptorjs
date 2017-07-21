
module.exports = function (container) {

  var client = container.client

  return function(uuid, name, val) {

    if(arguments.length === 2) {
      val = name
      name = uuid
      uuid = container.currentUser().uuid
    }

    var path = "/profile/" + uuid + "/" + name

    if (val === undefined) {
      return client.get(path)
    }

    return client.put(path, val)
  }

}

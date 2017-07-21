var d = require("debug")("raptorjs:api:inventory")

var Inventory = function (container) {
    this.path = require("./routes").inventory
    this.container = container
    this.client = container.client
    this.config = container.config
}

Inventory.prototype.list = function () {
    d("List devices")
    return this.client.get(this.path)
}

Inventory.prototype.search = function (q) {
    d("Search for devices")
    return this.client.post(this.path + "/search", q)
}

Inventory.prototype.read = function (id) {
    d("Load device %s", id)
    return this.client.get(this.path + "/" + (id.id || id))
}

Inventory.prototype.delete = function (id) {
    d("Delete device %s", id)
    return this.client.delete(this.path + "/" + (id.id || id))
}

Inventory.prototype.update = function (dev) {
    d("Update device %s", dev.id)
    return this.client.put(this.path + "/" + dev.id, dev)
}

Inventory.prototype.create = function (dev) {
    d("Create device")
    return this.client.post(this.path, dev)
}

module.exports = function (c) {
    return new Inventory(c)
}


var d = require("debug")("raptorjs:inventory")
var Base = require("./Base")
var Device = require("./model/Device")

class Inventory extends Base {

    constructor(container) {
        super(container)
    }

    list() {
        d("List devices")
        return this.getClient().get(this.route("INVENTORY_LIST"))
            .then((list) => list.map((d) => new Device(d)))
    }

    search(q) {
        d("Search for devices")
        return this.getClient().post(this.route("INVENTORY_SEARCH"), q)
            .then((list) => list.map((d) => new Device(d)))
    }

    read(id) {
        d("Load device %s", id)
        return this.getClient().post(this.route("INVENTORY_LOAD", id.id || id))
            .then((d) => new Device(d))
    }

    delete(id) {
        d("Delete device %s", id.id || id)
        return this.getClient().delete(this.route("INVENTORY_DELETE", (id.id || id)))
    }

    update(dev) {
        dev = dev.toJSON ? dev.toJSON() : dev
        d("Update device %s", dev.id)
        return this.getClient().put(this.route("INVENTORY_UPDATE", dev.id), dev)
            .then((d) => new Device(d))
    }

    create(dev) {
        d("Create device")
        dev = dev.toJSON ? dev.toJSON() : dev
        return this.getClient().post(this.route("INVENTORY_CREATE"), dev)
            .then((d) => new Device(d))
    }
}

module.exports = Inventory


var d = require("debug")("raptorjs:inventory")
var Base = require("./Base")

class Inventory extends Base {

    constructor(container) {
        super(container)
    }

    list() {
        d("List devices")
        return this.getClient().get(this.route("LIST"))
    }

    search(q) {
        d("Search for devices")
        return this.getClient().post(this.route("SEARCH"), q)
    }

    read(id) {
        d("Load device %s", id)
        return this.getClient().post(this.route("READ", id.id || id))
    }

    delete(id) {
        d("Delete device %s", id)
        return this.getClient().delete(this.route("DELETE", (id.id || id)))
    }

    update(dev) {
        d("Update device %s", dev.id)
        return this.getClient().put(this.route("UPDATE", dev.id), dev)
    }

    create(dev) {
        d("Create device")
        return this.getClient().post(this.route("CREATE"), dev)
    }
}

module.exports = Inventory

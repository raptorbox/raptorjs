
const d = require("debug")("raptorjs:inventory")
const Base = require("./Base")
const Device = require("./model/Device")
const Pager = require("./pager")

class Inventory extends Base {

    constructor(container) {
        super(container)
    }

    Permission() {
        return this.getContainer().Admin().getPermission("device")
    }

    list(paging) {
        d("List devices")
        const url = this.route("INVENTORY_LIST") + Pager.buildQuery(paging)
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list, (raw) => new Device(raw))))
    }

    search(q) {
        d("Search for devices")
        return this.getClient().post(this.route("INVENTORY_SEARCH"), q)
            .then((list) => Promise.resolve(Pager.create(list, (raw) => new Device(raw))))
    }

    read(dev) {
        const id = (typeof dev === "string") ? dev : dev.id
        d("Load device %s", id)
        return this.getClient().get(this.route("INVENTORY_LOAD", id)).then((d) => new Device(d))
    }

    delete(dev) {
        const id = (typeof dev === "string") ? dev : dev.id
        d("Delete device %s", id)
        return this.getClient().delete(this.route("INVENTORY_DELETE", id))
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
            .then((json) => new Device(json))
    }

    subscribe(device, fn) {
        return this.getClient().subscribe("inventory/" + device.id, fn)
            .then(() => Promise.resolve(device))
    }

    unsubscribe(device, fn) {
        return this.getClient().unsubscribe("inventory/" + device.id, fn)
            .then(() => Promise.resolve(device))
    }

}

module.exports = Inventory

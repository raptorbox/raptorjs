
var d = require("debug")("raptorjs:inventory")
var Base = require("./Base")
var Device = require("./model/Device")

class Inventory extends Base {

    constructor(container) {
        super(container)
    }

    Permission() {
        return this.getContainer().Admin().getPermission("device")
    }

    list(page, size, sort, sortDir) {

        d("List devices")

        const query = []
        if (page) {
            query.push(`page=${page}`)
        }
        if (size) {
            query.push(`limit=${size}`)
        }
        if (sort) {
            sortDir = sortDir === "desc" ? sortDir : "asc"
            query.push(`sort=${sort},${sortDir}`)
        }
        let url = this.route("INVENTORY_LIST")
        if (query.length) {
            url += "?" + query.join("&")
        }

        return this.getClient().get(url)
            .then((list) => Promise.resolve(require("./pager").create(list, (raw) => new Device(raw))))
    }

    search(q) {
        d("Search for devices")
        return this.getClient().post(this.route("INVENTORY_SEARCH"), q)
            .then((list) => Promise.resolve(require("./pager").create(list, (raw) => new Device(raw))))
    }

    read(dev) {
        const id = (typeof dev === "string") ? dev : dev.id
        d("Load device %s", id)
        return this.getClient().get(this.route("INVENTORY_LOAD", id))
            .then((d) => new Device(d))
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

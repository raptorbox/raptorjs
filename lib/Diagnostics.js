
const d = require("debug")("raptorjs:diagnostics")
const Base = require("./Base")
const DeviceDiagnostic = require("./model/diagnostics/Device.js")
const Pager = require("./pager")

class Diagnostics extends Base {

    constructor(container) {
        super(container)
    }

    Permission() {
        return this.getContainer().Admin().getPermission("device")
    }

    devices(query={}, paging={}) {
        d("List devices")
        const url = this.route("DIAGNOSTICS_DEVICE") + Pager.buildQuery(paging, query)
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list, (raw) => new DeviceDiagnostic(raw))))
    }
}

module.exports = Diagnostics

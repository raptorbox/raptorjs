
var d = require("debug")("raptorjs:action")
var Base = require("./Base")

class Action extends Base {

    constructor(container) {
        super(container)
    }

    set(action, data) {
        d("Set action %s state", action.name)
        return this.getClient().request({
            method: "PUT",
            url: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            },
            body: data.toString(),
        })
    }

    get(action) {
        d("Get action %s state", action.name)
        return this.getClient().request({
            method: "GET",
            url: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            }
        })
    }

    invoke(action, data) {
        d("Invoking %s on %s", action.name, action.deviceId)
        return this.getClient().request({
            method: "PUT",
            url: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            },
            body: data.toString(),
        })
    }

}

module.exports = Action

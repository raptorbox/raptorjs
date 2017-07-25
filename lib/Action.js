
var d = require("debug")("raptorjs:stream")
var Base = require("./Base")

class Action extends Base {

    constructor(container) {
        super(container)
    }

    setState(action, data) {
        d("Set action %s state", action.name)
        this.getClient().request({
            method: "PUT",
            path: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            },
            body: data.toString(),
        })
    }

    getState(action) {
        d("Get action %s state", action.name)
        this.getClient().request({
            method: "GET",
            path: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            }
        })
    }

    invoke(action, data) {
        d("Invoking %s on %s", action.name, action.deviceId)
        this.getClient().request({
            method: "PUT",
            path: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "text/plain"
            },
            body: data.toString(),
        })
    }

}

module.exports = Action
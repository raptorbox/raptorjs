
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
                "Content-Type": "application/json"
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
                "Content-Type": "application/json"
            }
        })
    }

    invoke(action, data) {
        d("Invoking %s on %s", action.name, action.deviceId)
        return this.getClient().request({
            method: "PUT",
            url: this.route("ACTION_STATUS", action.deviceId, action.name),
            headers: {
                "Content-Type": "application/json"
            },
            body: data,
        })
        return Promise.resolve(true)
    }

    subscribe(action, fn) {
        return this.getClient().subscribe("action/" + action.deviceId + "/" + action.name, fn).then(() => Promise.resolve(action))
    }

    unsubscribe(action, fn) {
        return this.getClient().unsubscribe("action/" + action.deviceId + "/" + action.name, fn).then(() => Promise.resolve(action))
    }

}

module.exports = Action

const EventEmitter = require("events").EventEmitter
const sprintf = require("sprintf-js").sprintf

class Base {

    constructor(container) {
        EventEmitter.call(this)
        this.container = container
        this.routes = require("./routes")
    }

    getRoutes() {
        return this.routes
    }

    /**
     * Usage: this.route("PROFILE_GET", "a", "b")
     */
    route(key) {
        var args = Array.prototype.slice.call(arguments)
        args[0] = this.getRoutes()[ key ] || key
        return sprintf(...args)
    }

    getClient() {
        return this.getContainer().getClient()
    }

    getConfig() {
        return this.getContainer().getConfig()
    }

    getContainer() {
        if(!this.container) {
            throw new Error("container is not available")
        }
        return this.container
    }

}

module.exports = Base

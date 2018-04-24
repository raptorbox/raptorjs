
var d = require("debug")("raptorjs:workflow")
const Base = require("./Base")

class Workflow  extends Base {

    constructor (container) {
        super(container)
        this.states = {
            died: 0,
            stopped: 10,
            started: 20
        }
    }

    start(id, args) {
        d("Start workflow instance %s", id)
        return this.getClient().post(this.route("WORKFLOW_START", id), args || {})
    }

    stop(id) {
        d("Stop workflow instance %s", id)
        return this.getClient().post(this.route("WORKFLOW_STOP", id))
    }

    create(id) {
        d("Create workflow instance %s", id)
        return this.getClient().post(this.route("WORKFLOW_CREATE", id))
    }

    delete(id) {
        d("Delete workflow instance %s", id)
        return this.getClient().delete(this.route("WORKFLOW_DELETE", id))
    }

    get(id) {
        d("Get workflow %s", id)
        return this.getClient().get(this.route("WORKFLOW_GET", id))
    }

    list() {
        d("List workflows")
        return this.getClient().get(this.route("WORKFLOW_LIST"))
    }

}

module.exports = Workflow

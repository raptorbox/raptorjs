
var d = require("debug")("raptorjs:workflow")
const Base = require("./Base")

class Workflow  extends Base {

    constructor (container) {
        super(container)
    }

    start(id) {
        d("Start workflow instance %s", id)
        return this.getClient().post(this.route("WORKFLOW_START", id))
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

    list() {
        d("List workflows")
        return this.getClient().get(this.route("WORKFLOW_LIST"))
    }

}

module.exports = Workflow

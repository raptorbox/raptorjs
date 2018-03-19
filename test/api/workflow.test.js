
const assert = require("chai").assert
// const d = require("debug")("raptorjs:test:workflow")
const util = require("../util")

const instanceName = "workflow_test" + Math.floor(Date.now() * Math.random())

describe("Workflow", function () {

    // before(util.before)
    // after(util.after)

    // spawing node-red containers can take a while
    this.timeout(15000)

    it("should list all workflows", async () => {

        const r = await util.getRaptor()
        const list = await r.Workflow().list()
        assert.isTrue(list instanceof Array)

        return Promise.resolve()
    })

    it("should create a workflow", async () => {

        const r = await util.getRaptor()
        await r.Workflow().create(instanceName)
        const list = await r.Workflow().list()

        assert.equal(1, list.filter(((n) => instanceName === n.Name)).length)

        return Promise.resolve()
    })

})

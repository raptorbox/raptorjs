
const assert = require("chai").assert
// const d = require("debug")("raptorjs:test:workflow")
const util = require("../util")

const newInstanceName = () => "workflow_test" + Math.floor(Date.now() * Math.random())


const create = async(instanceName) => {

    const r = await util.getRaptor()
    await r.Workflow().create(instanceName)
    const list = await r.Workflow().list()

    assert.equal(1, list.filter(((n) => instanceName === n.Name)).length)

    return Promise.resolve()
}

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

    it("should create a workflow", () => create(newInstanceName()))

    it("should get a workflow", async () => {

        const instanceName = newInstanceName()
        await create(instanceName)

        const r = await util.getRaptor()

        let instance = await r.Workflow().get(instanceName)
        assert.equal(instance.Name, instanceName)

        return Promise.resolve()
    })

    it("should restart a workflow", async () => {

        const r = await util.getRaptor()
        const instanceName = newInstanceName()
        await create(instanceName)

        await r.Workflow().stop(instanceName)
        let instance = await r.Workflow().get(instanceName)
        assert.equal(r.Workflow().states.stopped, instance.Status)

        await r.Workflow().start(instanceName)
        instance = await r.Workflow().get(instanceName)
        assert.equal(r.Workflow().states.started, instance.Status)

        return Promise.resolve()
    })

})


const assert = require("chai").assert
const Promise = require("bluebird")
const d = require("debug")("raptorjs:test:tree")
const util = require("../util")

const createNode = () => {
    return util.createAdminInstance()
        .then((r) => r.Inventory().create({ name: util.randomName("dev") })
            .then((dev) => r.Tree().create({ id: dev.id, type: "device" })
                .then((node) => Promise.resolve({ dev, node, r })))
    )
}

describe("Tree", function () {

    it("should create a node", function () {
        return createNode().then(({dev, node}) => {
            d("Created node %s_%s", node.type, node.id)
            assert.equal(dev.id, node.id)
            return Promise.resolve()
        })
    })

    it("should update a node", function () {
        return createNode().then(({node, r}) => r.Tree().update({ id: node.id, type: "device", name: "foobar3000" })
            .then((node2) => {
                assert.equal(node2.id, node.id)
                assert.equal(node2.name, "foobar3000")
                return Promise.resolve()
            }))
    })

    it("should delete a node", function () {
        return createNode()
            .then(({node, r}) => r.Tree().delete(node)
                .then(() => r.Tree().read(node)))
                    .catch((e) => {
                        assert.equal(404, e.code)
                        return Promise.resolve()
                    })
    })

    it("should search nodes", function () {
        return createNode().then(({node, r}) => r.Tree().update({ id: node.id, type: "device", name: "test1", properties: { test: true } })
            .then(() => r.Tree().search({ name: "test1" })))
            .then((pager) => {
                assert.isTrue(pager.getContent().filter((n) => n.name === "test1").length > 0)
                return Promise.resolve()
            })
    })

})

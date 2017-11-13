
const assert = require("chai").assert
const cloneDeep = require("lodash.clonedeep")
const Promise = require("bluebird")
const d = require("debug")("raptorjs:test:inventory")
const util = require("../util")

describe("Inventory", function () {

    this.timeout(10000)

    it("should create a new object", function () {
        return util.createDevice()
    })

    it("should update an object streams and actions", function () {
        return util.getRaptor()
            .then((raptor) => {
                return util.createDevice(raptor)
                    .then((device) => {

                        d("Created device %s", device.id)
                        d("%j", device.toJSON())

                        device.actions = []
                        device.streams["test1"] = {
                            a: "number",
                            b: "string"
                        }

                        return raptor.Inventory().update(device)
                    })
            })
    })

    it("should delete an object", function () {
        return util.getRaptor()
            .then((raptor) => {
                return util.createDevice(raptor)
                    .then((device) => {
                        return raptor.Inventory().delete(device)
                            .then(() => this.Inventory().read(device.id))
                            .catch(() => Promise.resolve())
                    })
            })
    })

    it("should find a device by name", function () {
        return util.getRaptor()
            .then((raptor) => {

                let json = require("../data/device")
                json.name = "test_find"

                return util.createDevice(raptor, json)
                    .then((device) => {
                        return raptor.Inventory().search({
                            name: device.name
                        })
                            .then((pager) => {

                                const list = pager.getContent()
                                d("Found %s records", list.length)
                                assert.isTrue(list.length > 0)

                                return Promise.all(list)
                                    .each((d) => raptor.Inventory().delete(d))
                            })
                    })
            })
    })

    it("should find a device by properties", function () {
        return Promise.all([ util.createUserInstance(), util.getRaptor() ])
            .then((apis) => {

                const usr1 = apis[0]
                const adm1 = apis[1]

                const u1id = usr1.Auth().getUser().id

                let json = require("../data/device")

                json.userId = u1id

                let json1 = cloneDeep(json)
                let json2 = cloneDeep(json)
                let json3 = cloneDeep(json)

                json1.name = "test_find_properties_1"
                json1.userId = u1id
                json1.properties = {
                    foo: "bar",
                    active: false
                }

                json2.name = "test_find_properties_2"
                json2.userId = u1id
                json2.properties = {
                    foo: "baz",
                    active: false
                }

                json3.name = "test_find_properties_3"
                json3.userId = u1id
                json3.properties = {
                    foo: "bar",
                    active: true
                }

                return Promise.all([
                    util.createDevice(adm1, json),
                    util.createDevice(adm1, json1),
                    util.createDevice(adm1, json2),
                    util.createDevice(adm1, json3)
                ]).then(() => {
                    return usr1.Inventory().search({
                        properties: {
                            active: false
                        }
                    }).then((pager) => {

                        const list = pager.getContent()

                        d("Found %s records", list.length)
                        list.forEach((dev) => d("- %s [userId=%s]", dev.name, dev.userId))

                        assert.isTrue(list.length > 0)
                        assert.equal(2, list.length)

                        return Promise.resolve()
                    })
                })
            })
    })

})

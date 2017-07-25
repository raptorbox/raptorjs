
const assert = require("chai").assert
const cloneDeep = require("lodash.clonedeep")
const Promise = require("bluebird")
const d = require("debug")("raptorjs:test:inventory")
const util = require("./util")

describe("Inventory", function () {

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
        this.timeout(2500)
        return util.getRaptor()
            .then((raptor) => {

                let json = require("./data/device")
                json.name = "test_find"

                return util.createDevice(raptor, json)
                    .then((device) => {
                        return raptor.Inventory().search({
                            name: device.name
                        })
                        .then((list) => {

                            d("Found %s records", list.length)
                            assert.equal(1, list.length)

                            return Promise.all(list)
                                .each((d) => raptor.Inventory().delete(d))
                        })
                    })
            })
    })

    it("should find a device by properties", function () {
        this.timeout(10000)
        return util.getRaptor()
            .then((raptor) => {

                let json = require("./data/device")
                
                let json1 = cloneDeep(json)
                let json2 = cloneDeep(json)
                let json3 = cloneDeep(json)

                json1.name = "test_find_properties_1"
                json1.properties = {
                    foo: "bar",
                    active: false
                }
                json2.name = "test_find_properties_2"
                json2.properties = {
                    foo: "baz",
                    active: false
                }
                json3.name = "test_find_properties_3"
                json3.properties = {
                    foo: "bar",
                    active: true
                }

                return Promise.all([
                    util.createDevice(raptor, json),
                    util.createDevice(raptor, json1),
                    util.createDevice(raptor, json2),
                    util.createDevice(raptor, json3)
                ]
                )
                    .then(() => {
                        return raptor.Inventory().search({
                            properties: {
                                active: false
                            }
                        })
                        .then((list) => {
                            return Promise.all(list)
                                .each((d) => raptor.Inventory().delete(d))
                                .then(() => {
                                    return Promise.resolve(list)
                                })
                        })
                        .then((list) => {

                            d("Found %s records", list.length)
                            list.forEach((dev) => {
                                d("- device %s (uid:%s)", dev.name, dev.userId)
                            })

                            assert.equal(2, list.length)
                            return Promise.resolve()
                        })
                    })
            })
    })

})

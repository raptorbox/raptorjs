
var Promise = require("bluebird")

// var assert = require("chai").assert
var d = require("debug")("raptorjs:test:inventory")
var util = require("./util")

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

})

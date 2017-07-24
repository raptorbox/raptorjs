
var Promise = require("bluebird")

// var assert = require("chai").assert
var d = require("debug")("raptorjs:test:inventory")
var util = require("./util")

describe("Inventory", function () {

    it("should create a new object", function () {
        return util.createDevice()
    })

    it("should update an object streams and actions", function () {
        return util.createInstance()
        .then(function (device) {

            const raptor = this

            d("Created device %s", device.id)

            device.actions = []
            device.streams["test1"] = {
                test: "number",
                test1: "string"
            }

            return raptor.Inventory().update(device)
        })
    })

    it("should delete an object", function () {
        return util.createInstance()
        .then(function (device) {
            const raptor = this
            return raptor.Inventory().delete(device)
                .then(() => raptor.Inventory().read(device.id))
                .catch(() => Promise.resolve())
        })
    })

})

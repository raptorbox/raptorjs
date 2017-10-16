
// var d = require("debug")("raptorjs:test:models")

const models = require("../index").models
var assert = require("chai").assert

describe("Models", function () {

    it("should deserialize / serialize a device", function () {

        const json = require("./data/device")
        const dev = new models.Device(json)

        assert.equal(dev.name, json.name)

        assert.equal(
            dev.getStream("temperature").getChannel("color").type,
            json.streams["temperature"].channels["color"]
        )
        assert.equal(
            dev.getAction("makePhoto").status,
            json.actions[1].status
        )

        const json2 = dev.toJSON()

        assert.equal(
            json2.streams.temperature.channels.degree.type,
            json.streams.temperature.channels.degree.type
        )
        assert.equal(
            json2.streams.test.channels.text.type,
            json.streams.test.text
        )
        assert.equal(
            json2.streams.description,
            json.streams.description
        )

        assert.equal(
            json2.actions.makePhoto.status,
            json.actions[1].status
        )

    })

})

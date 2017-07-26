
// const assert = require("chai").assert
// const Promise = require("bluebird")
const d = require("debug")("raptorjs:test:stream")
const util = require("../util")

describe("Stream", function () {

    this.timeout(10000)

    it("should push data", function () {
        return util.getRaptor()
            .then((raptor) => {
                return util.createDevice(raptor)
                    .then((device) => {
                        d("Created device %s (%s)", device.name, device.id)
                        const record = device.getStream("temperature").createRecord({
                            degree: Math.floor(Math.random()*10)
                        })
                        return raptor.Stream().push(record)
                    })
            })
    })

})

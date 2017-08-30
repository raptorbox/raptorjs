
const Model = require("./Model")
const Channel = require("./Channel")
const Record = require("./Record")

class Stream extends Model {

    constructor(json, device) {
        super(json)
        this.setDevice(device)
    }

    defaultFields() {
        return {
            userId: {
                type: String,
                required: true
            },
            deviceId: {
                type: String,
                required: true
            },
            name: String,
            channels: {
                listOf: Channel,
                transform: (channel, name) => {

                    if(typeof channel === "string") {
                        channel = {
                            type: channel
                        }
                    }

                    if(name) {
                        channel.name = name
                    }
                                   
                    return channel
                }
            }
        }
    }

    getChannel(name) {
        return this.json.channels[name] || null
    }

    setDevice(device) {

        this.device = device

        if(device) {
            this.userId = device.userId
            this.deviceId = device.id
        }
        else {
            this.userId = null
            this.deviceId = null
        }

        Object.keys(this.channels).forEach((name) => {
            this.channels[name].setStream(this.stream)
        })

    }

    getDevice() {
        return this.device || null
    }

    createRecord(data) {
        return new Record(data, this)
    }
}

module.exports = Stream

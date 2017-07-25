
const Model = require("./Model")
const Channel = require("./Channel")

class Stream extends Model {

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

                    channel.name = name

                    return channel
                }
            }
        }
    }

    getChannel(name) {
        return this.json.channels[name] || null
    }

}

module.exports = Stream

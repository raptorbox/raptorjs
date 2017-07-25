
const Model = require("./Model")

class Channel extends Model {

    constructor(json, stream) {
        super(json)
        this.setStream(stream)
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
            streamId: {
                type: String,
                required: true
            },
            name: String,
            type: String
        }
    }

    setStream(stream) {

        this.stream = stream

        if(stream) {
            this.streamId = stream.name
            this.userId = stream.getDevice().userId
            this.deviceId = stream.getDevice().id
        }
        else {
            this.streamId = null
            this.userId = null
            this.deviceId = null
        }

    }

    getStream() {
        return this.stream || null
    }

}

module.exports = Channel

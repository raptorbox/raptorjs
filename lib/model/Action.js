
const Model = require("./Model")

class Action extends Model {

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
            name: { type: String, required: true },
            status: String
        }
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

    }

    getDevice() {
        return this.device || null
    }

}

module.exports = Action


const Model = require("../Model")

class Device extends Model {

    defaultFields() {
        return {
            deviceName: {
                type: String,
                required: true
            },
            deviceId: {
                type: String,
                required: true
            },
            fields: []
        }
    }
}

module.exports = Device

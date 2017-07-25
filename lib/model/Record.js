
const Model = require("./Model")
const GeoPoint = require("./data/GeoPoint")
const util = require("../util")

class Result extends Model {
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
            location: {
                type: GeoPoint,
                required: true
            },
            timestamp: {
                type: Number,
                required: true,
                default: () => util.toUNIX()
            },
            channels: { type: Object, required: true }
        }
    }
}

module.exports = Result

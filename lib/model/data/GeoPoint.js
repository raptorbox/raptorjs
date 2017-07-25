
const Model = require("../Model")

class GeoPoint extends Model {
    defaultFields() {
        return {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
        }
    }
}

module.exports = GeoPoint

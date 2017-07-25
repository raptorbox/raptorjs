
const Model = require("./Model")

class Action extends Model {
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
}

module.exports = Action

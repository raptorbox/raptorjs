
const Model = require("./Model")

class Channel extends Model {

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

}

module.exports = Channel

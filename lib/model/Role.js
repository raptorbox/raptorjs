
const Model = require("./Model")

class Role extends Model {

    defaultFields() {
        return {
            id: {
                type: String,
                required: true
            },
            permissions: { type: Array, listOf: String },
            appId: String
        }
    }
}

module.exports = Role

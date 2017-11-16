
const Model = require("./Model")

class Role extends Model {

    defaultFields() {
        return {
            id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            permissions: { type: Array, listOf: String },
        }
    }
}

module.exports = Role

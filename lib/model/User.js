
const Model = require("./Model")

class User extends Model {

    defaultFields() {
        return {
            uuid: String,
            id: {
                type: String,
                required: true
            },
            username: { type: String, required: true },
            password: { type: String },
            email: { type: String },
            roles: { type: Array, listOf: String },
            enabled: { type: Boolean },
        }
    }
}

module.exports = User

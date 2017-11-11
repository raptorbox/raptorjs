
const Model = require("./Model")
const Role = require("./Role")

class User extends Model {

    defaultFields() {
        return {
            id: {
                type: String,
                required: true
            },
            username: { type: String, required: true },
            password: { type: String },
            email: { type: String },
            roles: {
                type: Array,
                listOf: Role,
                transform: (role) => {

                    if(typeof role === "string") {
                        role = {
                            name: role,
                            permissions: []
                        }
                    }

                    return new Role(role)
                }
            },
            enabled: { type: Boolean },
        }
    }
}

module.exports = User

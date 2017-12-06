
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
            domain: String,
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
                    return role
                }
            },
            enabled: { type: Boolean },
            created: {
                type: Date,
                transform: (raw) => new Date(raw)
            },
        }
    }

    hasRole(role) {
        return this.roles.filter((r) => r === role || r.name === role).length === 1
    }

    isAdmin() {
        return this.hasRole("admin")
    }

    isService() {
        return this.hasRole("service")
    }

}

module.exports = User

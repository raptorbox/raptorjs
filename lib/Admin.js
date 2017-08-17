
var Base = require("./Base")
// var d = require("debug")("raptorjs:admin")

class Admin extends Base {

    constructor(container) {
        super(container)
    }

    User() {
        if(!this.user) {
            const UserModule = require("./admin/User")
            this.user = new UserModule(this.getContainer())
        }
        return this.user
    }

    Role() {
        if(!this.role) {
            const Role = require("./admin/Role")
            this.role = new Role(this.getContainer())
        }
        return this.role
    }

    getPermission(type) {
        this.permissions = this.permissions || {}
        if(!this.permissions[type]) {
            const Permission = require("./admin/Permission")
            this.permissions[type] = new Permission(this.getContainer(), type)
        }
        return this.permissions[type]
    }

    Token() {
        if(!this.token) {
            const Token = require("./admin/Token")
            this.token = new Token(this.getContainer())
        }
        return this.token
    }
}

module.exports = Admin

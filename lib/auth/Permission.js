
const Base = require("../Base")

const d = require("debug")("raptorjs:permission")

class Permission extends Base {

    path(type, subject) {
        var id = subject ? subject.uuid || subject.id : null
        if(!id) {
            throw new Error("permissions.path(): subject.{id,uuid} not available")
        }
        return this.route("PERMISSION_GET", type, id)
    }

    getIdentityUuid(identity) {
        var identityUuid = identity ? identity.uuid :
        this.getContainer().getUser() ? this.getContainer().getUser().uuid : null
        if(!identityUuid)
            throw new Error("permissions.getIdentityUuid(): Missing identity id")
        return identityUuid
    }

    get(type, subject, identity) {
        d("Get permission of %s for %s by %s", type, subject)
        if(!type)
            throw new Error("permissions.get(): Missing permission type")

        var uri = this.path(type, subject)
        uri += identity === undefined ? "" : "/" + this.getIdentityUuid(identity)

        return this.getClient().get(uri)
    }

    set(type, subject, permissions, identity) {

        if(!type)
            throw new Error("permissions.set(): Missing permission type")

        if(typeof permissions === "string")
            permissions = [permissions]

        if(!identity || !identity.uuid)
            throw new Error("permissions.set(): Missing uuid field for user")

        if(!(permissions instanceof Array))
            throw new Error("permissions.set(): Permissions must be an array")

        return this.getClient().put(this.path(type, subject), {
            permissions: permissions,
            user: this.getIdentityUuid(identity)
        })
    }
}


module.exports = Permission

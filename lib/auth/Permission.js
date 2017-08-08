
const Base = require("../Base")

const d = require("debug")("raptorjs:permission")


class Permission extends Base {

    getId(s) {
        if(s instanceof String || s instanceof Number) {
            return s
        }
        return s ? s.id || s.uuid  : null
    }

    getUserId(s) {
        return this.getId(s) || this.getContainer().Auth().getUser().uuid
    }

    get(type, subject, identity) {

        const sid = this.getUserId(subject)
        const iid = this.getId(identity)

        d("Get permission of %s for %s by %s", type, sid, iid)

        if(!type)
            throw new Error("permissions.get(): Missing permission type")

        const url = identity ?
            this.route("PERMISSION_BY_USER", type, sid, iid) : this.route("PERMISSION_GET", type, sid)

        return this.getClient().get(url)
    }

    set(type, subject, permissions, identity) {

        const sid = this.getId(subject)
        const iid = this.getUserId(identity)

        d("Set permissions %j of %s for %s by %s", permissions, type, sid, iid)

        if(!type)
            throw new Error("permissions.set(): Missing permission type")

        if(typeof permissions === "string")
            permissions = [permissions]

        if(!iid)
            throw new Error("permissions.set(): Missing uuid field for user")

        if(!(permissions instanceof Array))
            throw new Error("permissions.set(): Permissions must be an array")

        return this.getClient().put(this.route("PERMISSION_SET", type, sid), {
            permissions: permissions,
            user: iid
        })
    }
}


module.exports = Permission

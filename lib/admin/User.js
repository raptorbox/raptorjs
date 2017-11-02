
const Base = require("../Base")

class User extends Base {

    create(usr) {
        return this.getClient().post(this.route("USER_CREATE"), usr)
    }
    update(user) {
        if(!user.uuid) throw new Error("User id is missing")
        return this.getClient().put(this.route("USER_UPDATE", user.uuid), user)
    }
    save(user) {
        if(user.uuid) {
            return this.update(user)
        }
        return this.create(user)
    }
    delete(user) {
        if (typeof user === "string") {
            user = { uuid: user }
        }
        if(!user.uuid) throw new Error("User id is missing")
        return this.getClient().delete(this.route("USER_DELETE", user.uuid))
    }
    read(uuid) {
        uuid = uuid ? uuid.uuid || uuid : null
        const path = uuid ? this.route("USER_GET", uuid) : this.route("USER_GET_ME")
        return this.getClient().get(path)
    }
    me() {
        return this.read()
    }
    list() {
        return this.getClient().get(this.route("USER_LIST"))
    }
    /**
     * @deprecated
     */
    isAuthorized(objectId, userId, permission) {
        return this.can(userId, "device", permission, objectId)
    }
    can(userId, type, permission, objectId) {
        if(arguments.length === 3) {
            objectId = permission
            permission = type
            type = userId
            userId = this.getContainer().Auth().getUser().uuid
        }
        return this.getClient().post(this.route("PERMISSION_CHECK"), {
            type, objectId, userId, permission
        })
    }
}


module.exports = User

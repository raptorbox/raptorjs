
const Base = require("../Base")

class User extends Base {

    create(usr) {
        return this.getClient().post(this.route("USER_CREATE"), usr)
    }
    update(user) {
        if(!user.id) throw new Error("User id is missing")
        return this.getClient().put(this.route("USER_UPDATE", user.id), user)
    }
    save(user) {
        if(user.id) {
            return this.update(user)
        }
        return this.create(user)
    }
    delete(user) {
        const id = user && user.id ? user.id : user
        if(!id) throw new Error("User id is missing")
        return this.getClient().delete(this.route("USER_DELETE", id))
    }
    read(id) {
        id = id ? id.id || id : null
        const path = id ? this.route("USER_GET", id) : this.route("USER_GET_ME")
        return this.getClient().get(path)
    }
    me() {
        return this.read()
    }
    list() {
        return this.getClient().get(this.route("USER_LIST"))
    }
    isAuthorized(objectId, userId, permission) {
        return this.getClient().post(this.route("PERMISSION_CHECK"), {
            objectId, userId, permission
        })
    }
}


module.exports = User

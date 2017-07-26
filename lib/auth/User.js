
const Base = require("../Base")

class User extends Base {

    create(usr) {
        return this.getClient().post(this.route("USER_CREATE"), usr)
    }
    update(user) {
        if(!user.uuid) throw new Error("User id is missing")
        return this.getClient().post(this.route("USER_UPDATE", user.uuid), user)
    }
    delete(user) {
        if(!user.uuid) throw new Error("User id is missing")
        return this.getClient().post(this.route("USER_DELETE", user.uuid))
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
}


module.exports = User

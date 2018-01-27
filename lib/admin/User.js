// var d = require("debug")("raptorjs:User")
const Base = require("../Base")
const Pager = require("../pager")
const UserModel = require("../model/User")

class User extends Base {

    create(usr) {
        return this.getClient().post(this.route("USER_CREATE"), usr)
            .then((u) => new UserModel(u))
    }
    update(user) {
        if(!user.id) throw new Error("User id is missing")
        return this.getClient().put(this.route("USER_UPDATE", user.id), user)
            .then((u) => new UserModel(u))
    }
    save(user) {
        if(user.id) {
            return this.update(user)
        }
        return this.create(user)
    }
    delete(user, query={}) {
        if (typeof user === "string") {
            user = { id: user }
        }
        if(!user.id) throw new Error("User id is missing")
        const url = this.route("USER_DELETE", user.id) + Pager.buildQuery(null, query)
        return this.getClient().delete(url)
    }
    read(id) {
        id = id ? id.id || id : null
        const path = id ? this.route("USER_GET", id) : this.route("USER_GET_ME")
        return this.getClient().get(path)
    }
    me() {
        return this.read()
    }
    list(query={}, pager={}) {
        const url = this.route("USER_LIST") + Pager.buildQuery(pager, query)
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list, (u) => new UserModel(u))))
    }

    can(req) {
        return this.getClient().post(this.route("PERMISSION_CHECK"), req)
    }
}


module.exports = User

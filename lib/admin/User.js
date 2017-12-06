
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
    delete(user) {
        if (typeof user === "string") {
            user = { uuid: user }
        }
        if(!user.uuid) throw new Error("User id is missing")
        return this.getClient().delete(this.route("USER_DELETE", user.uuid))
    }
    read(id) {
        id = id ? id.id || id : null
        const path = id ? this.route("USER_GET", id) : this.route("USER_GET_ME")
        return this.getClient().get(path)
    }
    me() {
        return this.read()
    }
    list(paging) {

        const pager = Pager.buildQuery(paging)
        //TODO make this more generic
        let query = ""
        if (paging.username) {
            query = pager ? "&" : "?"
            query += `username=${paging.username}`
        }

        const url = this.route("USER_LIST") + pager + query
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list, (u) => new UserModel(u))))
    }

    /**
     * @deprecated
     */
    // isAuthorized(subjectId, userId, permission) {
    //     console.warn("deprecated call to `isAuthorized()`, use `can()` instead")
    //     return this.can({type: "device", userId, permission, subjectId})
    // }

    can(req) {
        return this.getClient().post(this.route("PERMISSION_CHECK"), req)
    }
}


module.exports = User


const Base = require("../Base")

const d = require("debug")("raptorjs:role")

class Role extends Base {

    create(role) {
        d("Create role %s", role.name)
        return this.getClient().post(
            this.route("ROLE_CREATE"),
            role
        )
    }

    update(role) {
        d("Update role %s", role.name)
        return this.getClient().put(
            this.route("ROLE_UPDATE", role.name),
            role
        )
    }

    read(role) {
        role = role.name ? role.name : role
        d("Read role %s", role)
        return this.getClient().get(this.route("ROLE_READ", role))
    }


    delete(role) {
        role = role.name ? role.name : role
        d("Delete role %s", role)
        return this.getClient().delete(
            this.route("ROLE_DELETE", role)
        )
    }

    list() {
        d("List roles")
        return this.getClient().get(this.route("ROLE_LIST"))
            .then((list) => Promise.resolve(require("../pager").create(list)))
    }
}

module.exports = Role


const Base = require("../Base")

const d = require("debug")("raptorjs:role")

class Role extends Base {

    create(name) {
        d("Create role %s", name)
        return this.getClient().post(
            this.route("ROLE_CREATE"),
            { name: name }
        )
    }

    update(role) {
        d("Update role %s", role.name)
        return this.getClient().put(
            this.route("ROLE_UPDATE", role.id),
            role
        )
    }


    delete(role) {
        d("Delete role %s", role.name)
        return this.getClient().delete(
            this.route("ROLE_DELETE", role.id)
        )
    }

    list() {
        d("List roles")
        return this.getClient().get(
            this.route("ROLE_LIST")
        )
    }
}

module.exports = Role

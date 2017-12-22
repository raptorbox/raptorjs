
const Base = require("../Base")
const RoleModel = require("../model/Role")
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
        const id = role.id ? role.id : role
        d("Read role %s", role.name)
        return this.getClient().get(this.route("ROLE_READ", id))
    }

    delete(role) {
        role = role.id ? role.id : role
        d("Delete role %s", role)
        return this.getClient().delete(
            this.route("ROLE_DELETE", role)
        )
    }

    list(query={}, pager={}) {
        d("List roles")
        const Pager = require("../pager")
        const url = this.route("ROLE_LIST") + Pager.buildQuery(pager, query)
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list, (r) => new RoleModel(r))))
    }
}

module.exports = Role

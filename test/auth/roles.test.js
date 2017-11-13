
const Promise = require("bluebird")

const assert = require("chai").assert
const d = require("debug")("raptorjs:test:auth:roles")
const util = require("../util")

const createRole = (r, name, permissions) => {
    name = name || util.randomName("role")
    permissions = permissions || [ "admin_own" ]
    return r.Admin().Role().create({name, permissions})
}


describe("raptor role service", function () {

    describe("roles API", function () {
        it("should create a new role", function () {
            return util.getRaptor().then((r) => {
                const roleName = util.randomName("role")
                return createRole(r, roleName).then(function (t) {
                    d("Created role: %j", t)
                    assert.equal(t.name, roleName)
                    return Promise.resolve()
                })
            })
        })

        it("should update a role", function () {
            return util.getRaptor().then((r) => {
                return createRole(r).then((role) => {
                    role.name = util.randomName("role")
                    return r.Admin().Role().update(role).then((t) => {
                        d("Updated role: %j", t)
                        assert.equal(t.name, role.name)
                        return Promise.resolve()
                    })
                })
            })
        })

        it("should delete a role", function () {
            return util.getRaptor().then((r) => {
                return createRole(r).then((role) => {
                    return r.Admin().Role().delete(role)
                })
            })
        })

        it("should contain at least a role", function () {
            return util.getRaptor().then((r) => {
                return r.Admin().Role().list().then(function (pager) {
                    const list = pager.getContent()
                    d("User has %s roles", list.length)
                    assert.isTrue(list instanceof Array)
                    assert.isTrue(list.length > 0)
                })
            })
        })

    })

})

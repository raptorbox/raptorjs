
const assert = require("chai").assert
const util = require("../util")
const d = require("debug")("raptorjs:test:app")


const createApp = () => {
    return util.getRaptor().then((r) => {
        return util.createUserInstance().then((usr1) => {
            const usr1Id = usr1.Auth().getUser().id
            return r.App().create({
                name: util.randomName("app"),
                users: [{
                    id: usr1Id,
                    roles: ["operator"]
                }],
                roles: [{
                    name: "operator",
                    permissions: [
                        "admin_device",
                        "read_app",
                    ]
                }]
            }).then((app) => {
                const rawdev = { name: util.randomName("dev"), domain: app.id }
                return r.Inventory().create(rawdev).then((dev) => {
                    d("Created dev %s owner %s", dev.id, dev.userId)
                    return usr1.App().read(app).then((app) => {
                        d("usr1 %s can read app %s", usr1Id, app.id)
                        return usr1.Inventory().read(dev.id).then(() => {
                            d("usr1 %s can read device %s", usr1Id, dev.id)
                            return Promise.resolve({
                                usr1, r, dev, app
                            })
                        })
                    })
                })
            })
        })
    })    
}

describe("app service", function () {

    describe("App API", function () {

        it("should fail app read", function () {
            return util.createUserInstance().then((usr1) => {
                usr1.setConfig({
                    url: usr1.getConfig().url,
                    token: "42"
                })
                return usr1.App().read({ id: "foo" })
                    .catch((e) => {
                        assert.equal(401, e.code)
                        return Promise.resolve()
                    })
            })
        })

        it("should read app", function () {
            return createApp()
        })

        it("should not read tree", function () {
            return createApp().then(({ r, usr1, app }) => {
                return r.Tree().create({ name: util.randomName("tree"), domain: app.id })
                    .then((tree) => {
                        return usr1.Tree().read(tree.id).catch(() => Promise.resolve())
                    })
            })
        })

    })
})

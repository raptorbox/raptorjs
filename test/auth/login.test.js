
const Promise = require("bluebird")
const Raptor = require("../../index")
const util = require("../util")

const assert = require("chai").assert

describe("raptor auth service", function () {

    // before(function () {})

    describe("authentication API", function () {

        it("should login", function () {
            return util.createUserInstance()
        })

        it("should login admin", function () {
            return util.createAdminInstance()
        })

        it("should login admin2", function () {
            return util.getRaptor()
        })

        it("should detect expired token", function () {
            return util.getRaptor()
                .then((r) => {

                    assert.equal(false, r.Auth().loginIsExpired())
                    r.Auth().state.expires = Date.now() - 5000
                    assert.equal(true, r.Auth().loginIsExpired())

                    return r.Admin().Token().create({
                        expires: Math.floor(Date.now()/1000) + 3600,
                        name: util.randomName("token")
                    }).then((t) => {
                        r.setConfig({ url: r.getConfig().url, token: t.token })
                        return r.Admin().User().me()
                    }).then(() => {

                        assert.equal(false, r.Auth().loginIsExpired())
                        r.Auth().state.expires = Date.now() - 5000
                        assert.equal(false, r.Auth().loginIsExpired())

                        return Promise.resolve()
                    })
                })
        })

        it("should get retrieve login token", function () {
            return util.getRaptor().then((r) => r.Admin().Token().current().then((t) => {

                assert.equal(t.token, r.Auth().getToken())
                assert.equal("LOGIN", t.type)
                assert.isTrue(t.expires*1000 > Date.now())

                return Promise.resolve()
            }))
        })

        it("should login again and use a different token", function () {
            return util.createUserInstance().then((r) => {
                const oldToken = r.Auth().getToken()
                return r.Auth().logout()
                    .then(function () {

                        assert.equal(null, r.Auth().getToken())
                        assert.equal(null, r.Auth().getToken())

                        return r.Auth().login().then(function () {
                            assert.notEqual(oldToken, r.Auth().getToken())
                            return Promise.resolve()
                        })
                    })
            })
        })

        it("should logout and have the token disabled", function () {
            return util.createUserInstance().then((r) => {
                const oldToken = r.Auth().getToken()
                return r.Auth().logout()
                    .then(function () {
                        const r2 = new Raptor({ url: r.getConfig().url, token: oldToken })
                        return r2.Admin().User().me()
                    })
                    .catch((e) => {
                        assert.equal(401, e.code)
                        return Promise.resolve()
                    })
            })
        })

    })
})

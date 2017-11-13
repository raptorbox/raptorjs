/*
  global describe
  global before
  global it
  global console
*/

const Promise = require("bluebird")

const Raptor = require("../../index")
const util = require("../util")

const assert = require("chai").assert
const d = require("debug")("raptorjs:test:auth:tokens")

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

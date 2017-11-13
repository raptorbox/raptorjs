
const Raptor = require("../../index")
const Promise = require("bluebird")

const assert = require("chai").assert
const d = require("debug")("raptorjs:test:auth:tokens")
const util = require("../util")

const createToken = (r, tokenName) => {
    tokenName = tokenName || util.randomName("token")
    return r.Admin().Token().create({
        name: tokenName,
        secret: tokenName + "_foobar",
        expires: 60 * 5 // 5min
    })
}

describe("raptor auth service", function () {

    describe("tokens API", function () {
        it("should create a new token", function () {
            return util.getRaptor().then((r) => {
                const tokenName = util.randomName("token")
                return createToken(r, tokenName).then(function (t) {
                    d("Created token: %j", t)
                    assert.isTrue(t.name === tokenName)
                    return Promise.resolve()
                })
            })
        })

        it("should update a token", function () {
            return util.getRaptor().then((r) => {
                return createToken(r).then((token) => {
                    token.name = "foobaz"
                    return r.Admin().Token().update(token).then((t) => {
                        d("Updated token: %j", t)
                        assert.equal(t.name, token.name)
                        return Promise.resolve()
                    })
                })
            })
        })

        it("should delete a token", function () {
            return util.getRaptor().then((r) => {
                return createToken(r).then((token) => {
                    return r.Admin().Token().delete(token)
                })
            })
        })

        it("should contain at least a token", function () {
            return util.getRaptor().then((r) => {
                return r.Admin().Token().list().then(function (pager) {
                    const list = pager.getContent()
                    d("User has %s tokens", list.length)
                    assert.isTrue(list instanceof Array)
                    assert.isTrue(list.length > 0)
                })
            })
        })

    })

})

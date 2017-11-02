/*
  global describe
  global before
  global it
  global console
*/

var configFile = process.env.TESTCONFIG || "../data/config.json"

var Raptor = require("../../index")
var Promise = require("bluebird")

var assert = require("chai").assert
var d = require("debug")("raptorjs:test:auth:tokens")

var configInfo = require(configFile)
var r, token


var loadAuthToken = function () {
    return r.Auth().tokens
        .list(r.Auth().currentUser().uuid)
        .then(function (list) {
            var curr = list.filter(t => t.token === r.Auth().currentToken())
            assert.isTrue(curr.length === 1)
            return Promise.resolve(curr[0])
        })
}

var listAuthTokens = function() {
    return r.Auth().tokens.list()
        .then(function (list) {
            return Promise.resolve(list.filter(t => t.type === "LOGIN"))
        })
}

describe("raptor auth service", function () {

    before(function () {
        r = new Raptor(configInfo)
    })

    describe("authentication API", function () {

        it("should login", function () {

            return r.Auth().login()
                .then(function (currentUser) {
                    d("Login done: %j", currentUser)
                    assert.isTrue(r.Auth().currentUser().username === configInfo.username)
                    assert.isTrue(r.Auth().currentToken() && r.Auth().currentToken().length > 0)
                    return Promise.resolve()
                })
        })

        it("should retrieve the token", function () {
            return loadAuthToken()
                .then(function (token2) {
                    token = token2
                    assert.isTrue(token.token === r.Auth().currentToken())
                    return Promise.resolve()
                })
        })

        it("should login again and use a different token", function () {
            return r.Auth().logout()
                .then(function () {
                    assert.isTrue(r.Auth().currentToken() === null)
                    assert.isTrue(r.Auth().currentUser() === null)
                    return r.Auth().login().then(function () {
                        return loadAuthToken().then(function (token2) {
                            assert.notEqual(token.id, token2.id)
                            return Promise.resolve()
                        })
                    })
                })
        })

        it("should login again and have just one login token", function () {
            return r.Auth().logout()
                .then(function () {
                    return r.Auth().login().then(function () {
                        return listAuthTokens()
                            .then(function (logins) {
                                d("Login tokens %j", logins)
                                assert.equal(logins.length, 1)
                                return Promise.resolve()
                            })
                    })
                })
        })

        it("should refresh the auth token and still have on token avail", function () {
            return r.Auth().login()
                .then(function () {
                    return r.Auth().refreshToken()
                        .then(listAuthTokens)
                        .then(function (logins) {
                            assert.equal(logins.length, 1)
                            return Promise.resolve()
                        })
                })
        })

    })
})

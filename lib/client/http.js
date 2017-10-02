var Client = module.exports

var Promise = require("bluebird")
var request = require("request")
var routes = require("../routes")

var d = require("debug")("raptorjs:client:http")

Client.create = function (container) {

    var emit = function() {
        container.emit.apply(container, arguments)
    }

    var opts = container.config

    var addDefaultHeaders = function(opts, token) {
        if(!opts.headers) {
            opts.headers = {
                "Content-Type": "application/json"
            }
        }
        if(token) {
            opts.headers.Authorization = token
        }
    }

    var defaultsOptions = {
        baseUrl: opts.url,
        json: true,
        debug: opts.debug
    }

    addDefaultHeaders(defaultsOptions)

    var client = request.defaults(defaultsOptions)

    d("Created new client %s", defaultsOptions.baseUrl)

    var instance = {}
    instance.request = function (options) {

        // do not try to login if requesting login / get user
        var userReq =  (
            (options.url === routes.LOGIN) ||
            (options.url === routes.USER_GET_ME || options.url === routes.REFRESH_TOKEN)
        ) ?
            Promise.resolve() : container.Auth().loadUser()

        emit("request.start", options)

        return userReq.then(function () {

            if(container.Auth().getToken()) {
                addDefaultHeaders(options, container.Auth().getToken())
            }

            return new Promise(function (resolve, reject) {

                options.headers = Object.assign({}, defaultsOptions.headers || {}, options.headers || {})

                d("Performing request %j", options)
                client(options, function (err, res, body) {

                    if(err) {
                        d("Request failed %s", err.message)

                        emit("request.error", err)
                        emit("request.complete", false)

                        return reject(err)
                    }

                    var json
                    try {
                        json = JSON.parse(body)
                    } catch(e) {
                        json = body
                    }

                    if(res.statusCode >= 400 || res.statusCode < 200) {

                        if (res.statusCode === 0) {
                            res.statusMessage = "Cannot perform request"
                        }

                        let error = {
                            code: json ? json.code : res.statusCode,
                            message: json ? json.message : res.statusMessage,
                        }

                        if (body) {
                            d("Error body: \n %j", body)
                        }

                        d("Request error %s %s", error.code, error.message)

                        emit("request.error", error)
                        emit("request.complete", false)

                        const err = new Error(error.message)
                        err.code = error.code

                        return reject(err)
                    }

                    d("Request response: %j", json)

                    emit("request.complete", json)
                    resolve(json)
                })

            })
        })

    }

    instance.get = function (url) {
        return instance.request({
            method: "GET",
            url: url
        })
    }

    instance.delete = function (url) {
        return instance.request({
            method: "DELETE",
            url: url
        })
    }

    instance.put = function (url, data) {
        return instance.request({
            method: "PUT",
            url: url,
            body: data
        })
    }

    instance.post = function (url, data) {
        return instance.request({
            method: "POST",
            url: url,
            body: data
        })
    }

    instance.client = client

    return instance
}

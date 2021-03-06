var Client = module.exports

var Promise = require("bluebird")
//var request = require("request")
var routes = require("../routes")
var axios = require("axios")

var d = require("debug")("raptorjs:client:http")

Client.create = function (container) {

    var emit = function() {
        container.emit.apply(container, arguments)
    }

    var opts = container.config

    var addDefaultHeaders = function(opts, token) {
        if(!opts.headers) {
            opts.headers = { "Content-Type": "application/json" }
        }
        if(token) {
            opts.headers.Authorization = `Bearer ${token}`
        }
    }

    var defaultsOptions = {
        baseURL: opts.url
        //json: true,
        //debug: opts.debug
    }

    addDefaultHeaders(defaultsOptions)

    //var client = request.defaults(defaultsOptions)
    console.log('using axios')
    var client = axios.create(defaultsOptions)

    d("Created new client %s", defaultsOptions.baseURL)

    var instance = {}

    instance.baseRequest = (options) => {
        return new Promise(function (resolve, reject) {

            options.headers = Object.assign({}, defaultsOptions.headers || {}, options.headers || {})

            d("Performing request %j", options)
            client(options).then((res) => {

                var json
                try {
                    json = JSON.parse(res.data)
                } catch(e) {
                    json = res.data
                }

                if(res.status >= 400 || res.status < 200) {

                    if (res.status === 0) {
                        res.statusMessage = "Cannot perform request"
                    }

                    let error = {
                        code: json ? json.code : res.status,
                        message: json ? json.message : res.statusText
                    }

                    if (res.data) {
                        d("Error body: \n %j", res.data)
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
            }).catch(function (error) {
                console.error(error.code)
                return reject(error)
            })

        })
    }

    instance.request = function (options) {

        // do not try to login if requesting login / get user
        var userReq =  (
            options.url === routes.LOGIN ||
                options.url === routes.USER_GET_ME ||
                    options.url === routes.REFRESH_TOKEN
        ) ?
            Promise.resolve() : container.Auth().loadUser()

        emit("request.start", options)

        return userReq.then(function () {

            if(container.Auth().getToken()) {
                addDefaultHeaders(options, container.Auth().getToken())
            }

            return instance.baseRequest(options)
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
            data: data
        })
    }

    instance.post = function (url, data) {
        return instance.request({
            method: "POST",
            url: url,
            data: data
        })
    }

    instance.client = client

    return instance
}

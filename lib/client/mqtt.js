var Client = module.exports

const Promise = require("bluebird")
const d = require("debug")("raptorjs:client:mqtt")
const EventEmitter = require("eventemitter3")

Client.create = function (container) {

    var emit = function() {
        container.emit.apply(container, arguments)
    }

    var opts = container.getConfig()

    var client
    var instance = {}
    var emitter = new EventEmitter({})

    var parseJSON = function (msg) {
        try {
            return JSON.parse(msg)
        } catch(e) {
            //foo
        }
        return msg
    }

    instance.emitter = emitter

    var mqttConnect = null

    instance.connect = function () {

        if(!mqttConnect) {

            mqttConnect = function (/*currentUser*/) {
                return new Promise(function (resolve, reject) {
                    const opts = container.getConfig()

                    let mqttUrl = opts.mqttUrl
                    if (!mqttUrl) {
                        // var url = require("url").parse(opts.url)
                        // mqttUrl = "mqtt" + (url.protocol === "http:" ? "" : "s" ) + "://"
                        //     + url.hostname + ":1883"
                        var url = require("url").parse(opts.url)
                        const isBrowser = this.window === this
                        const isSecure = url && url.protocol !== "http:"
                        // mqttUrl = "wss://v5.raptorbox.eu:8883/"
                        mqttUrl = (isBrowser ? "ws" : "mqtt") + (!isSecure ? "" : "s" )
                            + "://"
                            + url.hostname
                            + ":" + ( isBrowser ? (url.port ? url.port : "") + "/ws" : (isSecure ? "8883" : "1883"))
                    }
                    var withCred = "credentials"
                    var username = opts.username
                    var password = opts.password

                    if (opts.token) {
                        withCred = "token"
                        username = "*"
                        password = opts.token
                    }

                    d("Connecting to %s with %s", mqttUrl, withCred)

                    // var mqtt = require("mqtt")
                    var mqtt = require("mqtt/lib/connect/index.js")
                    client = mqtt.connect(mqttUrl, {
                        protocolId: "MQTT",
                        protocolVersion: 4,
                        username: username,
                        password: password,
                        clientId: 'raptorbox_mqttjs_ans_asdfghqwerty_' + Math.random().toString(16).substr(2, 8)
                    })
                    instance.client = client

                    var onError = function (e) {
                        d("Connection error", e)

                        emit("error", e)

                        client.removeListener("connect", onConnect)
                        client.removeListener("error", onError)
                        mqttConnect = null

                        reject(e)
                    }
                    var onConnect = function () {
                        d("Connected")

                        emit("connected")

                        client.removeListener("connect", onConnect)
                        client.removeListener("error", onError)

                        resolve()
                    }

                    client.on("connect", onConnect)
                    client.on("error", onError)

                    client.on("error", function (e) {
                        emitter.emit("error", e)
                    })

                    client.on("message", function (topic, message) {

                        var msg = parseJSON(message.toString())

                        d("Received message: %j", msg)

                        emit("message", {
                            topic: topic,
                            message: msg
                        })

                        emitter.emit("message", msg)
                        emitter.emit(topic, msg)
                    })

                })
            }
            return container.Auth().login().then(mqttConnect)
        }
        return Promise.resolve(mqttConnect)
    }

    instance.publish = function (topic, msg, opts) {
        return instance.connect().then(function () {

            if (typeof topic !== "string") {
                return Promise.reject(new Error("Topic must be a string"))
            }

            d("Publishing to %s", topic)

            opts = opts || {}
            if (typeof msg !== "string" && (Buffer && !(msg instanceof Buffer))) {
                msg = JSON.stringify(msg)
            }

            return new Promise(function(resolve, reject) {
                client.publish(topic, msg, opts, function (err) {
                    if(err) {
                        d("Publish failed on %s", topic)
                        return reject(err)
                    }
                    emit("published", topic)
                    d("Published")
                    resolve(emitter)
                })
            })
        })
    }
    instance.subscribe = function (topic, fn) {
        return instance.connect().then(function () {
            d("Subscribing to %s", topic)
            client.subscribe(topic, function () {
                emit("subscribed", topic)
                d("Subscribed")
            })
            if(fn) emitter.on(topic, fn)
            return Promise.resolve(emitter)
        })
    }
    instance.unsubscribe = function (topic, fn) {
        return instance.connect().then(function () {
            d("Unsubscribing from %s", topic)
            client.unsubscribe(topic, function () {
                emit("unsubscribed", topic)
                d("Unsubscribed")
            })
            emitter.off(topic, fn || null)
            return Promise.resolve(emitter)
        })
    }
    instance.disconnect = function (force) {
        if(!instance.client) {
            return Promise.resolve()
        }
        return new Promise(function(resolve, reject) {
            instance.client.end(force || false, function(err) {
                if(err) return reject(err)
                instance.client = null
                resolve()
            })
        })
    }

    return instance
}

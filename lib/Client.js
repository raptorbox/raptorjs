
class Client {

    constructor(container) {

        var http = require("./client/http")
        var mqtt = require("./client/mqtt")

        var httpClient = http.create(container)
        var mqttClient = mqtt.create(container)

        Object.assign(this, httpClient, mqttClient)
    }
}

module.exports = Client

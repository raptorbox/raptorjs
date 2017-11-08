
const Raptor = require("raptor-sdk")
const config = require(process.env.CONFIG || "./config.default.json")
const log = require("winston")

const code = "0001"

const raptor = new Raptor(config.raptor)

const loadDevice = (code) => {
    log.info("Search device with code %s", code)
    return raptor.Inventory()
        .search({
            properties: {code}
        })
        .then((result) => {
            // found a device
            if (result.length) {
                log.info("Found device %s", result[0].name)
                return Promise.resolve(result[0])
            }

            // create a new device
            log.info("Creating a new example device")

            const device = new Raptor.models.Device()
            device.name = "Environment monitor"
            device.properties.code = code
            device.setStream({
                "name": "ambient",
                "channels": {
                    "temperature": "number",
                    "light": "number",
                }
            })
            device.setStream({
                "name": "battery",
                "channels": {
                    "charge": "number",
                }
            })

            log.debug("Creating device: %j", device.toJSON())

            return raptor.Inventory().create(device)
        })
}

const subscribe = (device) => {
    return raptor.Stream()
        .subscribe(device.getStream("ambient"), (data) => {
            log.info("Data received: %j", data)
        })
        .then(()=> Promise.resolve(device))
}

const pushData = (device, maxCounter) => {
    maxCounter = !maxCounter || maxCounter <= 0 ? 10 : maxCounter
    return new Promise(function(resolve, reject) {
        let counter = maxCounter
        const intv = setInterval(function() {
            const record = device.getStream("ambient").createRecord({
                temperature: Math.floor(Math.random()*10),
                light: Math.floor(Math.random()*100)
            })
            log.debug("Sending data %d/%d", (maxCounter-counter)+1, maxCounter)
            raptor.Stream().push(record)
                .then(() => {
                    counter--
                    if (counter === 0) {
                        clearInterval(intv)
                        log.info("Send data completed")
                        resolve(device)
                    }
                })
                .catch((e) => {
                    clearInterval(intv)
                    log.warn("Send data failed: %s", e.message)
                    reject(e)
                })
        }, 1500)
    })
}

const main = () => {

    if (config.logLevel) {
        log.level = config.logLevel
    }

    raptor.Auth().login()
        .then((user) => {
            log.debug("Logged in as %s (id=%s)", user.username, user.id)
            return loadDevice(code)
        })
        .then((device) => {
            log.debug("Got device `%s`, subscribing to events", device.id)
            return subscribe(device)
        })
        .then((device) => {
            log.debug("Pushing data to device `%s`", device.id)
            return pushData(device, 2)
        })
        .then((device) => {
            log.debug("Unsubscribing device `%s`", device.id)
            return raptor.Inventory().unsubscribe(device)
        })
        .then(() => {
            log.info("Closing")
            process.exit(0)
        })
        .catch((e) => {
            log.error("Error: %s", e.message)
        })
}

main()

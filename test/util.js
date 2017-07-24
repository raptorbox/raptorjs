
const Raptor = require("../index")
const l = module.exports

l.createInstance = (config) => {
    config = config || require("./data/config.json")

    const r = new Raptor(config)

    console.log(
        Object.getOwnPropertyNames(r)
            .concat(Object.getOwnPropertyNames(r.__proto__))
    )

    return r.Auth().login().then(() => Promise.resolve(r))
}

l.createDevice = (dev, raptor) => {
    dev = dev || require("./data/device.js")
    const p = raptor ? Promise.resolve(raptor) : l.createInstance()
    return p.then((r1) => r1.Inventory().create(dev).then((device) => {
        return Promise.resolve(device).bind(r1)
    }))
}

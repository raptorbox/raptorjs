
var Promise = require("bluebird")
const Raptor = require("../index")
const l = module.exports

l.getRaptor = (config) => {
    config = config || require("./data/config.json")
    const r = new Raptor(config)
    return r.Auth().login().then(() => Promise.resolve(r))
}

l.createDevice = (raptor, dev) => {
    dev = dev || require("./data/device.js")
    const p = raptor ? Promise.resolve(raptor) : l.getRaptor()
    return p.then((r1) => r1.Inventory().create(dev).then((device) => {
        return Promise.resolve(device).bind(r1)
    }))
}

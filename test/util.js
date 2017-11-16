
var Promise = require("bluebird")
const Raptor = require("../index")
const l = module.exports

const config = require("./data/config.json")


l.randomName = (prefix) => {
    prefix = prefix || ""
    const rnd = Math.round(Math.random() * Date.now())
    return `test_${prefix}_${rnd}`
}

l.getRaptor = (cfg) => {
    cfg = cfg || config
    const r = new Raptor(cfg)
    return r.Auth().login().then(() => Promise.resolve(r))
}

l.createDevice = (raptor, dev) => {
    dev = dev || require("./data/device.js")
    const p = raptor ? Promise.resolve(raptor) : l.getRaptor()
    return p.then((r1) => r1.Inventory().create(dev).then((device) => {
        return Promise.resolve(device).bind(r1)
    }))
}

l.newUser = (username) => {
    username = username || l.randomName("user")
    const u = new Raptor.models.User()
    u.username = username
    u.password = "passwd_" + u.username
    u.email = u.username + "@test.raptor.local"
    u.roles = ["user"]
    return u
}

l.createUserInstance = (roles) => {
    return l.getRaptor()
        .then((r) => {
            const u = l.newUser()
            u.roles = roles ? roles : u.roles
            return r.Admin().User().create(u)
                .then(() => {
                    const r2 = new Raptor({
                        url: config.url,
                        username: u.username,
                        password: u.password,
                    })
                    return r2.Auth().login()
                        .then(() => Promise.resolve(r2))
                })
        })
}

l.createAdminInstance = () => {
    return l.createUserInstance(["admin"])
}

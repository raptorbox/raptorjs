
var d = require("debug")("raptorjs:profile")
const Base = require("./Base")

class Profile  extends Base {

    constructor (container) {
        super(container)
    }

    getAll(userId) {
        d("Get all values for %s", userId)
        userId = userId || this.getContainer().Auth().currentUser().id
        return this.getClient().get(this.route("PROFILE_GET_ALL", userId))
    }

    get(key, userId) {
        d("Get %s for %s", key, userId)
        userId = userId || this.getContainer().Auth().currentUser().id
        return this.getClient().get(this.route("PROFILE_GET", userId, key))
    }

    set(key, value, userId) {
        d("Set value of %s for %s", key, userId)
        userId = userId || this.getContainer().Auth().currentUser().id
        return this.getClient().put(this.route("PROFILE_SET", userId, key), value)
    }

}


module.exports = Profile


var Base = require("./Base")
var d = require("debug")("raptorjs:auth")

const newExpires = () => (new Date().getTime()) + (1000 * 60 * 10) // 10min

class Auth extends Base {

    constructor(container) {

        super(container)

        this.defaultState = {
            token: null,
            user: null,
            expires: null
        }
        this.state = null

        this.reset()
    }

    setUser(user) {
        this.state.user = user
    }

    getUser() {
        return this.state.user || null
    }

    setToken(token) {
        this.state.token = token
    }

    getToken() {
        return this.state.token || null
    }

    setExpires(expires) {
        this.state.expires = expires
    }

    getExpires() {
        return this.state.expires
    }

    reset() {
        this.state = Object.assign({}, this.defaultState)
    }

    loadUser(info) {
        return this.login(info)
    }

    loginIsExpired() {
        return this.state.expires !== null
            && new Date().getTime() - this.state.expires > 0
    }

    login() {
        // User available
        if(this.getUser()) {
            // try to refresh onyl if logged with username & password
            if (this.loginIsExpired() && !this.getConfig().token) {
                return this.refreshToken()
            }
            return Promise.resolve(this.getUser())
        }

        const credentials = this.getConfig()
        let promise = null

        if(credentials.token) {
            this.setToken(credentials.token)
            promise = this.getContainer().Admin().User().read()
                .then((user) => {
                    return Promise.resolve({ user, token: credentials.token })
                })
        }
        else {

            if(!credentials.username || !credentials.password) {
                return Promise.reject(new Error("Username and password are required to login"))
            }

            d("Login user %s", credentials.username)
            promise = this.getClient().post(this.route("LOGIN"), credentials)
        }

        return promise
            .then(({user, token}) => {
                this.setToken(token)
                this.setUser(user)
                this.setExpires(newExpires())
                return Promise.resolve(this.getUser())
            })
    }

    logout() {
        return this.getClient().delete(this.route("LOGOUT"))
            .then(() => {
                this.reset()
                return Promise.resolve()
            })
    }

    refreshToken() {
        return this.getClient().get(this.route("REFRESH_TOKEN"))
            .then((res) => {
                this.setToken(res.token)
                this.setExpires(newExpires())
                return Promise.resolve(this.getUser())
            })
    }

    syncDevice(req) {
        return this.getClient().post(this.route("DEVICE_SYNC"), req)
    }
}

module.exports = Auth

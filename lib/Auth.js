
var Base = require("./Base")
var User = require("./model/User")

var d = require("debug")("raptorjs:auth")

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

    User() {
        if(!this.user) {
            const UserModule = require("./auth/User")
            this.user = new UserModule(this.getContainer())
        }
        return this.user
    }

    Role() {
        if(!this.role) {
            const Role = require("./auth/Role")
            this.role = new Role(this.getContainer())
        }
        return this.role
    }

    Permission() {
        if(!this.permission) {
            const Permission = require("./auth/Permission")
            this.permission = new Permission(this.getContainer())
        }
        return this.permission
    }

    Token() {
        if(!this.token) {
            const Token = require("./auth/Token")
            this.token = new Token(this.getContainer())
        }
        return this.token
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

    reset() {
        this.state = Object.assign({}, this.defaultState)
    }

    loadUser(info) {
        return this.login(info)
    }

    login(credentials) {

        if(arguments.length === 2) {
            credentials = {
                username: arguments[0],
                password: arguments[1]
            }
        }

        if(!credentials) {
            credentials = {
                username: this.getConfig().username,
                password: this.getConfig().password,
                token: this.getConfig().token,
            }
        }

        // User available
        if(this.getUser()
            && ((this.getUser().username &&
                (this.getUser().username !== credentials.username
                    || this.getUser().password !== credentials.password))
                || (this.getUser().token&& this.getUser().token !== credentials.token))
        ) {
            return Promise.resolve(this.getUser())
        }

        let promise = null

        if(credentials.token) {
            this.setToken(credentials.token)
            promise = this.User().read()
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
                this.setUser(new User(user))
                this.setToken(token)
                return Promise.resolve(this.getUser())
            })
    }

    logout() {
        return this.client.delete(this.route("LOGOUT"))
            .then(() => {
                this.reset()
                return Promise.resolve()
            })
    }

    refreshToken() {
        return this.getClient().get(this.route("REFRESH_TOKEN"))
            .then((res) => {
                this.setToken(res.token)
                return Promise.resolve()
            })
    }
}

module.exports = Auth

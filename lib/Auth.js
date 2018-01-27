
const Base = require("./Base")
const d = require("debug")("raptorjs:auth")
const oauth2 = require("client-oauth2")

const newExpires = () => Date.now() + (1000 * 60 * 5) // 5min

class Auth extends Base {

    constructor(container) {

        super(container)

        this.defaultState = {
            token: null,
            user: null,
            expires: null,
            oauth2: null
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
        return this.state.token || this.getConfig().token || null
    }

    setOAuth2Credentials(info) {
        this.state.oauth2 = info
    }

    getOAuth2Credentials() {
        return this.state.oauth2 || null
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
        return !this.getConfig().token
            && (this.state.expires !== null
                && (Date.now() - this.state.expires) > 0)
    }

    login(config) {

        if(config) {
            const url = config.url || this.getConfig().url
            if (config.token) {
                this.setConfig({
                    url, token: config.token
                })
            } else if (config.domain) {
                this.setConfig({
                    url,
                    domain: config.domain,
                    username: config.username,
                    password: config.password
                })
            } else {
                this.setConfig({
                    url,
                    username: config.username,
                    password: config.password
                })
            }
        }

        // User available
        if(this.getUser()) {

            // try to refresh only if logged with username & password
            if (this.loginIsExpired()) {
                d("Refreshing session token [user=%s]", this.getConfig().username)
                return this.refreshToken()
            }

            d("User avail [%s]", this.getUser().username)
            return Promise.resolve(this.getUser())
        }

        const credentials = this.getConfig()
        let promise = null

        // clean up previous state
        this.reset()

        if(credentials.clientId) {
            promise = this.getAccessToken(credentials)
                .then(() => this.getContainer().Admin().User().read())
                .then((user) => {
                    return Promise.resolve({ user, token: credentials.token })
                })

        } else if(credentials.token) {
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

    getAccessToken(credentials) {

        const client = new oauth2(credentials, (method, url, body, headers) => {
            return this.getClient().baseRequest({
                method, url, body, headers, baseUrl: null,
            }).then((body) => {
                // adapt response, wrap in { body: ... }
                return Promise.resolve({ body: JSON.stringify(body) })
            })
        })

        let p
        switch (credentials.type) {
        default:
        case "client_credentials":
            p = client.credentials.getToken()
            break
        }

        return p.then((info) => {
            d("Retrieved oauth2 token")
            this.setOAuth2Credentials(info)
            this.setToken(info.accessToken)
            this.setExpires(info.expires.getTime())
            return this.getContainer().Admin().User().read()
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

        if(this.getOAuth2Credentials()) {
            return this.getOAuth2Credentials().refresh()
                .then((info) => {
                    this.setOAuth2Credentials(info)
                    this.setToken(info.accessToken)
                    this.setExpires(info.expires.getTime())
                    return Promise.resolve()
                })
        }

        return this.getClient().get(this.route("REFRESH_TOKEN"))
            .then((res) => {
                this.setToken(res.token)
                this.setExpires(newExpires())
                return Promise.resolve(this.getUser())
            })
    }

    /**
     * @deprecated use sync() instead
     */
    syncDevice(req) {
        return this.getClient().post(this.route("DEVICE_SYNC"), req)
    }

    sync(req) {
        const invalid = ["type","permission","userId","subjectId"].filter((k) => !req[k])
        if(invalid.length) {
            throw new Error("Sync request has missing properties: " + invalid.join(","))
        }
        return this.getClient().post(this.route("ACL_SYNC"), req)
    }

    can(type, permission, subjectId, userId, domain) {
        if (typeof type === "object") {
            subjectId = type.subjectId
            permission = type.permission
            userId = type.userId
            domain = type.domain
            type = type.type
        }

        userId = userId || this.getContainer().Auth().getUser().uuid
        domain = domain || this.getContainer().getConfig().domain || null

        return this.getContainer().Admin().User().can({
            userId, type, permission, subjectId, domain
        })
    }
}

module.exports = Auth

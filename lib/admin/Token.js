
const Base = require("../Base")
const User = require("../model/User")
const Pager = require("../pager")

const d = require("debug")("raptorjs:token")

class Token extends Base {

    Permission() {
        return this.getContainer().Admin().getPermission("token")
    }

    read(token) {
        token = token.id ? token : { id: token}
        d("Loading token %s", token.id)
        return this.getClient().get(this.route("TOKEN_GET", token.id))
    }

    save(token) {
        return token.id ? this.update(token) : this.create(token)
    }

    create(token) {
        d("Creating token")
        return this.getClient().post(
            this.route("TOKEN_CREATE"),
            token
        )
    }

    current() {
        d("Fetch current token info")
        return this.getClient().get(this.route("TOKEN_CURRENT"))
    }
    /**
     * Ensure a { token: 'string' }  is valid and return the user
     */
    check(token) {
        d("Checking token")
        if (typeof token === "string") {
            token = {token}
        }
        if(!(token && token.token)) {
            throw new Error("Missing token parameter")
        }
        return this.getClient().post(
            this.route("TOKEN_CHECK"),
            token
        ).then((json) => {
            const u = new User(json)
            u.token = json.token
            return Promise.resolve(u)
        })
    }

    update(token) {
        d("Updating token %s", token.id)
        return this.getClient().put(
            this.route("TOKEN_UPDATE", token.id),
            token
        )
    }

    delete(token) {
        d("Deleting token %s", token.id)
        return this.getClient().delete(
            this.route("TOKEN_DELETE", token.id)
        )
    }

    list(userId, pager={}) {
        userId = userId || this.getContainer().Auth().getUser().id
        d("Listing tokens for %s", userId)
        const url = this.route("TOKEN_LIST") + Pager.buildQuery(pager, { userId:userId })
        return this.getClient().get(url)
            .then((list) => Promise.resolve(Pager.create(list)))
    }
}

module.exports = Token

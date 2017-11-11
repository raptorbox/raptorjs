
const Base = require("../Base")

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
    /**
     * Ensure a {token: 'string' }  is valid an return {id, userId}
     */
    check(token) {
        d("Checking token")
        token = token && token.token ? token.token : token
        if(!token) {
            throw new Error("Missing token parameter")
        }
        return this.getClient().post(
            this.route("TOKEN_CHECK"),
            token
        )
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

    list(userId) {
        userId = userId || this.getContainer().Auth().getUser().id
        d("Listing tokens for %s", userId)
        return this.getClient().get(this.route("TOKEN_LIST", userId))
            .then((list) => Promise.resolve(require("../pager").create(list)))
    }
}

module.exports = Token

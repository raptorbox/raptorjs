
const Base = require("../Base")

const d = require("debug")("raptorjs:token")

class Token extends Base {

    Permission() {
        return this.getContainer().Admin().getPermission("token")
    }

    load(tokenId) {
        d("Loading token %s", tokenId)
        return this.getClient().get(this.route("TOKEN_GET", tokenId))
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
        userId = userId || this.getContainer().Auth().getUser().uuid
        d("Listing tokens for %s", userId)
        return this.getClient().get(this.route("TOKEN_LIST", userId))
    }
}

module.exports = Token


const Base = require("../Base")

class Client extends Base {

    create(client) {
        if (typeof client === "string") {
            client = {
                name: client
            }
        }
        return this.getClient().post(this.route("CLIENT_CREATE"), client)
    }

    update(client) {
        if(!client.id) throw new Error("Client id is missing")
        return this.getClient().put(this.route("CLIENT_UPDATE", client.id), client)
    }

    save(client) {
        if(client.id) {
            return this.update(client)
        }
        return this.create(client)
    }

    delete(client) {
        if (typeof client === "string") {
            client = { id: client }
        }
        if(!client.id) throw new Error("Client id is missing")
        return this.getClient().delete(this.route("CLIENT_DELETE", client.id))
    }

    read(client) {
        const id = client.id ? client.id : client
        return this.getClient().get(this.route("CLIENT_GET", id))
    }

    list() {
        return this.getClient().get(this.route("CLIENT_LIST"))
    }

}

module.exports = Client

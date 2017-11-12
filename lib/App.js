
const Base = require("./Base")
const Pager = require("./pager")

class App extends Base {

    create(app) {
        return this.getClient().post(this.route("APP_CREATE"), app)
    }

    update(app) {
        if(!app.id) throw new Error("App id is missing")
        return this.getClient().put(this.route("APP_UPDATE", app.id), app)
    }

    save(app) {
        if(app.id) {
            return this.update(app)
        }
        return this.create(app)
    }

    delete(app) {
        app = app.id ? app : { id: app.id }
        if(!app.id) throw new Error("App id is missing")
        return this.getClient().delete(this.route("APP_DELETE", app.id))
    }

    read(app) {
        const id = app.id ? app.id : app
        const path = this.route("APP_READ", id)
        return this.getClient().get(path)
    }

    list() {
        return this.getClient().get(this.route("APP_LIST"))
            .then((res) => Promise.resolve(new Pager(res)))
    }

    search(q) {
        return this.getClient().post(this.route("APP_SEARCH"), q)
            .then((res) => Promise.resolve(new Pager(res)))
    }

}


module.exports = App

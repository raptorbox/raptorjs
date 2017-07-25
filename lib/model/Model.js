
class Model {

    constructor(json) {
        if(json) {
            this.json = {}
            this.fromJSON(json)
        }
    }

    validate() {
        //noop
    }

    fromJSON(json) {
        if(typeof json === "string") {
            json = JSON.parse(json)
        }
        this.json = Object.assign({}, json || {})
    }

    toJSON() {
        return this.json
    }

}

module.exports = Model

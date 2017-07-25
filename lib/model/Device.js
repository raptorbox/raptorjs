
const Model = require("./Model")

class Device extends Model {

    fromJSON(j) {
        super.fromJSON(j)

        if(!this.json.streams) {
            this.json.streams = {}
        }
        //convert to object
        if(this.json.streams instanceof Array) {
            const list = {}
            this.json.streams.forEach((el) => {
                list[el.name] = Object.assign({}, el)
            })
            this.json.streams = list
        }

        if(!this.json.actions) {
            this.json.actions = {}
        }
        //convert to object
        if(this.json.actions instanceof Array) {
            const list = {}
            this.json.actions.forEach((el) => {
                list[el.name] = Object.assign({}, el)
            })
            this.json.actions = list
        }

    }

    getStream(name) {
        return this.json.streams[name]  || null
    }

    setStream(stream) {
        this.json.streams[stream.name] = Object.assign({}, stream)
    }

    getAction(name) {
        this.json.actions[name] || null
    }

    setAction(action) {
        this.json.actions[action.name] = Object.assign({}, action)
    }

}

module.exports = Device

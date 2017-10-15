
const Model = require("./Model")
const Stream = require("./Stream")
const Action = require("./Action")
const Settings = require("./Settings")

class Device extends Model {

    defaultFields() {
        return {
            userId: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            name: { type: String, required: true },
            description: String,
            properties: Object,
            settings: {
                type: Settings,
                default: () => new Settings()
            },
            streams: {
                listOf: Stream,
                transform: (stream, name) => {

                    if(!stream.channels && typeof stream === "object") {

                        if (stream["type"] === "dynamic") {
                            stream.channels = {}
                        }
                        else {
                            stream = {
                                channels: stream
                            }
                        }
                    }

                    if(name) {
                        stream.name = name
                    }

                    return stream
                }
            },
            actions: {
                listOf: Action,
                transform: (action, name) => {

                    if(typeof action === "string") {
                        action = {
                            name: action
                        }
                    }

                    if(name) {
                        action.name = name
                    }

                    return action
                }
            }
        }
    }

    fromJSON(json) {

        this.arrayToObject("actions", "name", json)
        this.arrayToObject("streams", "name", json)

        super.fromJSON(json)
    }

    afterConstructor() {


        if(this.json.streams) {
            Object.keys(this.json.streams).forEach((name) => {
                this.json.streams[name].setDevice(this)
            })
        }

        if(this.json.actions) {
            Object.keys(this.json.actions).forEach((name) => {
                this.json.actions[name].setDevice(this)
            })
        }


    }

    getStream(name) {
        return this.json.streams[name]  || null
    }

    setStream(stream) {
        this.json.streams[stream.name] = new Stream(stream)
        return this
    }

    addStream(name, channels){
        this.json.streams[name] = new Stream({name, channels})
        return this
    }

    getAction(name) {
        return this.actions[name] || null
    }

    setAction(action) {
        this.actions[action.name] = new Action(action)
        return this
    }

}

module.exports = Device

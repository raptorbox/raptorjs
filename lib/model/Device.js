
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
            createdAt: {
                type: Date,
                transform: (raw) => new Date(raw * 1000)
            },
            updatedAt: {
                type: Date,
                transform: (raw) => new Date(raw * 1000)
            },
            domain: String,
            properties: Object,
            settings: {
                type: Settings,
                default: () => new Settings()
            },
            streams: {
                listOf: Stream,
                required: true,
                default: {},
                transform: (stream, name) => {

                    if(!stream.channels && typeof stream === "object") {

                        if (stream["dynamic"] === true) {
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
                required: true,
                default: {},
                transform: (action, name) => {

                    if(typeof action === "string") {
                        let a = action.toString().toLowerCase()
                        a = a.replace(' ', '_')
                        action = {
                            name: action,
                            id: a
                        }
                    }

                    if(name) {
                        action.name = name
                        let a = action.name.toString().toLowerCase()
                        a = a.replace(' ', '_')
                        action.id = a
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
        return this.streams[name] || null
    }

    setStream(stream) {
        this.streams[stream.name] = new Stream(stream)
    }

    getAction(name) {
        return this.actions[name] || null
    }

    setAction(action) {
        this.actions[action.name] = new Action(action)
    }

}

module.exports = Device

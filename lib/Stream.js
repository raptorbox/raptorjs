
var d = require("debug")("raptorjs:stream")
var Base = require("./Base")
var Record = require("./model/Record")
var util = require("./util")
var Pager = require("./pager")

class Stream extends Base {

    constructor(container) {
        super(container)
    }

    list(stream, paging={}) {
        d("Fetch data for %s on %s", stream.name, stream.deviceId)
        const url = this.route("STREAM_PULL", stream.deviceId, stream.name) + Pager.buildQuery(paging, null)
        return this.getClient().get(url)
            .then((list) => { 
                return Promise.resolve(Pager.create(list, (record) => new Record(record, stream)))
            })
    }

    lastUpdate(stream) {
        d("Fetch last update for %s on %s", stream.name, stream.deviceId)
        return this.getClient().get(this.route("STREAM_LAST_UPDATE", stream.deviceId, stream.name))
            .then((r) => { 
                return Promise.resolve(new Record(r, stream))
            })
    }

    push(data, stream) {
        stream = data.getStream ? data.getStream() : stream
        if(!stream) {
            throw new Error("stream must be provided in Record or as second argument")
        }
        d("Save data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().put(this.route("STREAM_PUSH", stream.deviceId, stream.name), data)
    }

    search(stream, q, paging = {}) {
        d("Search data for %s on %s", stream.name, stream.deviceId)
        const url = this.route("STREAM_SEARCH", stream.deviceId, stream.name) + Pager.buildQuery(paging)
        return this.getClient().post(url, q)
            .then((list) => {
                let contents = list.content.map((r) => new Record(r, stream))
                return Promise.resolve(contents)
            })
    }

    delete(stream) {
        d("Remove data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().delete(this.route("STREAM_LIST", stream.deviceId, stream.name))
    }

    subscribe(stream, fn) {
        return this.getClient().subscribe("stream/" + stream.deviceId + "/" + stream.name, fn)
            .then(() => Promise.resolve(stream))
    }

    unsubscribe(stream, fn) {
        return this.getClient().unsubscribe("stream/" + stream.deviceId + "/" + stream.name, fn)
            .then(() => Promise.resolve(stream))
    }

}

module.exports = Stream


var d = require("debug")("raptorjs:stream")
var Base = require("./Base")
var Record = require("./model/Record")
var util = require("./util")

class Stream extends Base {

    constructor(container) {
        super(container)
    }

    list(stream, from, to) {
        d("Fetch data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().get(this.route("STREAM_PULL", stream.deviceId, stream.name) + util.createQueryString(from, to))
            .then((list) => Promise.resolve(list.map((r) => new Record(r, stream))))
    }

    lastUpdate(stream) {
        d("Fetch last update for %s on %s", stream.name, stream.deviceId)
        return this.getClient().get(this.route("STREAM_LAST_UPDATE", stream.deviceId, stream.name))
            .then((r) => Promise.resolve(new Record(r, stream)))
    }

    push(data, stream) {
        stream = data.getStream ? data.getStream() : stream
        if(!stream) {
            throw new Error("stream must be provided in Record or as second argument")
        }
        d("Save data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().put(this.route("STREAM_PUSH", stream.deviceId, stream.name), data)
    }

    search(stream, q) {
        d("Search data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().post(this.route("STREAM_SEARCH"), q)
            .then((list) => Promise.resolve(list.map((r) => new Record(r, stream))))
    }

    delete(stream) {
        d("Remove data for %s on %s", stream.name, stream.deviceId)
        return this.getClient().delete(this.route("STREAM_LIST", stream.deviceId, stream.name))
    }

}

module.exports = Stream

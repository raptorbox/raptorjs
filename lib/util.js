
var util = module.exports

util.extends = function (Child, Parent) {

    if(typeof Parent === "string") {
        Parent = require("./model/" + Parent)
    }

    Child.prototype = Object.create(Parent.prototype)
    Child.prototype.constructor = Child
    Child.prototype.__super__ = Parent.prototype
}

util.createQueryString = function (limit, offset) {
    var obj = null
    if(limit !== undefined && limit !== null && limit > 0) {
        obj = {}
        obj.limit = limit
    }
    if(offset !== undefined && offset !== null && offset > 0) {
        obj = obj || {}
        obj.offset = offset
    }
    return obj != null ? util.buildQueryString(obj) : ""
}

util.buildQueryString = function (obj, prefix) {
    var qs = ""
    var qsparts = []
    for(var key in obj) {
        qsparts.push(key + "=" + obj[key])
    }
    qs = (prefix === undefined ? "?" : prefix) + qsparts.join("&")
    return qs
}

util.parseDate = function (timestamp, defaultValue) {
    if(typeof timestamp === "undefined") {
        return new Date()
    }
    if(timestamp instanceof Date) {
        return timestamp
    }
    if(typeof timestamp === "string") {
        return new Date(timestamp)
    }
    if(typeof timestamp === "number") {
    // convert seconds to milliseconds
        timestamp *= (timestamp.toString().length === 10) ? 1000 : 1
        return new Date(timestamp)
    }

  // cannot parse, use default if defined
    if(defaultValue !== undefined) {
        return defaultValue
    }
    throw new Error("Cannot parse date value: " + timestamp)
}

util.toUNIX = function (value) {
    value = value || new Date()
    var timestamp = util.parseDate(value)
    return Math.round(timestamp.getTime() / 1000)
}

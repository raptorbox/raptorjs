
module.exports.list = {
    
    "number": {
        validate: function(raw) {
            return typeof raw === "number"
        }
    },
    "string": {
        validate: function(raw) {
            return typeof raw === "string"
        }
    },
    "boolean": {
        validate: function(raw) {
            return typeof raw === "boolean"
        }
    },
    "geo_point": {
        validate: function(raw) {
            return (raw.lat && raw.lon) || (raw.hash) || (raw instanceof Array && raw.length === 2)
        }
    },
}

module.exports.get = function(name) {
    return module.exports.list[name.toLowerCase()]
}

module.exports.exists = function(name) {
    return module.exports.get(name) !== undefined
}

module.exports.add = function(name, val) {
    module.exports.list[name] = val
}

module.exports.remove = function(name) {
    if(module.exports.exists(name)) {
        delete module.exports.list[name]
    }
}


const Model = require("./Model")

class Device extends Model {

    fromJSON(j) {
        super.fromJSON(j)

        if(!this.json.channels) {
            this.json.channels = {}
        }
        //convert to object
        if(this.json.channels instanceof Array) {
            const list = {}
            this.json.channels.forEach((el) => {
                list[el.name] = Object.assign({}, el)
            })
            this.json.channels = list
        }

    }

    getChannel(name) {
        return this.json.channels[name] || null
    }

}

module.exports = Device


const Model = require("./Model")

class Settings extends Model {
    defaultFields() {
        return {
            storeData: "boolean",
            eventsEnabled: "boolean",
        }
    }
}

module.exports = Settings

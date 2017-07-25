
const Model = require("./Model")
const Record = require("./Record")

class Result extends Model {
    defaultFields() {
        return {
            wrapper: true,
            type: Array,
            listOf: Record
        }
    }
}

module.exports = Result

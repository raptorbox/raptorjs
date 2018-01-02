
const Model = require("./Model")

class Tree extends Model {

    constructor(json) {
        super(json)
    }

    defaultFields() {
        return {
            id: {
                type: String,
                required: false
            },
            userId: {
                type: String,
                required: true
            },
            parentId: {
                type: String,
                required: false
            },
            order: Number,
            name: String,
            domain: String,
            type: {
                type: String,
                required: true,
                default: "group"
            },
            children: {
                listOf: Tree,
            }
        }
    }

}

module.exports = Tree

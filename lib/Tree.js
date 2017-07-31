
var d = require("debug")("raptorjs:tree")
const Base = require("./Base")

class Tree extends Base {

    constructor (container) {
        super(container)
    }

    list() {
        d("Get all tree node")
        return this.getClient().get(this.route("TREE_LIST"))
    }

    tree(node) {
        const nodeid = node.uuid ? node.uuid : node
        d("Get %s node tree", nodeid)
        return this.getClient().get(this.route("TREE_GET", nodeid))
    }

    children(node) {
        const nodeid = node.uuid ? node.uuid : node
        d("Get %s node children", nodeid)
        return this.getClient().get(this.route("TREE_CHILDREN", nodeid))
    }

    add(node, childs) {
        const nodeid = node.uuid ? node.uuid : node
        d("Add children to node %s", nodeid)
        return this.getClient().post(this.route("TREE_ADD", nodeid), childs)
    }

    create(node) {
        d("Create a node")
        return this.getClient().post(this.route("TREE_CREATE"), node)
    }

    remove(node) {
        const nodeid = node.uuid ? node.uuid : node
        d("Remove node %s", nodeid)
        return this.getClient().post(this.route("TREE_REMOVE", nodeid))
    }

    removeTree(node) {
        const nodeid = node.uuid ? node.uuid : node
        d("Remove full tree of node %s", nodeid)
        return this.getClient().post(this.route("TREE_REMOVE_TREE", nodeid))
    }

}


module.exports = Tree

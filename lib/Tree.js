
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

    read(node) {
        const nodeid = node.id ? node.id : node
        d("Get %s node tree", nodeid)
        return this.getClient().get(this.route("TREE_GET", nodeid))
    }

    tree(node) {
        console.log("deprecated: instead of Tree().tree() use Tree.read()")
        return this.read(node)
    }

    children(node) {
        const nodeid = node.id ? node.id : node
        d("Get %s node children", nodeid)
        return this.getClient().get(this.route("TREE_CHILDREN", nodeid))
    }

    add(node, childs) {
        const nodeid = node.id ? node.id : node
        childs = childs instanceof Array ? childs : [childs]
        d("Add children to node %s", nodeid)
        return this.getClient().put(this.route("TREE_ADD", nodeid), childs)
    }

    create(node) {
        d("Create a node")
        return this.getClient().post(this.route("TREE_CREATE"), node)
    }

    remove(node) {
        const nodeid = node.id ? node.id : node
        d("Remove node %s", nodeid)
        return this.getClient().post(this.route("TREE_REMOVE", nodeid))
    }

    removeTree(node) {
        const nodeid = node.id ? node.id : node
        d("Remove full tree of node %s", nodeid)
        return this.getClient().post(this.route("TREE_REMOVE_TREE", nodeid))
    }

    subscribe(node, fn) {
        this.getClient().subscribe("tree/" + node.id, fn)
    }

    unsubscribe(node, fn) {
        this.getClient().unsubscribe("tree/" + node.id, fn)
    }

}

module.exports = Tree

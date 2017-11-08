
class Pager {

    constructor(json) {
        this.defaults = {
            content: [],
            page: 0,
            size: 0,
            total: 0,
        }
        this.json = Object.assign({}, this.defaults, json)
    }

    getContent() {
        return this.json.content || []
    }

    getTotal() {
        return this.json.total
    }

    getPage() {
        return this.json.page
    }

    getSize() {
        return this.json.size
    }

    getSort() {
        return this.json.sort
    }

}

module.exports = Pager
module.exports.create = (raw) => new Pager(raw)

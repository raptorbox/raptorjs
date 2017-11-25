
/*
sort object
{ direction: 'DESC',
       property: 'createdAt',
       ignoreCase: false,
       nullHandling: 'NATIVE',
       ascending: false,
       descending: true }

*/

class Pager {

    constructor(json) {

        this.defaults = {
            content: [],
            last: true,
            totalPages: 0,
            totalElements: 0,
            sort: [],
            first: true,
            numberOfElements: 0,
            size: 100,
            number: 0
        }

        this.json = Object.assign({}, this.defaults, json)
    }

    getContent() {
        return this.json.content || []
    }

    getTotal() {
        return this.json.numberOfElements
    }

    getPage() {
        return this.json.page
    }

    getTotalPages() {
        return this.json.totalPages
    }

    getSize() {
        return this.json.size
    }

    getSort(key) {
        if(!key) return this.json.sort
        const keys = this.json.sort.filter((s) => s.property === key)
        return keys.length ? keys[0] : null
    }

}

module.exports = Pager
module.exports.create = (raw, mapCallback) => {

    if(mapCallback && typeof mapCallback === "function") {
        raw.content = raw.content.map(mapCallback)
    }

    return new Pager(raw)
}

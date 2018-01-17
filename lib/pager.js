
/*
sort object
{ direction: 'DESC',
       property: 'createdAt',
       ignoreCase: false,
       nullHandling: 'NATIVE',
       ascending: false,
       descending: true }

*/

var d = require("debug")("raptorjs:pager")

class Pager {

    constructor(json) {

        const defaults = {
            content: [],
            last: true,
            totalPages: 0,
            totalElements: 0,
            sort: [],
            first: true,
            numberOfElements: 0,
            size: 25,
            number: 0
        }

        this.json = Object.assign({}, defaults, json)
    }

    getContent() {
        return this.json.content || []
    }

    isFirst() {
        return this.json.first
    }

    isLast() {
        return this.json.last
    }

    getPage() {
        return this.json.page
    }

    getTotalPages() {
        return this.json.totalPages
    }

    getTotalElements() {
        return this.json.totalElements
    }

    getNumberOfElements() {
        return this.json.numberOfElements
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

module.exports.buildQuery = (pageOptions, q) => {
    const query = []
    
    if(pageOptions) {

        if(pageOptions.size && pageOptions.limit === undefined) {
            pageOptions.limit = pageOptions.size
        }

        if (pageOptions.page) {
            query.push(`page=${pageOptions.page}`)
        }
        if (pageOptions.limit) {
            query.push(`limit=${pageOptions.limit}`)
        }
        if (pageOptions.sort) {
            pageOptions.sortDir = pageOptions.sortDir.toLowerCase() === "desc" ? "desc" : "asc"
            query.push(`sort=${pageOptions.sort},${pageOptions.sortDir}`)
        }
    }    

    //collect other query parameters
    if(q) {
        Object.keys(q).forEach((field) => {
            const value = q[field]
            query.push(`${field}=${value}`)
        })
    }

    return (query.length) ? encodeURI(`?${query.join("&")}`) : ""
}

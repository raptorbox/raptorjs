
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

module.exports.buildQuery = ({page, size, limit, sort, sortDir}) => {
    const query = []
    const pagerFields = [ "size", "page", "sort", "sortDir" ]

    if(size && !limit) {
        limit = size
    }

    if (page) {
        query.push(`page=${page}`)
    }
    if (limit) {
        query.push(`limit=${limit}`)
    }
    if (sort) {
        sortDir = sortDir.toLowerCase() === "desc" ? "desc" : "asc"
        query.push(`sort=${sort},${sortDir}`)
    }

    //collect other query parameters
    arguments[0] && Object.keys(arguments[0]).forEach((field) => {
        if (pagerFields.indexOf(field) > -1 ) {
            return
        }
        const value = arguments[0][field]
        query.push(`${field}=${value}`)
    })

    return (query.length) ? encodeURI("?" + query.join("&")) : ""
}

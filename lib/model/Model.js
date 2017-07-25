
const cloneDeep = require("lodash.clonedeep")

class Model {

    constructor(json) {

        this.json = null

        if(json) {
            this.fromJSON(cloneDeep(json))
        }

        this.setDefaultFields()
        this.exportProperties()

        this.afterConstructor()
    }

    afterConstructor() {}

    exportProperties() {

        if(this.getDefaultFields().wrapper) {
            return
        }

        if(!this.json) {
            return
        }

        const me = this
        Object.keys(me.json).forEach(function(field) {
            Object.defineProperty(me, field, {
                get: function() {
                    return me.json[field]
                },
                set: function(value) {
                    me.json[field] = value
                },
            })
        })
    }

    setDefaultFields() {

        const fields = this.getDefaultFields()

        if(fields.wrapper) {
            if(this.json !== undefined || this.json !== null) {
                return
            }
            switch (fields.type) {
            case Array:
                this.json = []
                break
            case Object:
                this.json = {}
                break
            }
            return
        }

        this.json = this.json || {}

        Object.keys(fields).forEach((fieldName) => {

            const fieldValue = fields[fieldName]

            if(this.json[fieldName] !== undefined) {
                return
            }

            if(fieldValue.default) {
                if(typeof fieldValue.default === "function") {
                    this.json[fieldName] = fieldValue.default()
                } else {
                    this.json[fieldName] = fieldValue.default
                }
            }
            else {
                switch (fieldValue.type) {
                case Object:
                    this.json[fieldName] = {}
                    break
                case Array:
                    this.json[fieldName] = []
                    break
                default:

                }
            }
        })
    }

    defaultFields() {
        return {}
    }

    getDefaultFields() {

        if(this.__fields) {
            return this.__fields
        }

        this.__fields = this.defaultFields()

        const normalizeTypeDef = (fieldName, fieldValue) => {

            const isString = typeof fieldValue === "string"

            if(fieldValue.name || isString) {
                fieldValue = {
                    type: fieldValue
                }
                if(this.__fields.wrapper) {
                    this.__fields = fieldValue
                } else {
                    this.__fields[fieldName] = fieldValue
                }
            }

            if (isString) {
                switch (fieldValue.type) {
                case "string":
                    fieldValue.type = String
                    break
                case "boolean":
                    fieldValue.type = Boolean
                    break
                case "number":
                    fieldValue.type = Number
                    break
                case "array":
                    fieldValue.type = Array
                    break
                default:
                    fieldValue.type = Object
                    break
                }
            }

            if(fieldValue.required === undefined) {
                fieldValue.required = false
            }

        }

        // wrapper means the object itself is a list like Array or Object
        // @see Result class
        if(this.__fields.wrapper) {
            normalizeTypeDef(null, this.__fields)
            return
        }

        Object.keys(this.__fields).forEach((fieldName) => {
            let fieldValue = this.__fields[fieldName]
            normalizeTypeDef(fieldName, fieldValue)
        })

        return this.__fields
    }

    validate() {

        const fields = this.getDefaultFields()

        const checkValueType = (type, val) => {
            return (val instanceof type)
        }

        const checkInnerValueType = (fieldName, fieldValue, value) => {
            if(!checkValueType(fieldValue.type, value)) {
                throw new Error(`Field ${fieldName} must be of type ${fieldValue.type.name}`)
            }
            const isArray = (value instanceof Array)
            const list = isArray ? value : Object.keys(value)
            list.forEach((valuekey, i) => {
                valuekey = isArray ? i : valuekey
                if(!checkValueType(fieldValue.type.listOf, value[valuekey])) {
                    throw new Error(`Field ${fieldName}.${valuekey} must be of type ${fieldValue.type.name}`)
                }
            })
        }

        if(fields.wrapper) {
            checkInnerValueType(fields.type || fields.listOf, fields, this.json)
            return
        }

        Object.keys(fields).forEach((fieldName) => {

            let fieldValue = fields[fieldName]
            const value = this.json[fieldName]

            if(fieldValue.required) {
                if(value === null || value === undefined || value === "") {
                    throw new Error(`Field ${fieldName} is required`)
                }
            }

            if(fieldValue.type.listOf) {
                checkInnerValueType(fieldName, fieldValue, value)
            }
            else if(!checkValueType(fieldValue.type, value)) {
                throw new Error(`Field ${fieldName} must be of type ${fieldValue.type.name}`)
            }

        })

    }

    typeCast(field, fieldValue) {

        const Type = fieldValue.listOf

        const isArray = this.json[field] instanceof Array

        const list = isArray ? [] : {}
        const values = isArray ? this.json[field] : Object.keys(this.json[field])

        values.forEach((key, i) => {

            key = isArray ? i : key
            let val = this.json[field][key]

            if(fieldValue.transform && typeof fieldValue.transform === "function") {
                val = fieldValue.transform(val, key)
            }

            list[key] = new Type(val)
        })

        this.json[field] = list
    }

    fromJSON(json) {

        if(typeof json === "string") {
            json = JSON.parse(json)
        }

        this.json = Object.assign({}, json || {})

        const fields = this.getDefaultFields()
        Object.keys(fields).forEach((fieldName) => {

            const fieldValue = fields[fieldName]

            if(this.json[fieldName] === undefined) {
                return
            }

            if(this.json[fieldName] === null) {
                delete this.json[fieldName]
            }

            if(fieldValue.listOf && (
                this.json[fieldName] instanceof Array ||
                this.json[fieldName] instanceof Object
            )) {
                this.typeCast(fieldName, fieldValue)
            }
            else {
                if(fieldValue.transform && typeof fieldValue.transform === "function") {
                    this.json[fieldName] = fieldValue.transform(this.json[fieldName])
                }
            }

        })

    }

    toJSON(validate) {
        if(validate === true) {
            this.validate()
        }
        return this.json
    }


    arrayToObject(field, keyField, json) {
        if(json[field] && json[field] instanceof Array) {
            const list = {}
            json[field].forEach((val) => {
                const key = val[keyField] || val
                list[key] = val
            })
            json[field] = list
        }
    }

}

module.exports = Model

/*
Copyright 2016 CREATE-NET

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const d = require("debug")("raptorjs:index")
const models = require("./lib/model/models")
const EventEmitter = require("events").EventEmitter

/**
 * Raptor SDK wrapper
 *
 * @author Luca Capra <luca.capra@create-net.org>
 * @copyright CREATE-NET
 * @license Apache-2.0
 *
 * @constructor
 * @param {Object} config configuration object
 */
class Raptor extends EventEmitter {

    constructor(config) {

        super()

        this.config = {}
        this.isBrowser = (typeof window !== "undefined")

        this.permissions = require("./lib/permissions")
        this.routes = require("./lib/routes")
        this.models = models

        const defaultConfig = {
            token: null,
            username: null,
            password: null,
            url: "https://api.raptorbox.eu",
            debug: false
        }

        if(typeof config === "string") {
            config = {
                token: config
            }
        }

        this.config = Object.assign({}, defaultConfig, config)
        d("Client configuration: %j", this.config)

    }

    getConfig() {
        return this.config
    }

    getClient() {
        if(!this.client) {
            const Client = require("./lib/Client")
            this.client = new Client(this)
        }
        return this.client
    }

    Auth() {
        if(!this.auth) {
            const Auth = require("./lib/Auth")
            this.auth = new Auth(this)
        }
        return this.auth
    }

    Admin() {
        if(!this.admin) {
            const Admin = require("./lib/Admin")
            this.admin = new Admin(this)
        }
        return this.admin
    }

    Profile() {
        if(!this.profile) {
            const Profile = require("./lib/Profile")
            this.profile = new Profile(this)
        }
        return this.profile
    }

    Inventory() {
        if(!this.inventory) {
            const Inventory = require("./lib/Inventory")
            this.inventory = new Inventory(this)
        }
        return this.inventory
    }

    Stream() {
        if(!this.stream) {
            const Stream = require("./lib/Stream")
            this.stream = new Stream(this)
        }
        return this.stream
    }

    Tree() {
        if(!this.tree) {
            const Tree = require("./lib/Tree")
            this.tree = new Tree(this)
        }
        return this.tree
    }

}

module.exports = Raptor
module.exports.models = models

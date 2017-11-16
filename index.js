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
const EventEmitter = require("eventemitter3")

const BASE_URL = "http://raptor.local"

/**
 * Raptor SDK wrapper
 *
 * @author Luca Capra <luca.capra@create-net.org>
 * @copyright FBK/CREATE-NET
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

        this.defaultConfig = {
            domain: null,
            token: null,
            username: null,
            password: null,
            url: BASE_URL,
            debug: false,
            // oauth2
            clientId: null,
            clientSecret: null,
            scopes: null,
        }


        if(typeof config === "string") {
            config = {
                token: config
            }
        }

        this.setConfig(config)
    }

    getConfig() {
        return this.config
    }

    setConfig(cfg) {

        this.config = Object.assign({}, this.defaultConfig, cfg)

        if(!this.config.domain && (this.config.app || this.config.appId)) {
            this.config.domain = this.config.app || this.config.appId
        }

        // reset oauth2 url
        if(this.config.clientId) {
            this.config = Object.assign(this.config, {
                accessTokenUri: this.config.accessTokenUri || `${this.config.url}${this.routes.accessTokenUri}`,
                authorizationUri: this.config.authorizationUri || `${this.config.url}${this.routes.authorizationUri}`,
                redirectUri: this.config.redirectUri || `${this.config.url}${this.routes.redirectUri}`,
            })
        }

        this.Auth().reset()
        d("Client configuration: %j", this.config)
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

    App() {
        if(!this.app) {
            const App = require("./lib/App")
            this.app = new App(this)
        }
        return this.app
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

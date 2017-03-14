/*
  global describe
  global it
  global console
*/

var configFile = "./data/config.json";

var Raptor = require('../index');
var Promise = require('bluebird');

var assert = require('chai').assert;
var dbg = require('debug')("raptorjs:test:api:delegate")

var config = require(configFile)
var def = require('./data/device')
var r;

var userPasswd = "bar9000"

var createObject = (rr) => {
  def.name = new Date();
  return rr.create(def);
}
var createUser = (name) => {
  var u = {
    username: (name || "foo") + "_" + (new Date()).getTime(),
    password: userPasswd,
    email: (name || "foo") + "_" + (new Date()).getTime() + "@raptor.local"
  }
  return r.auth.users.create(u);
}

describe('raptor', function () {
  describe('Object access delegation', function () {
    it('should allow direct access', function () {

      this.timeout(5000);

      r = new Raptor(config);

      return Promise.join(
          createUser("u1"), createUser("u2"),
          (u1, u2) => Promise.resolve({
            u1,
            u2
          }))
        .then(function (objs) {

          dbg("got u1 %s and u2 %s", objs.u1.uuid, objs.u1.uuid)

          var cfg1 = {
            url: config.url,
            username: objs.u1.username,
            password: userPasswd,
          }
          var r1 = new Raptor(cfg1)

          var cfg2 = {
            url: config.url,
            username: objs.u2.username,
            password: userPasswd,
          }
          var r2 = new Raptor(cfg2)

          dbg("Creating objects")
          return Promise.join(
            createObject(r1), createObject(r1),
            createObject(r2), createObject(r2),
            function (
              o1a, o1b,
              o2a, o2b
            ) {
              dbg("Created objects, add childs")
              return Promise.join(o1a.addChild(o1b), o2a.addChild(o2b), function () {
                dbg("Done")
                return Promise.resolve({
                  o1a,
                  o2a,
                  o1b,
                  o2b,
                  r1,
                  r2,
                  u1: objs.u1,
                  u2: objs.u2
                })
              })
            }
          )
        })
        .then(function (objs) {

          dbg("1b fullpath %s/%s", objs.o1b.path, objs.o1b.id);
          dbg("2b fullpath %s/%s", objs.o2b.path, objs.o2b.id);

          dbg("U1 allow PUSH,PULL access to U2 on O1A")
          dbg("u2: %s", objs.u2)

          return objs.o1a.permissions.get(objs.u1).then(function (ownerPerms) {
            dbg("Permissions for u1: %j", ownerPerms)

            return objs.o1a.permissions.set(objs.u2, [Raptor.permissions.PUSH, Raptor.permissions.PULL])
              .then(function (setted) {

                dbg("u2 permissions set, check if valid: %j", setted)

                return objs.o1a.permissions.get(objs.u2).then(function (perms) {

                  dbg("Permissions for u2: %j", perms)

                  assert.equal(perms.length, setted.length)

                  return objs.o1a.permissions.get(objs.u1).then(function (ownerPerms2) {
                    dbg("Permissions for u1 after all: %j", ownerPerms2)

                    assert.equal(ownerPerms.length, ownerPerms2.length)

                    return Promise.resolve(objs)
                  })
                })
              })
          })
        })
        .then(function (objs) {

          dbg("Checking if u2 can push data")

          var mymsg = "data from u2"

          var o1a_u2 = objs.r2.newObject(objs.o1a.toJSON());
          return o1a_u2.stream("test")
            .push({
              num: 1,
              bool: true,
              spatial: [11, 45],
              text: mymsg
            })
            .then(function () {
              dbg("Stored data by u2")
              return new Promise(function (resolve, reject) {

                dbg("Wait to check for data")
                setTimeout(function () {
                  dbg("Checking if u1 can read data")
                  o1a_u2.stream("test")
                    .lastUpdate()
                    .then(function (data) {
                      dbg("Got data: %j", data)
                      dbg("Msg: %j", data.channels.text)
                      if(data.channels.text === mymsg)
                        resolve(objs)
                      else
                        reject(new Error("Message mismatch"))
                    })
                }, 1000)
              })
            })

        })
    })
    it('should gain access from parent permissions', function () {

      this.timeout(5000);

      r = new Raptor(config);


      return Promise.join(createUser("u1"), createUser("u2"), (u1, u2) => {
        return Promise.resolve({
          u1,
          u2
        })
      })
        .then(function (objs) {

          dbg("got u1 %s and u2 %s", objs.u1.uuid, objs.u1.uuid)

          var cfg1 = {
            url: config.url,
            username: objs.u1.username,
            password: userPasswd,
          }
          var r1 = new Raptor(cfg1)

          var cfg2 = {
            url: config.url,
            username: objs.u2.username,
            password: userPasswd,
          }
          var r2 = new Raptor(cfg2)

          return Promise.join(createObject(r1), createObject(r1), function (o1a, o1b) {
            return Promise.join(o1a.addChild(o1b), function () {
              return Promise.resolve({
                o1a,
                o1b,
                r1,
                r2,
                u1: objs.u1,
                u2: objs.u2,
              })
            })
          })
        })
        .then(function (objs) {
          dbg("U1 allow PUSH,PULL access to U2 on O1A (parent object)")
          return objs.o1a.permissions.set(objs.u2, [
            Raptor.permissions.PUSH,
            Raptor.permissions.PULL
          ])
            .then(function () {
              return Promise.resolve(objs)
            })
        })
        .then(function (objs) {

          dbg("Checking if u2 can push data to child object")

          var mymsg = "data from u2"

          var o1b_u2 = objs.r2.newObject(objs.o1b.toJSON());
          return o1b_u2.stream("test")
            .push({
              num: 1,
              bool: true,
              spatial: [11, 45],
              text: mymsg,
            })
            .then(function () {
              dbg("Stored data by u2")
              return new Promise(function (resolve, reject) {

                dbg("Wait to check for data")
                setTimeout(function () {
                  dbg("Checking if u1 can read data from u2")
                  objs.o1b.stream("test")
                    .lastUpdate()
                    .then(function (data) {
                      dbg("Got data: %j", data)
                      dbg("Msg: %j", data.channels.text)
                      if(data.channels.text === mymsg)
                        resolve(objs)
                      else
                        reject(new Error("Message mismatch"))
                    })
                }, 1000)
              });
            })

        })


    })
  })
})

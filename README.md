# raptor.js

Raptor IoT broker javascript SDK

# Topics
- [Introduction](#introduction)
- [Installation](#installation)

  - [Node.js](#nodejs)
  - [Browser](#browser)

- [Library configuration](#library-configuration)

- [Example usage](#example-usage)

  - [List all Objects](#list-all-service-objects)
  - [Search for Objects](#search-for-service-objects)
  - [Create a Object](#create-a-service-object)
  - [Load a Object definition](#load-a-service-object-definition)
  - [Sending data update](#sending-data-update)
  - [Loading a Object by ID](#loading-a-service-object-by-id)
  - [Retrieving data from a Object](#retrieving-data-from-a-service-object)
  - [Search for data in a Stream](#search-for-data-in-a-stream)

    - [Numeric range](#numeric-range)
    - [Time range](#time-range)
    - [Match](#match)
    - [Bounding box](#bounding-box)
    - [Distance](#distance)
    - [Combining searches](#combining-searches)

- [Getting realtime updates](#getting-realtime-updates)

  - [Connecting to the broker](#connecting-to-the-broker)
  - [Listening for updates to a stream](#listening-for-updates-to-a-stream)
  - [Listening for all the updates](#listening-for-all-the-updates)

- [Actuations](#actuations)

  - [Invoking an actuation](#invoking-an-actuation)
  - [Listening for actuations](#listening-for-actuations)

- [Additional notes](#additional-notes)

  - [Async impl](#async-impl)
  - [API support](#api-support)

- [Tests](#tests)

- [Contributing](#contributing)
- [Docs](#docs)
- [License](#license)
- [Changelog](#Changelog)

--------------------------------------------------------------------------------

# Introduction

Raptor.js exposes the feature from the [Raptor](http://github.com/raptorbox/raptor) platform as a convinient javascript API.

Read further for a gentle introduction or jump to the generated [API documentation](http://raptorbox.github.io/raptorjs/)

# Installation

## Node.js

Install the module from the git repository

`npm i raptorbox/raptorjs`

and then import it in your code

`var Raptor = require('raptor')`

## Browser

The library is configured to works with webpack. To generate an build run `webpack` inside the repository directory

# Library configuration

The minimal configuration required is the apiKey to access the API.

`var raptor = new Raptor('your api key 1');`

Login with user and password (will fetch a session apiKey automatically)

```javascript
var raptor2 = new Raptor({
  username: "admin",
  password: "admin"
});
```

# Example usage

## List all Objects

```javascript
raptor.list()

    .then(function(list) {
        console.info("List loaded, %s elements", list.length);
    })

    // .catch is optional, will report errors, if any occurs
    .catch(function(e) {
        console.warn("An error occured!");
    })

    // .finally is optional too, will run after the request is completed (either if failed)
    .finally(function() {
        console.log("Done");
    });
```

Load all the Objects in the list.

```javascript
raptor.list().map(raptor.load).then(function(list) {
    // list is an array containing ServiceObject instances
    list.forEach(function(so) {
        console.log("Loaded %s -> %s", so.id, so.toString());
    })
})
```

Get the last inserted data from an Object

```javascript
var id = "<object-id>"
var streamName = "position"

raptor.load(id).then(function(obj) {
    // return a Promise to use further chainability
    return obj.stream(streamName).lastUpdate();
})
.then(function(record) {
  console.log("Got data: %j", record.toJSON())
})
```

Get a list of data from an Object

```javascript
var id = "<object-id>"
raptor.load(id).then(function(obj) {
    // return a Promise to use further chainability
    return obj.stream("position").pull();
})
.then(function(result) {
    // result contains a list of records
    result.data.forEach(function(record) {
        console.log( "Location data for %s: %j",
            record.stream() // Stream reference
                    .getServiceObject() // ServiceObject reference
                      .id ,
            record.toJSON() // transform the object to a plain JSON object
        );
    });

})
```

Delete an object with `raptor.delete(objectId)`

Delete all the objects instances with

```javascript
raptor.list().map(raptor.delete).then(function() {
    console.log("All gone");
})
```

## Search for Objects

To perform a search at least one option is required, multiple option will be AND-ed together

```javascript
var params = {
  query: "*berry", // Free-textquery, use * for wildcard
  name: "drone", // match any name containing `drone`
  description: "drone",
  customFields: {
     model: "a4b2788"
  }
};

// paging support
var limit = 1000, // get 1000 results
    offset = 10; // starting from record 10

raptor.search(params, limit, offset).then(function(list) {
    console.log("Found %s", list.size());
})
```

## Create a Object

The `position` stream will keep track of the movement of the drone.

```javascript
var drone = {
   "name": "Drone",
   "description": "My amazing drone",
   "streams": {
        "position": {
            "location": "geo_point" // a geo-point object
            "altitude": "number", // a number
        },
        "sensing": {
          "light":    "number",
          "alarm":    "boolean"
          "message":  "string"
        }
    },
    "actions": [ "take-photo", "beep" ],
    "customFields": {
        model: 'drone-001',
        colors: ['red', 'blue']
    }    
}
```

Create the drone Object in Raptor

```javascript
raptor.create(drone)
    .then(function(drone) {
        // drone is the new ServiceObject create
        console.info("Drone ServiceObject created, id" + drone.id);
        console.info(drone.toString());
        // see below how to use the drone object to send and receive data
    }).catch(function(e) {
        console.warn("An error occured!");
        return raptor.Promise.reject(e);
    });
```

## Sending data update

First you have to select the stream you want to use, `position` in our case, and send the data with the `push` method.

```javascript
drone.stream('position').push({
    latitude: 11.234,
    longitude: 45.432
})
```

## Loading an object by ID

Let's load an instance of a Drone from it's definition

```javascript
var soid = '<object-id>';
raptor.load(soid)
  .then(function(drone) {
      console.info("Drone loaded, id %s", drone.id);
      console.info(drone.toJSON());
  })
```

## Retrieving data from an object

The returned value is a `ResultSet` object which expose some simplified methods to use the data from the stream

```javascript
// paging support
var offset = 0,
    limit = 500

drone.stream("position")
    .pull(offset, limit)
      .then(function(result) {

        console.log("Data size %s", result.size());

        //Data is stored in `result.data`

        //Get the Stream object reference
        var stream = data.stream()

        // Drone object reference
        var object = data.stream().getServiceObject()

        // get RecordSet at a certain index
        var record = data.get(index);

    });
```

## Search for data in a Stream

Methods to search for data in a stream

Available search types are

- [Numeric range](#numeric-range)
- [Time range](#time-range)
- [Match](#match)
- [Bounding box](#bounding-box)
- [Distance](#distance)

### Numeric Range

Search for data in a stream matching a numeric range constrain

```javascript
drone.stream('stream name').searchByNumber("channel name", { from: 'val1', to: 'val2' });
drone.stream('stream name').searchByNumber("channel name", val_from, val_to });
```

### Time Range

Search for data in a time range, creation date (`lastUpdate`) value will be used to match the search

```javascript
// timeFrom / timeTo can be any value readable as a javascript `Date`
drone.stream('stream name').searchByTime(timeFrom, timeTo);
drone.stream('stream name').searchByTime("Tue May 13 2014 10:21:18 GMT+0200 (CEST)", new Date());
```

### Match

Search for a matching value in a provided channel

```javascript
drone.stream('stream name').searchByText("channel name", "string to search");
```

### Bounding box

Search by a delimiting [bounding box](http://en.wikipedia.org/wiki/Minimum_bounding_box)

This search type will look to match a channel named `location` with a geojson value. [See API docs](http://docs.servioticypublic.apiary.io/#dataqueries)

```javascript
drone.stream('stream name').searchByBoundingBox([
    // upper point
    { latitude: '', longitude: '' },
    // lower point
    { latitude: '', longitude: '' }
]);
```

### Distance

Search data by distance

```javascript
// default unit is km
drone.stream('stream name').searchByDistance({ latitude: 11,longitude: 46 }, 10);

// specifying a unit
drone.stream('stream name').searchByDistance({ latitude: 11,longitude: 46 }, 1000, 'm');
```

### Combining searches

To combine multiple filters

_Notice_ that `distance` is incompatible with `bbox`, if both provided `bbox` will be used

```javascript
drone.stream('stream name').search({
    distance: {
        position: { latitude: 11, longitude: 46 },
        // or
        // position: [11, 46],
        value: 1,
        unit: 'km'
    },
    numeric: {
        channel: 'channel name',
        from: 'val1'
        to: 'val2'
    },
    time: {
        from: 1368433278000,
        to:   1399969278000
    },
    match: {
        channel: "channel name",
        string: "string to search"
    },
    bbox: {
        coords: [
            // upper point
            { latitude: '', longitude: '' },
            // lower point
            { latitude: '', longitude: '' }
        ]
        // or
        // coords: [ toplat, toplon, bottomlat, bottomlon ]
    }
});
```

# Getting realtime updates

Updates are delivered over MQTT subscriptions

## Connecting to the broker

Connection can be done by providing the `username` and `password` or with an empty `username` and a valid apiKey as the `password`.

Those configuration are automatically taken from the configuration object provided by the library

## Listening for updates to a stream

Get realtime updates from data streams

```javascript
drone.stream('stream name').subscribe(function(data) {
    console.log("Stream updated!");
    console.log(data);
})
```

To stop listening

```javascript
drone.stream('stream name').unubscribe(); // .then().catch().finally()
```

## Listening for events

In some case could be useful to receive all the notifications available, to do so use listen to the `data` event on the ServiceObject

```javascript
// register to updates
drone.subscribe(function(event) {
  console.log("Received event %j", event);
})
```

Unregister from events with `drone.unsubscribe()`

# Actuations

Actuations allow to perform operations on an Object.

## Invoking an actuation

To invoke an actuation use the `invoke` method and provide additional parameters as argument

Note that the argument passed to `invoke` **must** be a string, so to send JSON take care of serializing it accordingly

```javascript
var body = JSON.stringify({ exposure: 'high', blur: 0.2 }); // must be a string!
drone.action('take-photo').invoke(body)
```

## Listening for actuations

On the device side you can listen for specific actions and implement actuations on their arrival.

```javascript
drone.action("take-photo").listen(function(id, raw) {
    // parse content
    var params = JSON.parse(raw)
    console.log("[id: %s] Take a photo with exposure: %j and blur: %s", id, params.exposure, params.blur);
    // camera.takePhoto(params)
})
```

# Contributing

Feel free to open an issue or contact us to discuss the library status and future development.

# Docs

API docs can be generated using `jsdoc`

`./node_modules/jsdoc/jsdoc.js ./ -c ./jsdoc.json -l -r`

# License

Apache2

```
Copyright CREATE-NET

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

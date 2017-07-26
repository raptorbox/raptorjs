# Raptor javascript SDK

![Build status](https://travis-ci.org/raptorbox/raptorjs.svg) ![npm release](https://badge.fury.io/js/raptor-sdk.svg)

Raptor IoT platform javascript SDK

# Topics

- [Introduction](#introduction)
- [Installation](#installation)

  - [Node.js](#nodejs)
  - [Browser](#browser)

- [Library configuration](#library-configuration)

- [Example usage](#example-usage)

  - [List all devices](#list-all-devices)
  - [Search for devices](#search-for-devices)
  - [Create a device](#create-a-device)
  - [Load a device definition](#load-a-device-definition)
  - [Sending data update](#sending-data-update)
  - [Load a device by ID](#loading-a-device-by-id)
  - [Retrieving data](#retrieving-data)
  - [Search for data](#search-for-data)

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

- [Tests](#tests)

- [Contributing](#contributing)

- [Docs](#docs)

- [License](#license)
- [Changelog](#Changelog)

--------------------------------------------------------------------------------

# Introduction

Raptor.js exposes the feature from the [Raptor](http://github.com/raptorbox/raptor) platform as a convenient javascript API.

This branch is pair with the Raptor API `v4.x`

# Installation

## Node.js

Install the module from the git repository

```sh
npm i raptorbox/raptorjs
```


and then import it in your code

```javascript
const Raptor = require('raptor')
```

## Browser

To generate a build use `webpack` inside the repository directory. A generated build is made available under [dist](./dist/) for stable releases.

# Library configuration

The minimum configuration required is the token to access the API.

```javascript
const raptor = new Raptor('your api key 1');
```

Login with user and password (will fetch a session apiKey automatically). An additional `url` can be provided to use a personalized endpoint

```javascript
const raptor = new Raptor({
  username: "admin",
  password: "admin",
  url: "http://raptor.local",
});
```

# Example usage

## List all devices

```javascript
raptor.Inventory().list()
    .then((list) => console.info("List loaded, %s elements", list.length))
    .catch((e)   => console.warn("An error occured! %j", e))
```

Delete an device with

```javascript
raptor.Inventory().delete(deviceId)
```

Delete all the devices instances with

```javascript
raptor.list()
    .map(raptor.delete)
    .then(() => console.log("All clear"))
```

## Search for devices

To perform a search at least one option is required, multiple option will be AND-ed together

-   Field `id`, `name`, `description` supports text-based queries, with those optional params
    ```javascript
    {
        // one of those values
        in: [ "value1", "value2" ],
        // contains string
        contains: "some string",
        // exactly match the string
        match: "exact match"
    }
    ```

-   Field `properties` supports object-based queries, with those optional params
    ```javascript
    {
        // has a key
        containsKey: "my_key",
        // has a value
        containsValue: 1001,
        // contains those key-values
        has: {
            field1: true,
            field2: 1001
        }
    }
    ```

```javascript
var params = {
    // short format for contains
    id: "1111-3333-4444-5555",
    name: {
        in: ["My device", "quadcopter_1"]
    }
    description: {
        contains: "example"
    },
    // short format for has: {...}
    properties: {
        model: "a4b2788"
    }
}

// paging support
var limit = 1000, // get 1000 results
    offset = 10; // starting from record 10

raptor.Inventory().search(params, limit, offset)
    .then((list) => console.log("Found %s", list.size()))
```

## Create a device

```javascript
var definition = {
   "name": "Robot",
   "description": "My device",
   "streams": {
        "sensing": {
          "light":    "number",
          "alarm":    "boolean"
          "message":  "string"
        }
    },
    "actions": [ "take-photo", "beep" ],
    "properties": {
        "model": 'robot-001',
        "colors": ['red', 'blue']
    }    
}
```

Create the device in Raptor

```javascript
raptor.Inventory().create(definition)
    .then((device) => {
        // device is the new device create
        console.info("Drone device created, id" + device.id);
        console.info(device.toJSON());
        // see below how to use the device to send and receive data
    })
    .catch((e) => {
        console.warn("An error occured!");
        return Promise.reject(e);
    });
```

## Sending data update

First you have to select the stream you want to use, `sensing` in our case, and send the data with the `push` method.

```javascript

const record = device.getStream('sensing').createRecord({
    light: 90,
    alarm: true,
    message: "good morning",
})

raptor.Stream().push(record)

```

To store a searchable location in the stream use the special `location` field. The `timestamp` field allow to specify the date/time of the record

```javascript

const record = device.getStream('sensing').createRecord({
    timestamp: 2037304801,
    location: {
        latitude: 11.234,
        longitude: 45.432
    }
    channels: {
        light: 42,
        alarm: false,
        message: "ok",
    }
})

raptor.Stream().push(record)

```

## Loading a device by ID

Let's load an instance of a Drone from it's definition

```javascript

let deviceId = "the device id";

raptor.Inventory().read(deviceId)
    .then((device) => console.info("Device loaded, id %s: \n%s",
        device.id,
        device.toJSON()
    ))

```

## Retrieving data from a device

The returned value is an array of records from the device

```javascript

// paging support
var offset = 0,
    limit = 500

raptor.Stream().pull(device.getStrem("sensing"), offset, limit)
      .then((result) => console.log("Data size %s == %s", result.length, limit));
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
raptor.Stream().search(device.getStream('sensing'), {
    channels: {
        // search for light threshold between 30, 100
        light: [30, 100]
    }
})
```

### Time Range

Search for data in a time range, creation date (`lastUpdate`) value will be used to match the search

```javascript

const to    = Math.floor((new Date).getTime() / 1000), // now, in UNIX seconds
      from  =  to - (60*60*24), // -1 day

raptor.Stream().search(device.getStream('sensing'), {
    timestamp: {
        between: [ from, to ]
    }
})
```

### Match

Search for a matching value in a provided channel

```javascript
raptor.Stream().search(device.getStream('sensing'), {
    channels: {
        message: {
            match: "warning"
        }
    }
})
```

### Bounding box

Search by a delimiting [bounding box](http://en.wikipedia.org/wiki/Minimum_bounding_box)

This search type will look to match a channel named `location` with a geojson value. [See API docs](http://docs.servioticypublic.apiary.io/#dataqueries)

```javascript
raptor.Stream().search(device.getStream('sensing'), {
    location: {
        boundingBox: {
            northWest: {
                latitude: 11.123
                longitude: 45.321
            },
            southWest: {
                latitude: 12.123
                longitude: 46.321
            }
        }
    }
})
```

### Distance

Search data by distance

```javascript
raptor.Stream().search(device.getStream('sensing'), {
    location: {
        distance: {
            center: {
                latitude: 11.123,
                longitude: 45.321
            },
            radius: 100,
            unit: "km"
        }
    }
})
```

### Combining searches

To combine multiple filters

_Notice_ that `distance` is incompatible with `bbox`, if both provided `bbox` will be used

```javascript
raptor.Stream().search(device.getStream('sensing'), {
    location: {
        distance: {
            center: {
                latitude: 11.123,
                longitude: 45.321
            },
            radius: 100,
            unit: "km"
        }
    }
    channels: {
        // search for light threshold between 30, 100
        light: [30, 100],
        // and with alarm to true
        alarm: true,
        // and message matching "warning"
        message: {
            match: "warning"
        }
    }
})
```

# Getting realtime updates

Updates are delivered over MQTT subscriptions

## Connecting to the broker

Connection can be done by providing the `username` and `password` or with an empty `username` and a valid apiKey as the `password`.

Those configuration are automatically taken from the configuration object provided by the library

## Listening for updates to a stream

Get realtime updates from data streams

```javascript
device.Stream().subscribe(device.getStream("sensing"), (data) => {
    console.log("Stream updated!");
    console.log(data);
})
```

To stop listening

```javascript
device.Stream().unsubscribe(device.getStream("sensing"))
```

## Listening for events

In some case could be useful to receive all the notifications available, to do so use listen to the `data` event on the device

```javascript
device.Inventory().subscribe(device, (data) => {
    console.log("Stream updated!");
    console.log(data);
})
```

Unregister from events subscription with

```javascript
device.Inventory().unubscribe(device)
```

# Actions

Actions allow to invoke virtual operations on an device.

## Invoking an actuation

To invoke an actuation use the `invoke` method and provide additional parameters as argument

Note that the argument passed to `invoke` **must** be a string, so to send JSON take care of serializing it accordingly

```javascript
var status = JSON.stringify({ exposure: 'high', blur: 0.2 }); // must be a string!
raptor.Action().invoke(device.getAction('take-photo'), status)
```

## Listening for actions

On the device side you can listen for specific actions and implement actuations on their arrival.

```javascript
raptor.Action().subscribe(device.getAction("take-photo"), (id, raw) => {
    // parse content
    var params = JSON.parse(raw)
    console.log("[id: %s] Take a photo with exposure: %j and blur: %s", id, params.exposure, params.blur);
    // camera.takePhoto(params)
})
```

# Contributing

Feel free to open an issue or contact us to discuss the library status and future development.

## Adding a release


# Docs

API docs can be generated using `jsdoc`

`./node_modules/jsdoc/jsdoc.js ./ -c ./jsdoc.json -l -r`

# License

Apache2

```
Copyright FBK/CREATE-NET

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

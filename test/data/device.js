module.exports = {
  "name": "smart sensor device",
  "description": "test device",
  "streams": {
    "test": {
      "type": "test",
      "name": "test",
      "description": "test1",
      "channels": {
        "num": {
          "name": "num",
          "unit": "num",
          "type": "number"
        },
        "bool": {
          "name": "bool",
          "unit": "bool",
          "type": "boolean"
        },
        "spatial": {
          "name": "spatial",
          "unit": "spatial",
          "type": "geo_point"
        },
        "text": {
          "name": "text",
          "unit": "text`",
          "type": "string"
        }
      }
    },    
    "temperature": {
      "description": "Measure the temperature",
      "channels": {
        "degree": {
          "type": "number",
        },
        "name": "string",
        "color": "string",
        "isActive": "boolean"
      }
    }
  },
  "customFields": {
    "example": true
  },
  "settings": {
    "storeEnabled": false
  },
  "actions": [
    "makeCall",
    {
      "name": "makePhoto",
      "status": "active=1&destroy=now"
    },
    "eatPotatoes"
  ]
};

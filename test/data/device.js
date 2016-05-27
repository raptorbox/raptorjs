module.exports = {
    "name": "smart sensor device",
    "description": "test device",
    "streams": {
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

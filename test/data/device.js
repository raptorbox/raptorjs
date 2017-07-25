module.exports = {
    "name": "Robot",
    "description": "robotic device",
    "streams": {
        "test": {
            "num": "number",
            "bool": "boolean",
            "text": "string"
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
    "properties": {
        "example": true
    },
    "settings": {
        "storeData": true,
        "eventsEnabled": false
    },
    "actions": [
        "makeCall",
        {
            "name": "makePhoto",
            "status": "active=1&destroy=now"
        },
        "eatMeal"
    ]
}

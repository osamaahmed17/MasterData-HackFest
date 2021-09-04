module.exports =
{
  "ORDER_SCHEMA": {
    "title": "Order",
    "description": "Order schema",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "city": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "orderId":{
        "type":"string"
      },
      "parcelSize": {
        "type": "string"
      },
      "phoneNumber": {
        "type": "string"
      },
      "additionalComment": {
        "type": "string"
      },
      "pickupLocation": {
        "type": "string"
      },
      "postalCode": {
        "type": "string"
      },
      "shoppersEmail": {
        "type": "string"
      },
      "userEmail": {
        "type": "string"
      },
      "status": {
        "type": "string"
      },
      "deliveryDate": {
        "type": "string"
      },
      "streetAddress":{
        "type": "string"
      },
      "storeName":{
        "type": "string"
      }
    }
  },
  "CONFIGURATION_SCHEMA": {
    "title": "configuration",
    "description": "configuration schema",
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "key": {
        "type": "string"
      },
      "value": {
        "type": "object"
      }
    }
  }
}
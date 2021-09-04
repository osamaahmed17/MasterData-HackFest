
const mongoose = require("mongoose")
const { Schema } = require('mongoose')


class orderModel {
  constructor() {
    this.initSchema();
}
  initSchema() {
    const schema = new Schema({
      city: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      parcelSize: {
        type: String
      },
      phoneNumber: {
        type: String
      },
      additionalComment: {
        type: String
      },
      pickupLocation: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      shoppersEmail: {
        type: String,
        required: true
      },
      userEmail: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      },
      deliveryDate: {
        type: String,
        required: true
      },
      streetAddress:{
        type: String,
        required: true
      },
      storeName:{
        type: String,
        required: true
      }
    });
    schema.set('toJSON', {
      transform: function (doc, ret, options) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
      }
 });
    mongoose.model("order", schema);
  }
  getInstance() {
    return mongoose.model("order");
  }
}

module.exports = new orderModel;



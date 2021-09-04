
const mongoose = require("mongoose")
const { Schema } = require('mongoose')
const uniqueValidator= require('mongoose-unique-validator')

class configurationModel {

    initSchema() {
        const schema = new Schema({
            key: {
                type: String,
                required: true,
                uniqueCaseInsensitive: true,

            },
            value: {
                type: Object,
                required: true,
            }
        });
        schema.index({ key: 1 }, { unique: true }); 
        schema.plugin(uniqueValidator);
        mongoose.model("configuration", schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model("configuration");
     
    }
}

module.exports = configurationModel;


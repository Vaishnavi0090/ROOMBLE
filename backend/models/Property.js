const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    town: {
        type: String,
        required: true
    },
    city: {
        type : String,
        required : true
    },
    address: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    bhk: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        default: []
    },
    price: {
        type: Number,
        required: true
    },
    available : { // true if not delisted, false if delisted
        type : Boolean,
        required : false,
        default : true
    },
    Images : {
        type : [String],
        default : [],
        required : false
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);

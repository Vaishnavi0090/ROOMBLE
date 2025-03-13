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
    attached_bathrooms: {
        type: Number,
        required: true
    },
    criteria: {
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
    electricity_water_included: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);

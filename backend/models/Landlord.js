const mongoose = require('mongoose');

const LandlordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    propertyList: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Landlord', LandlordSchema);
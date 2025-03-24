const mongoose = require('mongoose');

const LandlordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type:{
        type: String,
        default: 'landlord'
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
    },
    conversations: {
        type: Array,
        default: []
    },
    Images : {
        type : String,
        default : "http://127.0.0.1:3000/Pictures/Default.png",
        required : false
    },
    reviews: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Landlord', LandlordSchema);
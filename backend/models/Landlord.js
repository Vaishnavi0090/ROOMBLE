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
        default : "",
        required : false
    },
    reviews: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'reviews.reviewerType',
            required: true
        },
        reviewerType: {
            type: String,
            enum: ['Tenant', 'Landlord'],
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
})

module.exports = mongoose.model('Landlord', LandlordSchema);
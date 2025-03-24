const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    city: {
        type : String,
        required : true
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
        default : true
    },
    Images : {
        type : [String],
        default : []
    },
    reviews: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'reviews.reviewerType',
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
    }],
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Landlord',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
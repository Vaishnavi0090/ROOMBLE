const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
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
    locality: {
        type: String,
        required: true
    },
    gender: {// false female,true male
        type: Boolean,
        required: true
    },
    smoke: {
        type: Boolean,
        required: true 
    },
    veg: {
        type : Boolean,
        required: true
    },
    pets: {
        type: Boolean,
        required: true
    },
    flatmate: {//true if wants
        type: Boolean,
        required: true
    },
    conversations: {
        type: Array,
        default: []
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

module.exports = mongoose.model('Tenant', TenantSchema);

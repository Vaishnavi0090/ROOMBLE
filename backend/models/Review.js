const mongoose = require('mongoose');

// Define the Review Schema
const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId, // The person writing the review
        refPath: 'reviewerType', // Dynamic reference to Tenant or Landlord
        required: true
    },
    reviewerType: {
        type: String,
        enum: ['Tenant', 'Landlord'], // Can be either Tenant or Landlord
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId, // The person being reviewed
        refPath: 'revieweeType', // Dynamic reference to either Tenant or Landlord
        required: true
    },
    revieweeType: {
        type: String,
        enum: ['Tenant', 'Landlord'], // Can be either Tenant or Landlord
        required: true
    },
    rating: {
        type: Number, // Rating from 1 to 5
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String, // Optional comment
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically stores the review date
    }
});

// Export the Review model
module.exports = mongoose.model('Review', ReviewSchema);

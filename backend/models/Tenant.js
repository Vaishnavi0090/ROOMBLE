const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'tenant'
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
    city: {
        type : String,
        required : false,
        default : "Mumbai"
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
    description: {
        type : String,
        required : false,
        default : "This user hasn't setup a description yet"
    },
    conversations: {
        type: Array,
        default: []
    },
    bookmarks_tenants : { //Stores the ID of the tenant
        type : [String],
        default : [],
        required : false
    },
    bookmarks_property : { //Only stores the ID of the property
        type : [String],
        default : [],
        required : false
    },
    Images : {
        type : String,
        default : "http://127.0.0.1:3000/Pictures/Default.png",
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

module.exports = mongoose.model('Tenant', TenantSchema);

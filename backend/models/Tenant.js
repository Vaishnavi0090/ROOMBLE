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
    gender: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    alcohol: {
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
    }


})

module.exports = mongoose.model('Tenant', TenantSchema);

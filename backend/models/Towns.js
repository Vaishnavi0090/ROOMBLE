const mongoose = require('mongoose');

const TownsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    distances: {
        type: Map,
        of: Number,
        required: true
    },
    nearest_towns: {
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Towns', TownsSchema);
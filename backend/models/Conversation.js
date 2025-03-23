const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: {
        type:Array,
        required:true
    },
    messages: {
        type:Array,
        default:[]
    }
})
/*
    Message Format:
    {
        senderID: String,
        message: String,
        timestamp: Date,
    }
*/

module.exports = mongoose.model('Conversation', ConversationSchema);
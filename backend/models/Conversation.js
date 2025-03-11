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
        read1: Boolean, // read by member[0]
        read2: Boolean  // read by member[1]
        // one of them will be trivially true
    }
*/

module.exports = mongoose.model('Conversation', ConversationSchema);
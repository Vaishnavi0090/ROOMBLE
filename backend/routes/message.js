const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const Conversation = require('../models/Conversation');
const checkuser = require('../middlewares/checkuser');

module.exports = (io, onlineUsers) => {
    router.post('/getUserStatus', async (req, res) => {
        try{
            const { userID } = req.body;
            if (onlineUsers.has(userID)) {
                res.send({ status: 'online', success: true });
            } else {
                res.send({ status: 'offline', success: true });
            }
        }
        catch(err){
            console.log(err);
            res.send({ success: false });
        }
    })

    router.post('/getConversations', async (req, res) => {
        // Get all conversations of a user
        try {
            const { userID } = req.body;
            // find all conversations where userID is a member
            var conversations = await Conversation.find({ members: userID });
            // also include the name of the other user, number of unread messages, and timestamp of the last message
            for (let i = 0; i < conversations.length; i++) {
                const conversation = conversations[i];
                const otherUserID = conversation.members[0] == userID ? conversation.members[1] : conversation.members[0];
                const otherUser = await Tenant.findById(otherUserID);
                if (!otherUser) {
                    const otherUser = await Landlord.findById(otherUserID);
                    if (!otherUser) {
                        res.send({ success: false });
                        return;
                    }
                }
                conversations[i] = {
                    conversation_id: conversation._id,
                    otherUser: otherUser.name,
                    otherUserID: otherUserID,
                    unread: conversation.messages.filter(message => message.sender != userID && message.read1 == false).length,
                    timestamp: conversation.messages[conversation.messages.length - 1].timestamp
                }
            }
            res.send({ conversations, success: true });
        } catch (err) {
            console.log(err);
            res.send({ success: false });
        }
    })

    router.post('/getConversation', async (req, res) => {
        // Get conversation between two users from conversation_id
        try {
            const conversation_id = req.body.conversation_id;
            const conversation = await Conversation.findById(conversation_id);
            if (!conversation) {
                res.send({ success: false });
                return;
            }
            res.send({ conversation, success: true });

        } catch (err) {
            console.log(err);
            res.send({ success: false });
        }
    })

    router.post('/sendMessage', checkuser, async (req, res) => {
        const {conversation_id, message} = req.body;
        const senderID = req.user._id;
        // Find conversation
        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            res.send({ success: false });
            return;
        }
        //construct message object
        const newMessage = {
            sender: senderID,
            message: message,
            timestamp: new Date(),
            read1: false,
            read2: false
        }
        //update read status
        if (conversation.members[0] == senderID) {
            newMessage.read1 = true;
        } else {
            newMessage.read2 = true;
        }

        //update conversation
        conversation.messages.push(newMessage);
        await conversation.save();
        //send message to other user
        const receiverID = conversation.members[0] == senderID ? conversation.members[1] : conversation.members[0];
        if (onlineUsers.has(receiverID)) {
            io.to(onlineUsers.get(receiverID)).emit('message', { conversation_id, message: newMessage });

        }
    })

    router.post('/readMessages', checkuser, async (req, res) => {
        const { conversation_id } = req.body;
        const userID = req.user._id;
        const conversation = await Conversation.findById(conversation_id);
        if (!conversation) {
            res.send({ success: false });
            return;
        }
        if (conversation.members[0] == userID) {
            conversation.messages.forEach(message => {
                if (message.sender != userID) {
                    message.read1 = true;
                }
            })
        } else {
            conversation.messages.forEach(message => {
                if (message.sender != userID) {
                    message.read2 = true;
                }
            })
        }
        await conversation.save();
        return res.send({ success: true });
    })

    return router;
}
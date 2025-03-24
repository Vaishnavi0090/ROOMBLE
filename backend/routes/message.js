const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const Conversation = require('../models/Conversation');
const checkuser = require('../middlewares/checkuser');
const mongoose = require('mongoose');
const checkUser = require('../middlewares/checkuser');

module.exports = (io, onlineUsers) => {
    router.post('/getUserNameStatus', async (req, res) => {
        // console.log(onlineUsers);
        try{
            const { userID } = req.body;

            var status = "offline";
            if (onlineUsers.has(userID)) {
                status = "online";
            }
            
            var user = await Tenant.findById(userID);
            if (!user) {
                user = await Landlord.findById(userID);
            }
            if (!user) {
                return res.send({ success: false });
            }
            return res.send({ name: user.name, status: status, success: true, profilepic: user.Images });
        }
        catch(err){
            // console.log(err);
            res.send({ success: false });
        }
    })

    router.post('/getConversations', checkUser , async (req, res) => {
        // Get all conversations of a user
        try {
            const list = req.user.conversations;
            // pass
            // last message
            // name of other user
            // profile picture of other user
            // timestamp of last message
            // conversation_id

            const conversations = [];
            for (let i = 0; i < list.length; i++) {
                // console.log(list[i])
                const conversation = await Conversation.findById(list[i]);
                if (!conversation) {
                    continue;
                }
                const otherID = conversation.members[0].equals(req.user._id) ? conversation.members[1] : conversation.members[0];
                var otherUser = await Tenant.findById(otherID);
                if (!otherUser) {
                    otherUser = await Landlord.findById(otherID);
                }
                if (!otherUser) {
                    continue;
                }
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                var lasttimestamp = null;
                if (lastMessage){
                    lasttimestamp = lastMessage.timestamp;
                }
                conversations.push({
                    conversation_id: conversation._id,
                    lastMessage: lastMessage,
                    name: otherUser.name,
                    profilePic: otherUser.Images,
                    timestamp: lasttimestamp
                })
            }
            return res.send({ conversations, success: true });

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
        console.log("hello")
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
            senderID: senderID,
            message: message,
            timestamp: new Date()
        }

        //update conversation
        conversation.messages.push(newMessage);
        await conversation.save();

        res.send({ success: true, messages: conversation });
        //send message to other user
        const receiverID = conversation.members[0].equals(senderID) ? conversation.members[1] : conversation.members[0];
        // console.log("sending message to", onlineUsers.get(receiverID.toString()));
        if (onlineUsers.has(receiverID.toString())) {
            io.to(onlineUsers.get(receiverID.toString())).emit('message', { conversation_id, messages: conversation });
        }
    })


    router.post('/createConversation', checkuser, async (req, res) => {
        try{
            const { user2 } = req.body;
            const user1 = req.user._id;
            // console.log(req.body)
            const user2_id = new mongoose.Types.ObjectId(user2);

            if(user1.equals(user2_id)){
                return res.send({ success: false, message: "Something went wrong" });
            }

            // Check if conversation already exists
            const conversation = await Conversation.findOne({ members: { $all: [user1, user2_id] } });
            if (conversation) {
                return res.send({ conversation_id: conversation._id, success: true });
            }
            // Create new conversation
            const newConversation = new Conversation({
                members: [user1, user2_id],
                messages: []
            })
            await newConversation.save();

            //add this conversation to both users
            var user1Doc = await Tenant.findById(user1);
            if (!user1Doc) {
                user1Doc = await Landlord.findById(user1);
            }
            user1Doc.conversations.push(newConversation._id);
            await user1Doc.save();

            var user2Doc = await Tenant.findById(user2_id);
            if (!user2Doc) {
                user2Doc = await Landlord.findById(user2_id);
            }
            user2Doc.conversations.push(newConversation._id);
            await user2Doc.save();


            return res.send({ conversation_id: newConversation._id, success: true });
        }
        catch(err){
            // console.log(err);
            res.send({ success: false });
        }

    })


    return router;
}
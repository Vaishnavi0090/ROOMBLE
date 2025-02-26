const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const Conversation = require('../models/Conversation');

router.post('get_conversation', async (req, res) => {
    const conversation_id = req.body.conversation_id;
    try {
        const conversation = await Conversation.findOne({ _id: conversation_id });
        res.send(conversation);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
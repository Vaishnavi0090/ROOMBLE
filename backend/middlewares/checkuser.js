const express = require('express');
const jwt = require('jsonwebtoken');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');
require(`dotenv`).config(`../.env`);
const SECRET_KEY = process.env.SECRET_KEY;

const checkUser = async (req, res, next) => {
    const token = req.header('authtoken');
    const accountType = req.header('accounttype');
    console.log(token);
    console.log(accountType);
    console.log(SECRET_KEY);
    console.log(typeof(accountType));
    console.log(`hi`);
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        let user;

        if (accountType === 'landlord') {
            user = await Landlord.findById(verified.id);
        } else if (accountType === 'tenant') {
            console.log(`bye`);
            user = await Tenant.findById(verified.id);
            console.log(`hi`);
        } else {
            console.log(accountType);
            return res.status(400).json({ message: 'Invalid account type' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = checkUser;
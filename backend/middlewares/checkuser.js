const express = require('express');
const jwt = require('jsonwebtoken');
const Landlord = require('../models/Landlord');
const Tenant = require('../models/Tenant');
require(`dotenv`).config(`../.env`);
const SECRET_KEY = process.env.SECRET_KEY;

const checkUser = async (req, res, next) => {
    const token = req.header('authtoken');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        const user = await Tenant.findById(verified.id);
        if (!user) {
            const user = await Landlord.findById(verified.id);
            if (!user) {
                return res.status(400).json({ message: 'Invalid Token' });
            }
            req.user = user;
            return next();
        }
        req.user = user;
        return next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token', success: false });
    }
};

module.exports = checkUser;